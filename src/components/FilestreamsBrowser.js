import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { supabase } from 'lib/supabase';
import toast from 'react-hot-toast';

/**
 * FilestreamsBrowser Component
 * Modal to browse and select images from user's Filestreams storage
 */
const FilestreamsBrowser = ({ isOpen, onClose, onSelectFile }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen]);

    const loadFiles = async () => {
        setLoading(true);

        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/filestreams-list-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    folder: '/',
                    page: 1,
                    per_page: 100,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load files');
            }

            setFiles(data.files || []);
        } catch (error) {
            console.error('[FilestreamsBrowser] Error loading files:', error);
            toast.error(error.message || 'Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFile = async (file) => {
        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            if (!token) {
                throw new Error('Not authenticated');
            }

            // Get file download URL
            const response = await fetch('/api/filestreams-get-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    file_id: file.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get file');
            }

            // Pass file URL to parent
            onSelectFile(data.file.url, file.name);
            onClose();
        } catch (error) {
            console.error('[FilestreamsBrowser] Error selecting file:', error);
            toast.error(error.message || 'Failed to load file');
        }
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            {/* Full-screen container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-4xl w-full bg-gray-800 rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <Dialog.Title className="text-xl font-semibold text-white">
                            Browse Filestreams Storage
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                            />
                        </div>
                    </div>

                    {/* File Grid */}
                    <div className="p-6 max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                            </div>
                        ) : filteredFiles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <PhotoIcon className="h-16 w-16 mb-4" />
                                <p className="text-lg">
                                    {searchTerm ? 'No files found' : 'No images in your storage'}
                                </p>
                                <p className="text-sm mt-2">
                                    {searchTerm ? 'Try a different search term' : 'Upload some screenshots to get started'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredFiles.map((file) => (
                                    <button
                                        key={file.id}
                                        onClick={() => handleSelectFile(file)}
                                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-700 hover:ring-2 hover:ring-green-400 transition"
                                    >
                                        <img
                                            src={file.thumbnail}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = file.url; // Fallback to full URL
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                                            <div className="text-left">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-gray-300 text-xs">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            {filteredFiles.length} {filteredFiles.length === 1 ? 'image' : 'images'}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export default FilestreamsBrowser;
