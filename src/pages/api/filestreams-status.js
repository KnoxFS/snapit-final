// API endpoint to check Filestreams connection status
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

        // Check if user has credentials
        const { data: credentials, error } = await supabase
            .from('filestreams_credentials')
            .select('created_at, updated_at')
            .eq('user_id', user.id)
            .single();

        if (error || !credentials) {
            return res.status(200).json({
                connected: false,
            });
        }

        return res.status(200).json({
            connected: true,
            connected_at: credentials.created_at,
            updated_at: credentials.updated_at,
        });
    } catch (error) {
        console.error('[Filestreams Status] Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
