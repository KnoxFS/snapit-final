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

        {user && user.isPro ? <p>⚡️</p> : null}

        {!user && (
          <div className='flex items-center space-x-5 text-sm'>
            <Link href='/signin'>
              <a>Login</a>
            </Link>

            <Link href='/signup'>
              <a className='bg-green-400 py-2 px-6 rounded-sm hover:bg-green-500 transition text-darkGreen font-semibold'>
                Try it free
              </a>
            </Link>
          </div>
        )}

        {user && (
          <Menu as='div' className='relative inline-block text-left'>
            <Menu.Button className='flex items-center space-x-2 bg-green-400 text-[#212121] p-2 rounded-md relative'>
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
