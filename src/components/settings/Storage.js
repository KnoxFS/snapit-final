import { useState } from "react";
import { CloudIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import useAuth from "hooks/useAuth";
import toast from "react-hot-toast";

const Storage = () => {
    const { user, getUser } = useAuth();
    const [creating, setCreating] = useState(false);

    const hasFilestreamsAccount = !!user?.filestreams_account_id;

    const handleCreateAccount = async () => {
        setCreating(true);
        const toastId = toast.loading("Creating your free storage account...");

        try {
            const response = await fetch("/api/filestreams-create-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create account");
            }

            toast.success("Storage account created successfully!", { id: toastId });

            // Refresh user data to get new Filestreams info
            await getUser();
        } catch (error) {
            console.error("[Storage] Error creating account:", error);
            toast.error(error.message || "Failed to create storage account", {
                id: toastId,
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <section className="h-full p-12">
            <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Cloud Storage
                </h2>

                {!hasFilestreamsAccount ? (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <CloudIcon className="h-12 w-12 text-green-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Free Cloud Storage
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Get free cloud storage powered by Filestreams to store and
                                        share your screenshots and designs.
                                    </p>
                                    <ul className="space-y-2 text-gray-400 text-sm mb-6">
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            Secure cloud storage
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            Easy file sharing
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            Automatic backups
                                        </li>
                                    </ul>
                                    <button
                                        onClick={handleCreateAccount}
                                        disabled={creating}
                                        className="px-6 py-3 bg-green-400 text-darkGreen font-semibold rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {creating ? "Setting up..." : "Setup free Storage account"}
                                    </button>
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
                                        Storage Account Active
                                    </h3>
                                    <p className="text-gray-300 mb-4">
                                        Your Filestreams storage account is set up and ready to use.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Username</p>
                                            <p className="text-white font-mono">
                                                {user.filestreams_username}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Status</p>
                                            <p className="text-white capitalize">
                                                {user.filestreams_status || "Active"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href="https://filestreams.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Visit Filestreams →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Storage;
