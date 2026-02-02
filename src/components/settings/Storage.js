import { useState, useEffect } from 'react';
import { CloudIcon, CheckCircleIcon, KeyIcon, XCircleIcon } from '@heroicons/react/24/outline';
import useAuth from 'hooks/useAuth';
import toast from 'react-hot-toast';
import { supabase } from 'lib/supabase';

const Storage = () => {
    const { user } = useAuth();
    const [apiKey1, setApiKey1] = useState('');
    const [apiKey2, setApiKey2] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionInfo, setConnectionInfo] = useState(null);
    const [showKeys, setShowKeys] = useState(false);

    // Check connection status on mount
    useEffect(() => {
        checkConnectionStatus();
    }, [user]);

    const checkConnectionStatus = async () => {
        if (!user) return;

        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            if (!token) return;

            const response = await fetch('/api/filestreams-status', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.connected) {
                setIsConnected(true);
                setConnectionInfo(data);
            } else {
                setIsConnected(false);
                setConnectionInfo(null);
            }
        } catch (error) {
            console.error('[Storage] Error checking status:', error);
        }
    };

    const handleConnect = async () => {
        if (!apiKey1 || !apiKey2) {
            toast.error('Please enter both API keys');
            return;
        }

        setConnecting(true);
        const toastId = toast.loading('Connecting to Filestreams...');

        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/filestreams-connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    api_key1: apiKey1,
                    api_key2: apiKey2,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to connect');
            }

            toast.success('Filestreams account connected!', { id: toastId });

            // Clear input fields
            setApiKey1('');
            setApiKey2('');
            setShowKeys(false);

            // Refresh connection status
            await checkConnectionStatus();

            // Notify other components (like ScreenshotMaker) that connection status changed
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('filestreams-connection-changed', {
                    detail: { connected: true }
                }));
            }
        } catch (error) {
            console.error('[Storage] Error connecting:', error);
            toast.error(error.message || 'Failed to connect account', { id: toastId });
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect your Filestreams account?')) {
            return;
        }

        setDisconnecting(true);
        const toastId = toast.loading('Disconnecting...');

        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/filestreams-disconnect', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to disconnect');
            }

            toast.success('Filestreams account disconnected', { id: toastId });

            // Refresh connection status
            await checkConnectionStatus();
        } catch (error) {
            console.error('[Storage] Error disconnecting:', error);
            toast.error(error.message || 'Failed to disconnect account', { id: toastId });
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <section className="h-full p-12">
            <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Cloud Storage
                </h2>

                {!isConnected ? (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <CloudIcon className="h-12 w-12 text-green-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Connect Your Filestreams Account
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Connect your existing Filestreams account to save and load screenshots directly from your cloud storage.
                                    </p>

                                    <div className="space-y-4">
                                        {/* API Key 1 */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                API Key 1
                                            </label>
                                            <input
                                                type={showKeys ? 'text' : 'password'}
                                                value={apiKey1}
                                                onChange={(e) => setApiKey1(e.target.value)}
                                                placeholder="Enter your API Key 1"
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                                            />
                                        </div>

                                        {/* API Key 2 */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                API Key 2
                                            </label>
                                            <input
                                                type={showKeys ? 'text' : 'password'}
                                                value={apiKey2}
                                                onChange={(e) => setApiKey2(e.target.value)}
                                                placeholder="Enter your API Key 2"
                                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                                            />
                                        </div>

                                        {/* Show/Hide Keys */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show-keys"
                                                checked={showKeys}
                                                onChange={(e) => setShowKeys(e.target.checked)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="show-keys" className="text-sm text-gray-400 cursor-pointer">
                                                Show API keys
                                            </label>
                                        </div>

                                        {/* Connect Button */}
                                        <button
                                            onClick={handleConnect}
                                            disabled={connecting || !apiKey1 || !apiKey2}
                                            className="w-full px-6 py-3 bg-green-400 text-darkGreen font-semibold rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {connecting ? 'Connecting...' : 'Connect Account'}
                                        </button>
                                    </div>

                                    {/* Help Text */}
                                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-md">
                                        <p className="text-sm text-blue-300 mb-2">
                                            <strong>How to get your API keys:</strong>
                                        </p>
                                        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                                            <li>Log in to your Filestreams account</li>
                                            <li>Go to Settings → API</li>
                                            <li>Copy your API Key 1 and API Key 2</li>
                                            <li>Paste them above and click Connect</li>
                                        </ol>
                                        <p className="text-xs text-gray-500 mt-3">
                                            Don't have a Filestreams account?{' '}
                                            <a
                                                href="https://filestreams.com/signup"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-400 hover:underline"
                                            >
                                                Sign up here
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <CheckCircleIcon className="h-12 w-12 text-green-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Filestreams Connected
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Your Filestreams account is connected and ready to use.
                                    </p>

                                    {connectionInfo && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Connected</p>
                                                <p className="text-white">
                                                    {new Date(connectionInfo.connected_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Last Updated</p>
                                                <p className="text-white">
                                                    {new Date(connectionInfo.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDisconnect}
                                            disabled={disconnecting}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/30 rounded-md hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                                        </button>
                                        <a
                                            href="https://filestreams.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Visit Filestreams →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Usage Info */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h4 className="text-md font-semibold text-white mb-3">
                                How to Use
                            </h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>Save screenshots directly to your Filestreams storage from the editor</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>Load images from your Filestreams account to edit</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>All your files are stored securely in your Filestreams account</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Storage;
