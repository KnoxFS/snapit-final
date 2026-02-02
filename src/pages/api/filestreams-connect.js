// API endpoint to connect user's Filestreams account
import { createClient } from '@supabase/supabase-js';
const { encrypt } = require('utils/encryption');

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { api_key1, api_key2 } = req.body;

    if (!api_key1 || !api_key2) {
        return res.status(400).json({ error: 'Missing API keys' });
    }

    try {
        // Get authenticated user
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid authentication' });
        }

        // Step 1: Validate API keys by authorizing with Filestreams
        console.log('[Filestreams Connect] Validating API keys...');

        const authResponse = await fetch('https://www.filestreams.com/api/v2/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `key1=${encodeURIComponent(api_key1)}&key2=${encodeURIComponent(api_key2)}`,
        });

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error('[Filestreams Connect] Authorization failed:', authResponse.status, errorText);
            return res.status(400).json({ error: 'Invalid API keys' });
        }

        const authData = await authResponse.json();

        if (authData._status !== 'success') {
            console.error('[Filestreams Connect] Authorization failed:', authData.response);
            return res.status(400).json({ error: authData.response || 'Invalid API keys' });
        }

        const { access_token, account_id } = authData.data;
        console.log('[Filestreams Connect] Authorization successful for account:', account_id);

        // Step 2: Encrypt API keys and access token
        const encryptedKey1 = encrypt(api_key1);
        const encryptedKey2 = encrypt(api_key2);
        const encryptedToken = encrypt(access_token);

        // Token expires in 24 hours (Filestreams default)
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Step 3: Store encrypted credentials in database
        const { data: existing } = await supabase
            .from('filestreams_credentials')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            // Update existing credentials
            const { error: updateError } = await supabase
                .from('filestreams_credentials')
                .update({
                    api_key1_encrypted: encryptedKey1,
                    api_key2_encrypted: encryptedKey2,
                    access_token_encrypted: encryptedToken,
                    token_expires_at: tokenExpiresAt.toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id);

            if (updateError) {
                console.error('[Filestreams Connect] Failed to update credentials:', updateError);
                return res.status(500).json({ error: 'Failed to save credentials' });
            }
        } else {
            // Insert new credentials
            const { error: insertError } = await supabase
                .from('filestreams_credentials')
                .insert({
                    user_id: user.id,
                    api_key1_encrypted: encryptedKey1,
                    api_key2_encrypted: encryptedKey2,
                    access_token_encrypted: encryptedToken,
                    token_expires_at: tokenExpiresAt.toISOString(),
                });

            if (insertError) {
                console.error('[Filestreams Connect] Failed to insert credentials:', insertError);
                return res.status(500).json({ error: 'Failed to save credentials' });
            }
        }

        console.log('[Filestreams Connect] Credentials saved for user:', user.id);

        return res.status(200).json({
            success: true,
            message: 'Filestreams account connected successfully',
            account_id: account_id,
        });
    } catch (error) {
        console.error('[Filestreams Connect] Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
