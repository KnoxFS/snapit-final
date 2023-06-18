import { Popover } from '@headlessui/react';
import {
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import getCodeFrame from 'utils/getCodeFrame';

const codeFrames = [
  {
    name: 'Hidden',
    value: 'hidden',
  },
  {
    name: 'Mac',
    value: 'mac',
  },
  {
    name: 'Windows',
    value: 'windows',
  },
];

const BrowserFrame = ({ options, setOptions }) => {
  return (
    <div className='grid w-full grid-cols-[3fr,1fr]'>
      <div className='flex items-center space-x-2'>
        <ComputerDesktopIcon className='w-6 h-6 text-darkGreen dark:text-white' />

        <h3 className='text-sm text-darkGreen dark:text-white'>
          Editor Frame
        </h3>
      </div>

      <div className='flex items-center justify-around'>
        {/* tip */}
        <div className='relative'>
          <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen  dark:text-white [&~div]:hover:block' />
          <div className='absolute z-50 hidden p-2 text-center transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
            <p className='text-sm text-darkGreen dark:text-white'>
              Simulates the edit in IDE.
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
                  } h-5 w-5 text-darkGreen  dark:text-white`}
                />
              </Popover.Button>
              <Popover.Panel className='absolute right-0 z-50 p-4 mt-2 rounded-md shadow-md top-full w-72 bg-dark/40 backdrop-blur-md'>
                <div className='grid grid-cols-2 gap-4'>
                  {/* render preview */}
                  {codeFrames.map((frame, i) => {
                    const isActive = options.frame === frame.value;
                    return (
                      <button
                        className={`${
                          isActive ? 'bg-primary/70' : 'bg-gray-400/50'
                        }  w-full rounded-md p-2`}
                        key={i}
                        onClick={() =>
                          setOptions({
                            ...options,
                            frame: frame.value,
                          })
                        }>
                        <div className='relative grid h-24 w-full grid-rows-[32px,1fr]'>
                          <div className='w-full p-2 rounded-t-md bg-dark'>
                            {getCodeFrame(frame.value)}
                          </div>
                          <div className={`h-full rounded-b-md bg-dark`}></div>
                        </div>
                        <p className='mt-2 text-xs text-white'>{frame.name}</p>
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
