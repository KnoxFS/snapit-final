import { Popover } from '@headlessui/react';
import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Design from '../design/design';
import { KeyboardIcon } from 'ui/icons';

const KeyboardFrame = ({ themeSelected, setThemeSelected, defaultKeys }) => {
  return (
    <div className='grid w-full grid-cols-[180px,3fr]'>
      <div className='flex items-center space-x-2'>
        <KeyboardIcon className={'text-darkGreen  dark:text-white'} />

        <h3 className='text-sm text-darkGreen dark:text-white'>
          Keyboard Style
        </h3>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        {/* tip */}
        <div className='relative'>
          <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen  dark:text-white [&~div]:hover:block' />
          <div className='absolute z-50 hidden p-2 text-center transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
            <p className='text-sm text-darkGreen dark:text-white'>
              Simulates the edit in Keys Style.
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
                  } mt-1 h-5 w-5 text-darkGreen  dark:text-white`}
                />
              </Popover.Button>

              <Popover.Panel className='absolute right-0 z-50 p-4 mt-2 rounded-md shadow-md top-full w-72 bg-dark/40 backdrop-blur-md'>
                <div className='grid grid-cols-1 gap-4'>
                  <article className='custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-bgDark p-4'>
                    <div className='flex flex-col h-full space-y-4'>
                      <Design
                        className='col-span-full md:col-span-1'
                        themeSelected={themeSelected}
                        setSelected={setThemeSelected}
                        value={defaultKeys}
                      />
                    </div>
                  </article>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default KeyboardFrame;
