import { Disclosure, Switch } from '@headlessui/react';
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  Bars3BottomLeftIcon,
} from '@heroicons/react/24/outline';

import useAuth from 'hooks/useAuth';
import { TextIcon, ThunderIcon } from 'ui/icons';

const EditText = ({ options, setOptions }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className='w-full' disabled={!user?.isPro}>
            <div className='grid w-full grid-cols-[3fr,1fr]'>
              <div className='flex items-center space-x-2'>
                <TextIcon className='w-6 h-6 text-darkGreen dark:text-white' />

                <h3 className='text-sm text-darkGreen dark:text-white'>
                  Edit Text
                </h3>
              </div>

              {/* tip */}
              <div className='flex items-center justify-around'>
                <div className='relative'>
                  <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen dark:text-white [&~div]:hover:block' />
                  <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
                    <p className='text-sm text-darkGreen dark:text-white'>
                      Put some text inside the canvas.
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

          <Disclosure.Panel className='w-full overflow-x-scroll custom-scrollbar-sm'>
            <div>
              <label className='text-sm text-darkGreen dark:text-white'>
                <p className='mb-2'>Heading</p>
                <textarea
                  type='text'
                  placeholder='Enter text'
                  value={options.text.heading}
                  onChange={e =>
                    setOptions({
                      ...options,
                      text: {
                        ...options.text,
                        heading: e.target.value,
                      },
                    })
                  }
                  className='resize-vertical custom-scrollbar-sm mb-4 w-full rounded-md bg-[#212121] py-2 px-4 text-white outline-none'
                />
              </label>

              <label className='text-sm text-darkGreen dark:text-white'>
                <p className='mb-2'>Sub-Heading</p>
                <textarea
                  type='text'
                  placeholder='Enter text'
                  value={options.text.subheading}
                  onChange={e =>
                    setOptions({
                      ...options,
                      text: {
                        ...options.text,
                        subheading: e.target.value,
                      },
                    })
                  }
                  className='resize-vertical custom-scrollbar-sm mb-4 w-full rounded-md bg-[#212121] py-2 px-4 text-white outline-none'
                />
              </label>

              <div className='flex items-center justify-between mb-4'>
                {/* color */}
                <div className='flex text-sm text-white [&>*]:border [&>*]:border-gray-500 [&>*]:p-1 [&>*]:text-center'>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          color: 'dark',
                        },
                      })
                    }
                    className={`rounded-l-md ${
                      options.text.color === 'dark'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Dark
                  </button>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          color: 'white',
                        },
                      })
                    }
                    className={`rounded-r-md ${
                      options.text.color === 'white'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    White
                  </button>
                </div>

                {/* aligment */}
                <div className='flex text-sm text-white [&>*]:border [&>*]:border-gray-500 [&>*]:p-1 [&>*]:text-center'>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          align: 'text-left',
                        },
                      })
                    }
                    className={`rounded-l-md ${
                      options.text.align === 'text-left'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Left
                  </button>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          align: 'text-center',
                        },
                      })
                    }
                    className={`${
                      options.text.align === 'text-center'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Center
                  </button>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          align: 'text-right',
                        },
                      })
                    }
                    className={`rounded-r-md ${
                      options.text.align === 'text-right'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Right
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                {/* aligment */}
                <div className='flex text-sm text-white [&>*]:border [&>*]:border-gray-500 [&>*]:p-1 [&>*]:text-center'>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          position: 'top',
                        },
                      })
                    }
                    className={`rounded-l-md ${
                      options.text.position === 'top'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Top
                  </button>
                  <button
                    onClick={() =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          position: 'bottom',
                        },
                      })
                    }
                    className={`rounded-r-md ${
                      options.text.position === 'bottom'
                        ? 'bg-primary text-black'
                        : ''
                    }`}>
                    Bottom
                  </button>
                </div>

                {/* switch show */}
                <div className='flex items-center space-x-2 text-white'>
                  <p className='text-sm'>Show text</p>
                  <Switch
                    checked={options?.text.show || false}
                    onChange={e =>
                      setOptions({
                        ...options,
                        text: {
                          ...options.text,
                          show: !options.text.show,
                        },
                      })
                    }
                    className={`${
                      options.text.show ? 'bg-primary' : 'bg-[#212121]'
                    }
          relative inline-flex h-[20px] w-[52px] shrink-0 cursor-pointer items-center justify-self-end rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={`${
                        options.text.show
                          ? 'translate-x-8'
                          : 'translate-x-[3px]'
                      }
            pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default EditText;
