// API endpoint to get/download file from user's Filestreams account
import { createClient } from '@supabase/supabase-js';
const { getFilestreamToken } = require('utils/filestreamToken');

// Use service role key for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { file_id } = req.body;

    if (!file_id) {
        return res.status(400).json({ error: 'Missing file_id' });
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

        // Get valid access token
        const { access_token, account_id } = await getFilestreamToken(user.id);

        console.log('[Filestreams Download] Getting file:', file_id);

        // Get file download URL from Filestreams
        const downloadResponse = await fetch('https://www.filestreams.com/api/v2/file/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                access_token: access_token,
                account_id: account_id || '',
                file_id: file_id,
            }),
        });

        if (!downloadResponse.ok) {
            const errorText = await downloadResponse.text();
            console.error('[Filestreams Download] API error:', downloadResponse.status, errorText);
            return res.status(500).json({ error: 'Failed to get file' });
        }

        const downloadData = await downloadResponse.json();

        if (downloadData._status !== 'success') {
            console.error('[Filestreams Download] Failed:', downloadData.response);
            return res.status(500).json({ error: downloadData.response || 'Failed to get file' });
        }

        const fileInfo = downloadData.data;

        console.log('[Filestreams Download] File retrieved successfully');

        return res.status(200).json({
            success: true,
            file: {
                id: file_id,
                name: fileInfo.filename,
                url: fileInfo.download_url || fileInfo.url,
                size: fileInfo.filesize,
            },
        });
    } catch (error) {
        console.error('[Filestreams Download] Unexpected error:', error);

        if (error.message === 'Filestreams account not connected') {
            return res.status(400).json({ error: 'Filestreams account not connected' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}
