// Helper function to get and refresh Filestreams access token
import { createClient } from '@supabase/supabase-js';
const { decrypt, encrypt } = require('./encryption');

// Use service role key for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get valid access token for user's Filestreams account
 * Automatically refreshes if expired
 * @param {string} userId - User ID
 * @returns {Promise<{access_token: string, account_id: string}>}
 */
export async function getFilestreamToken(userId) {
    // Get user's credentials
    const { data: credentials, error } = await supabase
        .from('filestreams_credentials')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !credentials) {
        throw new Error('Filestreams account not connected');
    }

    // Check if token is still valid (with 5 minute buffer)
    const now = new Date();
    const expiresAt = new Date(credentials.token_expires_at);
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (expiresAt.getTime() - now.getTime() > bufferTime) {
        // Token is still valid
        const decryptedToken = decrypt(credentials.access_token_encrypted);
        console.log('[Filestreams Token] Returning cached token:', {
            hasToken: !!decryptedToken,
            tokenLength: decryptedToken?.length,
            hasAccountId: !!credentials.account_id,
            accountId: credentials.account_id
        });
        return {
            access_token: decryptedToken,
            account_id: credentials.account_id || null,
        };
    }

    // Token expired, refresh it
    console.log('[Filestreams Token] Token expired, refreshing...');

    const apiKey1 = decrypt(credentials.api_key1_encrypted);
    const apiKey2 = decrypt(credentials.api_key2_encrypted);

    const authResponse = await fetch('https://www.filestreams.com/api/v2/authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `key1=${encodeURIComponent(apiKey1)}&key2=${encodeURIComponent(apiKey2)}`,
    });

    if (!authResponse.ok) {
        throw new Error('Failed to refresh Filestreams token');
    }

    const authData = await authResponse.json();

    if (authData._status !== 'success') {
        throw new Error(authData.response || 'Failed to refresh Filestreams token');
    }

    const { access_token, account_id } = authData.data;

    // Update token in database
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await supabase
        .from('filestreams_credentials')
        .update({
            access_token_encrypted: encrypt(access_token),
            token_expires_at: newExpiresAt.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

    console.log('[Filestreams Token] Token refreshed successfully');

    return {
        access_token,
        account_id,
    };
}

module.exports = { getFilestreamToken };
