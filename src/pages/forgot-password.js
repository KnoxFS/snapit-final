import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import Head from 'components/Head';

import { supabase } from 'lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async e => {
    e.preventDefault();
    const toastId = toast.loading('Sending password reset email...');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/update-password`,
    });

    if (error) {
      toast.error(error.error_description || error.message, { id: toastId });
      return;
    }

    toast.success('Password reset email sent! Check you mail.', {
      id: toastId,
    });
  };

  return (
    <>
      <Head>
        <title>Snapit - Confirm your email</title>
      </Head>

      <section className='flex h-[calc(100vh-2.5em)] flex-col items-center justify-center text-center text-darkGreen dark:text-white'>
        <div className='mx-auto w-[80%] md:max-w-md'>
          <h1 className='mb-6 text-xl font-bold md:text-4xl'>
            Forgot your password?
          </h1>

          <p className='mb-6 text-darkGreen dark:text-white/80'>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <input
            type='email'
            name='email'
            placeholder='Email address'
            className='w-full px-4 py-2 rounded-md outline-none bg-primary text-darkGreen ring-1 ring-transparent focus:ring-primary dark:bg-darkGreen dark:text-white'
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleForgotPassword(e);
              }
            }}
          />

          <button
            disabled={!email}
            className='w-full py-2 mt-6 text-center rounded-md font-bol bg-primary text-darkGreen disabled:opacity-70 dark:text-white'
            onClick={handleForgotPassword}>
            Send
          </button>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
