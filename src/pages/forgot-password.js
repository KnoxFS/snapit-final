import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Head from "components/Head";

import { supabase } from "lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending password reset email...");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/update-password`,
    });

    if (error) {
      toast.error(error.error_description || error.message, { id: toastId });
      return;
    }

    toast.success("Password reset email sent! Check you mail.", {
      id: toastId,
    });
  };

  return (
    <>
      <Head>
        <title>Snapit - Confirm your email</title>
      </Head>

      <section className="flex h-[calc(100vh-2.5em)] justify-center items-center flex-col text-white text-center">
        <div className="md:max-w-md w-[80%] mx-auto">
          <h1 className="text-xl md:text-4xl mb-6 font-bold">
            Forgot your password?
          </h1>

          <p className="text-gray-500 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none ring-1 ring-transparent focus:ring-green-400 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleForgotPassword(e);
              }
            }}
          />

          <button
            disabled={!email}
            className="mt-6 w-full bg-green-400 text-white text-center font-bol rounded-md py-2 disabled:opacity-70"
            onClick={handleForgotPassword}
          >
            Send
          </button>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
