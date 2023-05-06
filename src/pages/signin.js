import { useEffect, useState } from 'react';
import Link from 'next/link';

import { supabase } from 'lib/supabase';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import Head from 'components/Head';

const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [logging, setLoggging] = useState(false);
  const [showProMessage, setShowProMessage] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // read state from router
    const { state } = router.query;

    if (state === 'buyPro') {
      setShowProMessage(true);

      setTimeout(() => {
        setShowProMessage(false);
      }, 5000);
    }
  }, [router.query]);

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoggging(true);

    const toastId = toast.loading('Logging in...');

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      toast.error(error.error_description || error.message, { id: toastId });

      setLoggging(false);
      return;
    }

    toast.dismiss(toastId);
    setLoggging(false);

    router.replace('/');
  };

  return (
    <>
      <Head>
        <title>
          Snapit - Create beautiful screenshots and mockups so easily
        </title>
        <meta
          name='description'
          content='Turn boring screenshots into shareable ones with just few clicks
          Design beautiful screenshots and browser mockups quickly using Snapit. Create eye-catching images today to share with your audience
  '
        />
      </Head>

      <section className='flex md:h-[calc(100vh-2.5em)] justify-center items-center'>
        <div className='grid grid-cols-1 md:grid-cols-[60%,2em,1fr] items-center w-[90%] md:w-[80%] mx-auto gap-10'>
          {/* illustration */}

          <article>
            <Link href='/'>
              <a className='w-full'>
                <img src='/AuthGIF.gif' className='rounded-3xl' />
              </a>
            </Link>
          </article>

          {/* separator */}
          <div className='hidden md:block w-2 h-full rounded-md bg-green-500 mx-auto my-10'></div>

          {/* form */}
          <form>
            <h3 className='text-2xl text-white font-bold'>Signin</h3>

            <div className='space-y-4 my-6'>
              <input
                type='email'
                name='email'
                value={credentials.email}
                onChange={handleChange}
                placeholder='Email address'
                className='w-full py-2 px-4 rounded-md bg-darkGreen outline-none ring-1 ring-transparent focus:ring-green-400 text-white'
                autoFocus
              />

              <input
                type='password'
                name='password'
                value={credentials.password}
                onChange={handleChange}
                placeholder='Password'
                className='w-full py-2 px-4 rounded-md bg-darkGreen outline-none ring-1 ring-transparent focus:ring-green-400 text-white'
              />
            </div>

            <button
              className='mt-4 w-full bg-primary hover:bg-green-500 text-darkGreen text-center font-medium rounded-md py-2 disabled:opacity-70'
              disabled={logging}
              onClick={handleLogin}>
              Login
            </button>

            <div className='mt-6 flex justify-between items-center'>
              <Link href='/signup'>
                <a className='text-white/80 hover:underline'>
                  Dont have account?
                </a>
              </Link>

              <Link href='/forgot-password'>
                <a className='text-white/80 underline'>Reset password</a>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {showProMessage && (
        <div className='fixed bottom-0 left-0 right-0 bg-primary text-white text-center py-2'>
          <p className='text-sm'>
            You need to login to buy pro plan. Please login first.
          </p>
        </div>
      )}
    </>
  );
};

export default Signup;
