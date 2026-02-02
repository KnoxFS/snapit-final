// API endpoint to list files from user's Filestreams account
import { supabase } from 'lib/supabase';
const { getFilestreamToken } = require('utils/filestreamToken');

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

        // Format response
        const formattedFiles = files.map(file => ({
            id: file.id,
            name: file.filename,
            size: file.filesize,
            url: file.url,
            thumbnail: file.thumbnail_url || file.url,
            created_at: file.upload_date,
            extension: file.filename?.split('.').pop()?.toLowerCase(),
        }));

        console.log('[Filestreams List] Found', formattedFiles.length, 'image files');

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
