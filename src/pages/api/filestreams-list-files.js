// API endpoint to list files from user's Filestreams account
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

    const { folder = '/', page = 1, per_page = 50 } = req.body;

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

        // Get valid access token (auto-refreshes if needed)
        const { access_token, account_id } = await getFilestreamToken(user.id);

        // Call Filestreams API to list files
        console.log('[Filestreams List] Fetching files for folder:', folder);

        const listResponse = await fetch('https://www.filestreams.com/api/v2/folder/listing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                access_token: access_token,
                account_id: account_id || '',
                parent_folder_id: folder === '/' ? '' : folder,
            }),
        });

        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            console.error('[Filestreams List] API error:', listResponse.status, errorText);
            return res.status(500).json({ error: 'Failed to list files' });
        }

        const listData = await listResponse.json();

        console.log('[Filestreams List] API response status:', listData._status);
        console.log('[Filestreams List] Sample file data:', JSON.stringify(listData.data?.files?.[0], null, 2));

        if (listData._status !== 'success') {
            console.error('[Filestreams List] Failed:', listData.response);
            return res.status(500).json({ error: listData.response || 'Failed to list files' });
        }

        // Filter for image files only
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        const files = (listData.data.files || []).filter(file => {
            const ext = file.filename?.split('.').pop()?.toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Format response - map Filestreams fields to our format
        const formattedFiles = files.map(file => ({
            id: file.id,
            name: file.filename || file.name || 'Untitled',
            size: parseInt(file.fileSize || file.filesize || file.size || 0),
            url: file.url_file || file.url || file.download_url,
            thumbnail: file.thumbnail_url || file.url_file || file.url,
            created_at: file.uploadDate || file.upload_date || file.created_at || null,
            extension: file.extension || file.filename?.split('.').pop()?.toLowerCase(),
        }));

        console.log('[Filestreams List] Found', formattedFiles.length, 'image files');
        console.log('[Filestreams List] First file formatted:', formattedFiles[0]);

        return res.status(200).json({
            success: true,
            files: formattedFiles,
            total: formattedFiles.length,
            page: page,
        });
    } catch (error) {
        console.error('[Filestreams List] Unexpected error:', error);

        if (error.message === 'Filestreams account not connected') {
            return res.status(400).json({ error: 'Filestreams account not connected' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}
