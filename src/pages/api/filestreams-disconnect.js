// API endpoint to disconnect Filestreams account
import { supabase } from 'lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
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

        // Delete credentials from database
        const { error: deleteError } = await supabase
            .from('filestreams_credentials')
            .delete()
            .eq('user_id', user.id);

        if (deleteError) {
            console.error('[Filestreams Disconnect] Failed to delete credentials:', deleteError);
            return res.status(500).json({ error: 'Failed to disconnect account' });
        }

        console.log('[Filestreams Disconnect] Account disconnected for user:', user.id);

        return res.status(200).json({
            success: true,
            message: 'Filestreams account disconnected successfully',
        });
    } catch (error) {
        console.error('[Filestreams Disconnect] Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
