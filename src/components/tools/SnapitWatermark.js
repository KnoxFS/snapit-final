import { Switch } from '@headlessui/react';

import {
  PaintBrushIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import useAuth from 'hooks/useAuth';

const SnapitWatermark = ({ options, setOptions, proMode }) => {
  const { user } = useAuth();

  return (
    <div className='grid grid-cols-[3fr,1fr] w-full items-center'>
      <div className='flex items-center space-x-2'>
        <PaintBrushIcon className='h-5 w-5 text-white/90' />

        <h3 className='text-sm text-white/90'>Snapit Watermark</h3>
      </div>
      {/* tip */}
      <div className='flex justify-around items-center'>
        <div className='relative'>
          <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />
          <div className='absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
            <p className='text-sm text-white text-center'>
              Website's watermark will be added to the screenshot.
            </p>
          </div>
        </div>
        {!proMode && (
          <div className='justify-self-end'>
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
          </div>
        )}
      </div>

      {proMode && (
        <Switch
          checked={options?.watermark || false}
          onChange={e => {
            if (!user?.isPro) {
              toast.error('You need to be a pro member to use this feature');
              return;
            }

            setOptions({
              ...options,
              watermark: !options?.watermark,
            });
          }}
          className={`${options?.watermark ? 'bg-primary' : 'bg-[#212121]'}
         relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}>
          <span className='sr-only'>Use setting</span>
          <span
            aria-hidden='true'
            className={`${
              options?.watermark ? 'translate-x-8' : 'translate-x-[3px]'
            }
           pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      )}
    </div>
  );
};

export default SnapitWatermark;
