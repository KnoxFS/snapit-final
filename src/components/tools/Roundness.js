import { Disclosure, RadioGroup } from '@headlessui/react';
import { useRef } from 'react';

import { TurboIcon } from 'ui/icons';

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import useDrag from 'hooks/useDrag';

const targets = {
  screenshot: 'rounded',
  wrapper: 'roundedWrapper',
};

const Roundness = ({ options, setOptions, target = 'screenshot' }) => {
  const roundnessRef = useRef(null);
  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='w-full'>
            <div className='grid grid-cols-[3fr,1fr] w-full'>
              <div className='flex items-center space-x-2'>
                <TurboIcon />

                <h3 className='text-sm text-white'>Roundness</h3>
              </div>

              <div className='flex justify-around items-center'>
                {/* tip */}
                <div className='relative'>
                  <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />
                  <div className='absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
                    <p className='text-sm text-white'>
                      Sets the roundness of the screenshot's corners.
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  className={`${
                    open ? 'rotate-90 transform' : ''
                  } h-5 w-5 text-white justify-self-end`}
                />
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel
            ref={roundnessRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={e =>
              dragMove(e, diff => (roundnessRef.current.scrollLeft += diff))
            }
            className='w-full overflow-x-scroll custom-scrollbar-sm'>
            <RadioGroup
              className='p-2 flex items-center space-x-2 w-max'
              value={options[targets[target]]}
              onChange={value =>
                setOptions({ ...options, [targets[target]]: value })
              }>
              <RadioGroup.Label className='sr-only'>Roundness</RadioGroup.Label>

              <RadioGroup.Option
                as='button'
                value='rounded-none'
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                None
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='rounded-2xl'
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                Small
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='rounded-3xl'
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                Medium
              </RadioGroup.Option>

              <RadioGroup.Option
                as='button'
                value='rounded-[32px]'
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                Large
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Roundness;
