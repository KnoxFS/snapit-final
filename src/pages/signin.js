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
        Screenshots4all - Create beautiful screenshots and mockups so easily
        </title>
        <meta
          name='description'
          content='Turn boring screenshots into shareable ones with just few clicks
          Design beautiful screenshots and browser mockups quickly using Screenshots4all. Create eye-catching images today to share with your audience
  '
        />
      </Head>

      <section className='flex items-center justify-center md:h-[calc(100vh-2.5em)]'>
        <div className='mx-auto grid w-[90%] grid-cols-1 items-center gap-10 md:w-[80%] md:grid-cols-[60%,2em,1fr]'>
          {/* illustration */}

          <article>
            <Link href='/'>
              <a className='w-full'>
                <img src='/AuthGIF.gif' className='rounded-3xl' />
              </a>
            </Link>
          </article>

          {/* separator */}
          <div className='hidden w-2 h-full mx-auto my-10 bg-green-500 rounded-md md:block'></div>

          {/* form */}
          <form>
            <h3 className='text-2xl font-bold text-darkGreen dark:text-white'>
              Signin
            </h3>

            <div className='my-6 space-y-4'>
              <input
                type='email'
                name='email'
                value={credentials.email}
                onChange={handleChange}
                placeholder='Email address'
                className='w-full px-4 py-2 text-white rounded-md outline-none bg-primary placeholder-darkGreen ring-1 ring-transparent focus:ring-green-400 dark:bg-darkGreen dark:placeholder-white'
                autoFocus
              />

              <input
                type='password'
                name='password'
                value={credentials.password}
                onChange={handleChange}
                placeholder='Password'
                className='w-full px-4 py-2 text-white rounded-md outline-none bg-primary placeholder-darkGreen ring-1 ring-transparent focus:ring-green-400 dark:bg-darkGreen dark:placeholder-white'
              />
            </div>

            <button
              className='w-full py-2 mt-4 font-medium text-center rounded-md bg-primary text-darkGreen hover:bg-green-500 disabled:opacity-70'
              disabled={logging}
              onClick={handleLogin}>
              Login
            </button>

            <div className='flex items-center justify-between mt-6'>
              <Link href='/signup'>
                <a className='text-darkGreen hover:underline dark:text-white'>
                  Dont have account?
                </a>
              </Link>

              <Link href='/forgot-password'>
                <a className='underline text-darkGreen dark:text-white'>
                  Reset password
                </a>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {showProMessage && (
        <div className='fixed bottom-0 left-0 right-0 py-2 text-center bg-primary text-darkGreen dark:text-white'>
          <p className='text-sm'>
            You need to login to buy pro plan. Please login first.
          </p>
        </div>
      )}
    </>
  );
};

export default Signup;
