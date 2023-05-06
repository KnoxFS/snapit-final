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
            <div className='grid grid-cols-[3fr,1fr] w-full'>
              <div className='flex items-center space-x-2'>
                <TextIcon className='h-6 w-6 text-[#A0A0A0]' />

                <h3 className='text-sm text-white'>Edit Text</h3>
              </div>

              {/* tip */}
              <div className='flex justify-around items-center'>
                <div className='relative'>
                  <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />
                  <div className='absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
                    <p className='text-sm text-white'>
                      Put some text inside the canvas.
                    </p>
                  </div>
                </div>
                {user?.isPro ? (
                  <ChevronRightIcon
                    className={`${
                      open ? 'rotate-90 transform' : ''
                    } h-5 w-5 text-gray-500 justify-self-end`}
                  />
                ) : (
                  <div className='justify-self-end mr-2'>
                    <ThunderIcon />
                  </div>
                )}
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className='w-full overflow-x-scroll custom-scrollbar-sm'>
            <div>
              <label className='text-white text-sm'>
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
                  className='w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4 resize-vertical custom-scrollbar-sm'
                />
              </label>

              <label className='text-white text-sm'>
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
                  className='w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4 resize-vertical custom-scrollbar-sm'
                />
              </label>

              <div className='flex justify-between items-center mb-4'>
                {/* color */}
                <div className='flex text-sm [&>*]:text-center [&>*]:p-1 [&>*]:border [&>*]:border-gray-500 text-white'>
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
                <div className='flex text-sm [&>*]:text-center [&>*]:p-1 [&>*]:border [&>*]:border-gray-500 text-white'>
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
                <div className='flex text-sm [&>*]:text-center [&>*]:p-1 [&>*]:border [&>*]:border-gray-500 text-white'>
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
                <div className='flex items-center text-white space-x-2'>
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
          relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}>
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
