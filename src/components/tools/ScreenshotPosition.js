import { Disclosure, RadioGroup } from '@headlessui/react';
import { useRef } from 'react';

import { SizeIcon } from 'ui/icons';

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import useDrag from 'hooks/useDrag';

const ScreenshotPosition = ({ options, setOptions }) => {
  const postionRef = useRef(null);

  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='w-full'>
            <div className='grid w-full grid-cols-[3fr,1fr]'>
              <div className='flex items-center space-x-2'>
                <SizeIcon className='w-4 h-4 text-darkGreen dark:text-white' />

                <h3 className='text-sm text-darkGreen dark:text-white'>
                  Screenshot Position
                </h3>
              </div>

              <div className='flex items-center justify-around'>
                {/* tip */}
                <div className='relative'>
                  <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
                  <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
                    <p className='text-sm text-darkGreen dark:text-white'>
                      Sets the screenshot's position relative to the container.
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
            ref={postionRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={e =>
              dragMove(e, diff => (postionRef.current.scrollLeft += diff))
            }
            className='w-full overflow-x-scroll custom-scrollbar-sm'>
            <RadioGroup
              className='flex items-center p-2 space-x-2 w-max'
              value={options.position}
              onChange={value => setOptions({ ...options, position: value })}>
              <RadioGroup.Label className='sr-only'>Roundness</RadioGroup.Label>

              <RadioGroup.Option
                as='button'
                value=''
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Center
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='pl-0 pt-0'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Top left
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='pt-0 pr-0'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Top right
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='pb-0 pl-0'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Bottom left
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='pb-0 pr-0'
                className={`rounded-md border border-gray-400 py-2 px-4 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                Bottom right
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ScreenshotPosition;
