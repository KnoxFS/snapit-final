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
              Signup
            </h3>

            <div className='my-6 space-y-4'>
              <input
                type='text'
                name='name'
                value={credentials.name}
                onChange={handleChange}
                placeholder='Name'
                className='w-full px-4 py-2 text-white rounded-md outline-none bg-primary placeholder-darkGreen ring-1 ring-transparent focus:ring-primary dark:bg-darkGreen dark:placeholder-white'
                autoFocus
              />

              <input
                type='email'
                name='email'
                value={credentials.email}
                onChange={handleChange}
                placeholder='Email address'
                className='w-full px-4 py-2 text-white rounded-md outline-none bg-primary placeholder-darkGreen ring-1 ring-transparent focus:ring-primary dark:bg-darkGreen dark:placeholder-white'
              />

              <input
                type='password'
                name='password'
                value={credentials.password}
                onChange={handleChange}
                placeholder='Password'
                className='w-full px-4 py-2 text-white rounded-md outline-none bg-primary placeholder-darkGreen ring-1 ring-transparent focus:ring-primary dark:bg-darkGreen dark:placeholder-white'
              />
            </div>

            <div className='w-full mx-auto my-6'>
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
                      : 'bg-primary dark:bg-darkGreen'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }>
                      {({ checked }) => (
                        <div className='flex items-center justify-between w-full'>
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
                              <CheckCircleIcon className='w-6 h-6' />
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
              className='w-full py-2 mt-4 font-medium text-center rounded-md bg-primary text-darkGreen hover:bg-green-500 disabled:opacity-70'
              disabled={registering}
              onClick={handleRegister}>
              Create account
            </button>

            <div className='flex items-center justify-between mt-6'>
              <Link href='/signin'>
                <a className='text-darkGreen/80 hover:underline dark:text-white/80'>
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
