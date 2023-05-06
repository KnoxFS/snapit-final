import { useState } from 'react';
import Link from 'next/link';

import { supabase } from 'lib/supabase';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import Head from 'components/Head';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Monthly',
    price: '$5',
  },
  {
    name: 'Yearly',
    price: '$49',
  },
  {
    name: 'Lifetime',
    price: '$99',
  },
];

const Signup = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: '',
  });

  // const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [registering, setRegistering] = useState(false);

  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const handleBuyPro = async user => {
    if (!user) {
      router.replace('/singup?state=buyPro');
      setOpen(false);
      return;
    }

    const res = await fetch(
      `/api/pro?plan=${selectedPlan.name}&user_id=${user.id}`,
      {
        method: 'POST',
      },
    ).then(res => res.json());

    // Open Stripe Checkout
    window.location.href = res.session_url;
  };

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();
    setRegistering(true);

    const toastId = toast.loading('Creating your account...');

    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      toast.error(error.error_description || error.message, { id: toastId });

      setRegistering(false);
      return;
    }
    // save user info in database

    const { error: db_error } = await supabase.from('users').insert([
      {
        user_id: user.id,
      },
    ]);

    // create stats for user

    const defaultStats = {
      screenshots_saved: 0,
      screenshots_copied: 0,
      opengraph_saved: 0,
      opengraph_copied: 0,
      templates_saved: 0,
      templates_copied: 0,
    };

    const { error: stats_error } = await supabase
      .from('stats')
      .insert([{ user_id: user.id, stats: JSON.stringify(defaultStats) }]);

    if (db_error || stats_error) {
      toast.error('An error has ocurred, please try again.', {
        id: toastId,
      });

      setRegistering(false);
      return;
    }

    toast.success('User registered', { id: toastId });
    setRegistering(false);

    await handleBuyPro(user);
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
            <h3 className='text-2xl text-white font-bold'>Signup</h3>

            <div className='space-y-4 my-6'>
              <input
                type='text'
                name='name'
                value={credentials.name}
                onChange={handleChange}
                placeholder='Name'
                className='w-full py-2 px-4 rounded-md bg-darkGreen outline-none ring-1 ring-transparent focus:ring-green-400 text-white'
                autoFocus
              />

              <input
                type='email'
                name='email'
                value={credentials.email}
                onChange={handleChange}
                placeholder='Email address'
                className='w-full py-2 px-4 rounded-md bg-darkGreen outline-none ring-1 ring-transparent focus:ring-green-400 text-white'
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

            <div className='mx-auto w-full my-6'>
              <RadioGroup value={selectedPlan} onChange={setSelectedPlan}>
                <RadioGroup.Label className='sr-only'>
                  Choose plan
                </RadioGroup.Label>
                <div className='space-y-2'>
                  {plans.map(plan => (
                    <RadioGroup.Option
                      key={plan.name}
                      value={plan}
                      className={({ active, checked }) =>
                        `
                  ${
                    checked
                      ? 'bg-primary bg-opacity-75 text-darkGreen'
                      : 'bg-darkGreen'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }>
                      {({ checked }) => (
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex items-center'>
                            <div className='text-sm font-medium'>
                              <RadioGroup.Label
                                as='p'
                                className={`font-medium ${
                                  checked ? 'text-darkGreen' : 'text-white'
                                }`}>
                                {plan.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as='div'
                                className={`inline ${
                                  checked ? 'text-darkGreen' : 'text-white/80'
                                }`}>
                                {plan.name === 'Lifetime' ? (
                                  <p>
                                    {plan.price} one{' '}
                                    {plan.name === 'Lifetime'
                                      ? 'time payment'
                                      : 'time payment'}
                                  </p>
                                ) : (
                                  <p>
                                    {plan.price} each{' '}
                                    {plan.name === 'Monthly' ? 'month' : 'year'}
                                  </p>
                                )}
                              </RadioGroup.Description>
                            </div>
                          </div>
                          {checked && (
                            <div className='shrink-0 text-darkGreen'>
                              <CheckCircleIcon className='h-6 w-6' />
                            </div>
                          )}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <button
              className='mt-4 w-full bg-primary hover:bg-green-500 text-darkGreen text-center font-medium rounded-md py-2 disabled:opacity-70'
              disabled={registering}
              onClick={handleRegister}>
              Create account
            </button>

            <div className='mt-6 flex justify-between items-center'>
              <Link href='/signin'>
                <a className='text-white/80 hover:underline'>
                  Already have an account?
                </a>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

function CheckIcon(props) {
  return (
    <svg viewBox='0 0 24 24' fill='none' {...props}>
      <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
      <path
        d='M7 13l3 3 7-7'
        stroke='#fff'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default Signup;
