// API endpoint to proxy file downloads from Filestreams (to avoid CORS)
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

        console.log('[Filestreams Proxy] Downloading file:', file_id);

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
            console.error('[Filestreams Proxy] API error:', downloadResponse.status, errorText);
            return res.status(500).json({ error: 'Failed to get download URL' });
        }

        const downloadData = await downloadResponse.json();

        if (downloadData._status !== 'success') {
            console.error('[Filestreams Proxy] Failed:', downloadData.response);
            return res.status(500).json({ error: downloadData.response || 'Failed to get download URL' });
        }

        const downloadUrl = downloadData.data.download_url || downloadData.data.url;

        console.log('[Filestreams Proxy] Fetching file from:', downloadUrl);

        // Fetch the actual file
        const fileResponse = await fetch(downloadUrl);

        if (!fileResponse.ok) {
            console.error('[Filestreams Proxy] File fetch error:', fileResponse.status);
            return res.status(500).json({ error: 'Failed to download file' });
        }

        // Get the file as a buffer
        const fileBuffer = await fileResponse.arrayBuffer();
        const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

        console.log('[Filestreams Proxy] File downloaded, size:', fileBuffer.byteLength, 'type:', contentType);

        // Return the file with proper headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.send(Buffer.from(fileBuffer));

    } catch (error) {
        console.error('[Filestreams Proxy] Unexpected error:', error);

        if (error.message === 'Filestreams account not connected') {
            return res.status(400).json({ error: 'Filestreams account not connected' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}
