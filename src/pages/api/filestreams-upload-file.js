// API endpoint to upload/save image to user's Filestreams account
import { supabase } from 'lib/supabase';
const { getFilestreamToken } = require('../../utils/filestreamToken');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { file_data, filename, folder = '/' } = req.body;

    if (!file_data || !filename) {
        return res.status(400).json({ error: 'Missing file data or filename' });
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

        console.log('[Filestreams Upload] Uploading file:', filename);

        // Convert base64 to buffer
        const base64Data = file_data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Create form data for multipart upload
        const FormData = require('form-data');
        const form = new FormData();

        form.append('access_token', access_token);
        if (account_id) {
            form.append('account_id', account_id);
        }
        form.append('upload_file', buffer, {
            filename: filename,
            contentType: 'image/png', // Default, will be auto-detected
        });

        if (folder && folder !== '/') {
            form.append('folder_id', folder);
        }

        // Upload to Filestreams
        const uploadResponse = await fetch('https://www.filestreams.com/api/v2/file/upload', {
            method: 'POST',
            headers: form.getHeaders(),
            body: form,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('[Filestreams Upload] API error:', uploadResponse.status, errorText);
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        const uploadData = await uploadResponse.json();

        if (uploadData._status !== 'success') {
            console.error('[Filestreams Upload] Failed:', uploadData.response);
            return res.status(500).json({ error: uploadData.response || 'Failed to upload file' });
        }

        const fileInfo = uploadData.data;

        console.log('[Filestreams Upload] File uploaded successfully:', fileInfo.id);

        return res.status(200).json({
            success: true,
            file: {
                id: fileInfo.id,
                name: fileInfo.filename || filename,
                url: fileInfo.url,
                size: fileInfo.filesize,
            },
        });
    } catch (error) {
        console.error('[Filestreams Upload] Unexpected error:', error);

        if (error.message === 'Filestreams account not connected') {
            return res.status(400).json({ error: 'Filestreams account not connected' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Increase body size limit for image uploads
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
