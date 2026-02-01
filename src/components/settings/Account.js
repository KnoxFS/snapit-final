import { UserCircleIcon } from "@heroicons/react/24/outline";
import useAuth from "hooks/useAuth";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "lib/supabase";
import toast from "react-hot-toast";

const Account = () => {
  const { user, getUser } = useAuth();
  const [twitterHandle, setTwitterHandle] = useState(user?.twitter_handle || "");
  const [saving, setSaving] = useState(false);

  const handleSaveTwitter = async () => {
    // Validate @ symbol
    if (twitterHandle && !twitterHandle.startsWith("@")) {
      toast.error("Twitter handle must start with @");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving Twitter handle...");

    const { error } = await supabase
      .from("users")
      .update({ twitter_handle: twitterHandle || null })
      .eq("user_id", user.id);

    if (error) {
      console.error("[Account] Error saving Twitter handle:", error);
      toast.error("Failed to save Twitter handle", { id: toastId });
    } else {
      toast.success("Twitter handle saved!", { id: toastId });
      // Refresh user data
      await getUser();
    }

    setSaving(false);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-[30%,1fr] h-full p-12 gap-5">
      <article className="flex justify-center items-center">
        <UserCircleIcon className="h-44 w-44 text-white" />
      </article>

      <article className="space-y-4">
        <div>
          <h4 className="text-green-400 font-bold">Name</h4>
          <p className="text-white">{user.name}</p>
        </div>

        <div>
          <h4 className="text-green-400 font-bold">Email</h4>
          <p className="text-white">{user.email}</p>
        </div>

        {/* Twitter Handle */}
        <div>
          <h4 className="text-green-400 font-bold mb-2">Twitter Handle</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="@username"
              className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSaveTwitter}
              disabled={saving}
              className="px-6 py-2 bg-green-400 text-darkGreen font-semibold rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Your X/Twitter handle (must include @)
          </p>
        </div>

        <div className="w-full h-0.5 bg-gray-500"></div>

        {/* subscription */}
        {user.isPro && (
          <div>
            <h3 className="text-green-400 font-bold mb-4">Your subscription</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
              <div className="bg-green-400 p-4 rounded-md">
                Screenshots4all Pro is currently active
              </div>

              {user.endPro != null ? (
                <div className="bg-green-400 p-4 rounded-md">
                  Renews on{" "}
                  <span className="font-bold">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(new Date().getTime() + user.endPro))}
                  </span>
                </div>
              ) : (
                <div className="bg-green-400 p-4 rounded-md">
                  Renews {" "}
                  <span className="font-bold">
                    Never
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {!user.isPro && (
          <h3 className="text-green-400 font-bold mb-4">
            You currently don't have a subscription.
          </h3>
        )}
      </article>
    </section>
  );
};

export default Account;
