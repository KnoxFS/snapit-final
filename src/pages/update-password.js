import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "components/Head";

import { supabase } from "lib/supabase";

const ForgotPassword = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating password...");

    // validate password is equal to confirm password
    if (credentials.newPassword !== credentials.confirmPassword) {
      toast.error("Passwords do not match", { id: toastId });
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: credentials.newPassword,
    });

    if (error) {
      toast.error(error.error_description || error.message, { id: toastId });
      return;
    }

    toast.success("Password updated!", {
      id: toastId,
    });

    // redirect to main page
    router.replace("/");
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Head>
        <title>Snapit - Confirm your email</title>
      </Head>

      <section className="flex h-[calc(100vh-2.5em)] justify-center items-center flex-col text-white text-center">
        <div className="md:max-w-md w-[80%] mx-auto">
          <h2 className="text-xl md:text-3xl font-bold mb-12 text-center">Update password</h2>

          <div className="space-y-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none ring-1 ring-transparent focus:ring-green-400 text-white"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePassword(e);
                } 
              }}
              onChange={handleChange}
              value={credentials.newPassword}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none ring-1 ring-transparent focus:ring-green-400 text-white"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePassword(e);
                }
              }}
              onChange={handleChange}
              value={credentials.confirmPassword}
            />
          </div>

          <button
            disabled={!credentials.newPassword || !credentials.confirmPassword}
            className="mt-6 w-full bg-green-400 text-white text-center font-bol rounded-md py-2 disabled:opacity-70"
            onClick={handleUpdatePassword}
          >
            Send
          </button>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
