import { UserCircleIcon } from "@heroicons/react/24/outline";
import useAuth from "hooks/useAuth";
import Link from "next/link";

const Account = () => {
  const { user } = useAuth();

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

        <div className="w-full h-0.5 bg-gray-500"></div>

        {/* subscription */}
        {user.isPro && (
          <div>
            <h3 className="text-green-400 font-bold mb-4">Your subscription</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
              <div className="bg-green-400 p-4 rounded-md">
                Snapit Pro is currently active
              </div>

              {user.endPro != null ?  (
              <div className="bg-green-400 p-4 rounded-md">
                Renews on{" "}
                  <span className="font-bold">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(new Date().getTime() + user.endPro))}
                </span>
              </div>
              ): (
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
 