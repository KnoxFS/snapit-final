import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Menu } from '@headlessui/react';
import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import Settings from './Settings';

import useAuth from 'hooks/useAuth';

import { supabase } from 'lib/supabase';
import Snapit from '../../public/Snapit.svg';

const Navbar = () => {
  const { user, setShowBuyPro } = useAuth();

  const [openSettings, setOpenSettings] = useState(false);

  const handleManageSubscription = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('session_id')
      .eq('user_id', user.id);

    if (error) {
      console.log(error);
      return;
    }

    const session_id = data[0].session_id;

    const res = await fetch(`/api/billing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
      }),
    });

    const { session_url } = await res.json();

    window.location.href = session_url;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className='my-4 w-[90%] mx-auto text-white flex items-center justify-between'>
      {/* Logo */}
      <Link href='/'>
        <a>
          <Image
            priority
            width={'120px'}
            height={'70px'}
            src={Snapit}
            alt='Follow us on Twitter'
            className=' w-full h-full'
          />
        </a>
      </Link>

      <nav className='hidden lg:block space-x-8 text-sm'>
        <Link href='/'>
          <a>Design screenshots</a>
        </Link>
        <Link href='/opengraph'>
          <a>Design Open Graph Images</a>
        </Link>
        <Link href='/pricing'>
          <a>Pricing</a>
        </Link>
        <Link href='/templates'>
          <a>Templates</a>
        </Link>
        <Link href='/blog'>
          <a>Blog</a>
        </Link>

        {user && (
          <button onClick={() => setOpenSettings(true)}>Settings</button>
        )}
      </nav>

      <div className='flex items-center space-x-3'>
        {/* Subscription section */}
        {user && !user.isPro ? (
          <button
            onClick={() => setShowBuyPro(true)}
            className='block py-2 px-4 text-sm rounded-md border-2 text-green-500 border-green-500'>
            Snapit Pro
          </button>
        ) : null}

        {user && user.isPro ? (
          <p>
            <svg
              width='12'
              height='16'
              viewBox='0 0 10 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M5.92851 0.0352685C6.07351 0.0849236 6.20017 0.183654 6.29009 0.317101C6.38001 0.450548 6.42849 0.611752 6.42848 0.777269V4.66616H9.28544C9.41609 4.6661 9.54425 4.70506 9.65598 4.7788C9.7677 4.85255 9.85872 4.95825 9.91911 5.08441C9.9795 5.21056 10.007 5.35234 9.9985 5.49431C9.99004 5.63629 9.94598 5.77301 9.87112 5.88961L4.87144 13.6674C4.78442 13.8031 4.6599 13.9051 4.51599 13.9585C4.37208 14.0118 4.21628 14.0138 4.07127 13.9641C3.92626 13.9144 3.7996 13.8156 3.70972 13.6821C3.61984 13.5485 3.57142 13.3873 3.57152 13.2217V9.33283H0.714558C0.583911 9.3329 0.45575 9.29394 0.344023 9.22019C0.232296 9.14645 0.141284 9.04074 0.080891 8.91459C0.0204981 8.78843 -0.00696171 8.64665 0.00149979 8.50468C0.00996128 8.36271 0.05402 8.22598 0.128881 8.10939L5.12856 0.331602C5.21571 0.196103 5.34026 0.0943893 5.48411 0.0412388C5.62797 -0.0119117 5.78364 -0.0137306 5.92851 0.0360463V0.0352685Z'
                fill='#E6B917'></path>
            </svg>
          </p>
        ) : null}

        {!user && (
          <div className='flex items-center space-x-5 text-sm font-medium'>
            <Link href='/signin'>
              <a>Login</a>
            </Link>

            <Link href='/signup'>
              <a className='bg-primary py-2 px-6 rounded-sm hover:bg-green-500 transition text-darkGreen font-semibold'>
                Try it free
              </a>
            </Link>
          </div>
        )}

        {user && (
          <Menu as='div' className='relative inline-block text-left'>
            <Menu.Button className='flex items-center space-x-2 bg-primary text-[#212121] p-2 rounded-md relative'>
              <UserCircleIcon className='w-6 h-6 rounded-full' />
              <span className='hidden md:block'>{user.name}</span>

              <ChevronDownIcon className='h-4 w-4' />
            </Menu.Button>

            <Menu.Items
              as='ul'
              className='absolute top-0 right-0 bg-[#232323] mt-14 rounded-md shadow-md z-50 w-max'>
              {user.isPro && (
                <Menu.Item as='li'>
                  <button
                    onClick={handleManageSubscription}
                    className='block p-4'>
                    Manage subscription
                  </button>
                </Menu.Item>
              )}

              <Menu.Item as='li'>
                <button onClick={handleLogout} className='block p-4'>
                  Sign out
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}

        {/* mobile navbar */}
        <Menu as='div' className='lg:hidden ml-4 relative'>
          <Menu.Button className='mt-1.5'>
            <Bars3Icon className='h-6 w-6 text-white' />
          </Menu.Button>

          <Menu.Items
            as='ul'
            className='absolute top-0 right-0 bg-[#232323] mt-14 rounded-md shadow-md z-50 w-max'>
            <Menu.Item>
              <Link href='/'>
                <a className='block p-4 text-sm text-white'>
                  Design screenshots
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href='/opengraph'>
                <a className='block p-4 text-sm text-white'>
                  Design Open Graph Images
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href='/pricing'>
                <a className='block p-4 text-sm text-white'>Pricing</a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href='/blog'>
                <a className='block p-4 text-sm text-white'>Blog </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href='/templates'>
                <a className='block p-4 text-sm text-white'>Templates</a>
              </Link>
            </Menu.Item>
            {user && (
              <Menu.Item>
                <button
                  className='block w-full text-left p-4 text-sm text-white'
                  onClick={() => setOpenSettings(true)}>
                  Settings
                </button>
              </Menu.Item>
            )}
          </Menu.Items>
        </Menu>

        <Settings open={openSettings} setOpen={setOpenSettings} />
      </div>
    </header>
  );
};

export default Navbar;
