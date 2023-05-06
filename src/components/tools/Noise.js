import { Switch } from '@headlessui/react';

import {
  SparklesIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Noise = ({ options, setOptions }) => {
  return (
    <div className='grid grid-cols-[3fr,1fr] w-full items-center'>
      <div className='flex items-center space-x-2'>
        <SparklesIcon className='h-6 w-6 text-white' />

        <h3 className='text-sm text-white'>Noise</h3>
      </div>
      <div className='flex justify-center items-center gap-1'>
        {/* tip */}
        <div className='relative'>
          <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />
          <div className='absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
            <p className='text-sm text-white text-center'>
              Puts a grainy texture over the screenshot.
            </p>
          </div>
        </div>
        <Switch
          checked={options?.noise || false}
          onChange={e => setOptions({ ...options, noise: !options?.noise })}
          className={`${options?.noise ? 'bg-primary' : 'bg-darkGreen'}
        relative inline-flex h-[20px] w-[32px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}>
          <span className='sr-only'>Use setting</span>
          <span
            aria-hidden='true'
            className={`${
              options?.noise ? 'translate-x-4' : 'translate-x-[3px]'
            }
        pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
};

export default Noise;
