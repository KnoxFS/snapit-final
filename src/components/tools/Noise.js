import { Switch } from '@headlessui/react';

import {
  SparklesIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Noise = ({ options, setOptions }) => {
  return (
    <div className='grid w-full grid-cols-[3fr,1fr] items-center'>
      <div className='flex items-center space-x-2'>
        <SparklesIcon className='w-6 h-6 text-darkGreen dark:text-white' />

        <h3 className='text-sm text-darkGreen dark:text-white'>Noise</h3>
      </div>
      <div className='flex items-center justify-center gap-1'>
        {/* tip */}
        <div className='relative'>
          <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
          <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
            <p className='text-sm text-center text-darkGreen dark:text-white'>
              Puts a grainy texture over the screenshot.
            </p>
          </div>
        </div>
        <Switch
          checked={options?.noise || false}
          onChange={e => setOptions({ ...options, noise: !options?.noise })}
          className={`${options?.noise ? 'bg-primary' : 'bg-darkGreen'}
        relative inline-flex h-[20px] w-[32px] shrink-0 cursor-pointer items-center justify-self-end rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
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
