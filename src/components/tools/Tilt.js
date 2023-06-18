import { Joystick } from 'react-joystick-component';

import { Disclosure } from '@headlessui/react';

import { LanternIcon, ThunderIcon } from 'ui/icons';

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import useAuth from 'hooks/useAuth';

const Tilt = ({ proMode, onTiltMove, setManualTiltAngle }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='w-full' disabled={!user?.isPro}>
            <div className='grid w-full grid-cols-[3fr,1fr] '>
              <div className='flex items-center space-x-2'>
                <LanternIcon className={'text-darkGreen dark:text-white'} />

                <h3 className='text-sm text-darkGreen dark:text-white'>Tilt</h3>
              </div>

              <div className='flex items-center justify-around'>
                {/* tip */}
                <div className='relative'>
                  <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
                  <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
                    <p className='text-sm text-darkGreen dark:text-white'>
                      Sets a 3D effect to the screenshot.
                    </p>
                  </div>
                </div>
                {user?.isPro ? (
                  <ChevronRightIcon
                    className={`${
                      open ? 'rotate-90 transform' : ''
                    } h-5 w-5 justify-self-end text-darkGreen dark:text-white`}
                  />
                ) : (
                  <div className='mr-2 justify-self-end'>
                    <ThunderIcon />
                  </div>
                )}
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className='w-full overflow-x-scroll scrollbar-none'>
            <div className='flex items-center justify-between'>
              <p className='w-[50%] text-sm text-gray-400'>
                Move around with the joystick to tilt the screenshot.
              </p>

              {/* Reset */}
              <button
                onClick={() => setManualTiltAngle([0, 0])}
                className='mr-4 text-sm text-green-500'>
                Reset
              </button>

              <Joystick
                size={40}
                baseColor='#4ade80'
                stickColor='#232323'
                disabled={!proMode}
                move={onTiltMove}
              />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Tilt;
