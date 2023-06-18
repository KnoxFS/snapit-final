import { useRef } from 'react';
import { Disclosure, RadioGroup } from '@headlessui/react';
import { BubbleIcon } from 'ui/icons';

import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import useDrag from 'hooks/useDrag';

const AspectRatio = ({ options, setOptions }) => {
  const sizesRef = useRef(null);

  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='w-full'>
            <div className='grid w-full grid-cols-[3fr,1fr]'>
              <div className='flex items-center space-x-2 '>
                <BubbleIcon />

                <h3 className='text-sm text-darkGreen dark:text-white'>Size</h3>
              </div>

              <div className='flex items-center justify-around'>
                {/* tip */}
                <div className='relative'>
                  <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
                  <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
                    <p className='text-sm text-darkGreen dark:text-white'>
                      Aspect ratio is the ratio of the width of an image to its
                      height.
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  className={`${
                    open ? 'rotate-90 transform' : ''
                  } h-5 w-5 justify-self-end text-darkGreen dark:text-white`}
                />
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel
            ref={sizesRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={e =>
              dragMove(e, diff => (sizesRef.current.scrollLeft += diff))
            }
            className='w-full overflow-x-scroll custom-scrollbar-sm'>
            <RadioGroup
              className='flex items-center p-2 space-x-2 w-max'
              value={options.aspectRatio}
              onChange={value =>
                setOptions({ ...options, aspectRatio: value })
              }>
              <RadioGroup.Label className='sr-only'>Size</RadioGroup.Label>

              <RadioGroup.Option
                as='button'
                value='aspect-auto !scale-100'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Auto
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-[2/1] !scale-95'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Tweet
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-[6/3] !scale-75'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Instagram Post
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-[4/3] !scale-75'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Dibbble
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-[16/9] !scale-100'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                YouTube Video
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-appstore !scale-75'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                App store
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='aspect-[16/10] !scale-75'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Product Hunt
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AspectRatio;
