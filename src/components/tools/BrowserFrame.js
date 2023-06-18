import { Popover } from '@headlessui/react';
import {
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import getTabFrame from 'utils/getTabFrame';

const browserFrames = [
  {
    name: 'Hidden',
    value: 'hidden',
  },
  {
    name: 'Mac Light',
    value: 'mac_light',
  },
  {
    name: 'Mac Dark',
    value: 'mac_dark',
  },
  {
    name: 'Windows Light',
    value: 'windows_light',
  },
  {
    name: 'Windows Dark',
    value: 'windows_dark',
  },
  {
    name: 'Toon',
    value: 'toon',
  },
  {
    name: 'Silver',
    value: 'silver',
  },
  {
    name: 'Silver Black',
    value: 'silver_black',
  },
];

const BrowserFrame = ({ options, setOptions, whitelist }) => {
  return (
    <div className='grid w-full grid-cols-[3fr,1fr]'>
      <div className='flex items-center space-x-2'>
        <ComputerDesktopIcon className='w-5 h-5 text-darkGreen dark:text-white' />

        <h3 className='text-sm text-darkGreen dark:text-white'>
          Browser Frame
        </h3>
      </div>

      <div className='flex items-center justify-around'>
        {/* tip */}
        <div className='relative'>
          <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
          <div className='absolute z-50 hidden p-2 text-center transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
            <p className='text-sm text-darkGreen dark:text-white'>
              Simulates the screenshot in a browser tab.
            </p>
          </div>
        </div>
        <Popover className='relative justify-self-end'>
          {({ open }) => (
            <>
              <Popover.Button>
                <ChevronRightIcon
                  className={`${
                    open ? 'rotate-90 transform' : ''
                  } h-5 w-5 text-darkGreen dark:text-white`}
                />
              </Popover.Button>
              <Popover.Panel className='absolute right-0 z-50 p-4 mt-2 rounded-md shadow-md top-full w-72 bg-dark/40 backdrop-blur-md'>
                <div className='grid grid-cols-2 gap-4'>
                  {/* render preview */}
                  {browserFrames.map((frame, i) => {
                    const isActive = options.browserBar === frame.value;
                    return (
                      <button
                        className={`${
                          isActive ? 'bg-primary/70' : 'bg-gray-400/50'
                        }  w-full rounded-md p-2`}
                        key={i}
                        onClick={() =>
                          setOptions({
                            ...options,
                            browserBar: frame.value,
                          })
                        }>
                        <div className='relative grid h-24 w-full grid-rows-[calc(12px*3),1fr]'>
                          {getTabFrame(frame.value)}
                          <div
                            className={`h-full bg-white ${
                              whitelist.includes(frame.value)
                                ? 'z-10 row-span-full rounded-md'
                                : 'rounded-b-md'
                            }`}></div>
                        </div>
                        <p className='mt-2 text-xs text-darkGreen dark:text-white'>
                          {frame.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default BrowserFrame;
