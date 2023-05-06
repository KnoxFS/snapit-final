import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import classnames from 'classnames';

import ReactTilt from 'react-parallax-tilt';
import { Disclosure, RadioGroup } from '@headlessui/react';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import {
  ColorPickerIcon,
  SaveIcon,
  ClipboardIcon,
  BackgroundIcon,
  ResetIcon,
  TwitterIcon,
  CommentIcon,
  HeartIcon,
} from 'ui/icons';

import updateStats from 'utils/updateStats';
import getTweetDate from 'utils/getTweetDate';
import formatTweetChild from 'utils/formatTweetChild';

import useAuth from 'hooks/useAuth';

import Tweet from './tools/Tweet';
import Shadow from './tools/Shadow';
import Tilt from './tools/Tilt';
import Roundness from './tools/Roundness';
import SnapitWatermark from './tools/SnapitWatermark';
import EditText from './tools/EditText';

import {
  cssGradientsDirections,
  gradientDirections,
} from 'constants/gradients';

const defaultOptions = {
  aspectRatio: 'aspect-auto',
  theme: 'from-indigo-400 via-blue-400 to-purple-600',
  bgDirection: 'bg-gradient-to-br',
  watermark: true,
  customTheme: {
    colorStart: '#03b5b2',
    colorEnd: '#f3b4e1',
  },
  shadow: 'drop-shadow-none',
  position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',

  rounded: 'rounded-2xl',
  roundedWrapper: 'rounded-2xl',
  fontSize: 'text-base',
  size: 100,

  tweet: {
    user: {
      name: 'Elon Musk',
      username: '@elonmusk',
      image: '/elon.jpg',
    },

    content:
      'First World Cup match on Sunday! Watch on Twitter for best coverage & real-time commentary.',

    metrics: {
      show: true,

      likes: {
        show: true,
        value: '1.2M',
      },

      comments: {
        show: true,
        value: '200K',
      },
    },

    date: new Date(),
    showDate: true,
  },

  // text
  text: {
    heading: 'Made with Snapit.gg',
    subheading: 'The best screenshot maker',
    show: false,
    color: 'dark',
    size: 'text-2xl',
    position: 'top',
    align: 'text-center',
  },
};

const TemplateMaker = ({ proMode }) => {
  const { user } = useAuth();

  const wrapperRef = useRef();

  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });

  const [tweetUrl, setTweetUrl] = useState('');

  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  // get tweet from url
  const getTweetFromUrl = async () => {
    if (!proMode) {
      toast.error('This feature is only available in pro mode');
      return;
    }

    // match tweet url https://twitter.com/cvander/status/1593422812202426369
    const regex = /https:\/\/twitter.com\/\w+\/status\/(\d+)/;
    const match = tweetUrl.match(regex);

    if (!match) {
      toast.error('Invalid tweet url.');
      return;
    }

    const tweetId = match[1];

    const res = await (await fetch(`/api/getTweet?id=${tweetId}`)).json();

    if (res.error) {
      toast.error(res.error);
      return;
    }

    setOptions(prev => ({
      ...prev,
      tweet: {
        ...prev.tweet,
        user: {
          name: res.data.name,
          username: `@${res.data.username}`,
          image: res.data.avatar.normal,
        },
        // join in a string each node and children
        content: res.nodes.map(node => formatTweetChild(node)).join(' '),
        date: res.data.createdAt,

        metrics: {
          ...prev.tweet.metrics,
          likes: {
            ...prev.tweet.metrics.likes,
            value: res.data.heartCount,
          },

          comments: {
            ...prev.tweet.metrics.comments,
            value: res.data.ctaCount,
          },
        },
      },
    }));

    toast.success('Tweet fetched successfully.');
    setTweetUrl('');
  };

  // export image
  const saveImage = async () => {
    let savingToast = toast.loading('Exporting image...');
    const scale = window.devicePixelRatio;
    domtoimage
      .toPng(wrapperRef.current, {
        height: wrapperRef.current.offsetHeight * scale,
        width: wrapperRef.current.offsetWidth * scale,
        style: {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left',
          width: wrapperRef.current.offsetWidth + 'px',
          height: wrapperRef.current.offsetHeight + 'px',
        },
      })
      .then(async data => {
        domtoimage
          .toPng(wrapperRef.current, {
            height: wrapperRef.current.offsetHeight * scale,
            width: wrapperRef.current.offsetWidth * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
              width: wrapperRef.current.offsetWidth + 'px',
              height: wrapperRef.current.offsetHeight + 'px',
            },
          })
          .then(async data => {
            var a = document.createElement('A');
            a.href = data;
            a.download = `snapit-${new Date().toISOString()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success('Templates exported!', { id: savingToast });

            if (window.pirsch) {
              pirsch('🎉 Template saved');
            }

            if (user) {
              // update stats
              updateStats(user.id, 'Template_Saved');
            }
          });
      });
  };

  // snapshot for copy image to clipboard
  const snapshotCreator = () => {
    return new Promise((resolve, reject) => {
      try {
        const scale = window.devicePixelRatio;
        const element = wrapperRef.current; // You can use element's ID or Class here
        domtoimage
          .toBlob(element, {
            height: element.offsetHeight * scale,
            width: element.offsetWidth * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
              width: element.offsetWidth + 'px',
              height: element.offsetHeight + 'px',
            },
          })
          .then(blob => {
            resolve(blob);
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  // copy image to clipboard
  const copyImage = () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator?.userAgent,
    );
    const isNotFirefox = navigator.userAgent.indexOf('Firefox') < 0;

    if (isSafari) {
      navigator.clipboard
        .write([
          new ClipboardItem({
            'image/png': new Promise(async (resolve, reject) => {
              try {
                await snapshotCreator();
                const blob = await snapshotCreator();
                resolve(new Blob([blob], { type: 'image/png' }));
              } catch (err) {
                reject(err);
              }
            }),
          }),
        ])
        .then(() => {
          // Success
          toast.success('Template copied to clipboard');

          if (window.pirsch) {
            pirsch('🙌 Template copied');
          }

          if (user) {
            // update stats
            updateStats(user.id, 'Template_Copied');
          }
        })
        .catch(err =>
          // Error
          toast.success(err),
        );
    } else if (isNotFirefox) {
      navigator?.permissions
        ?.query({ name: 'clipboard-write' })
        .then(async result => {
          if (result.state === 'granted') {
            const type = 'image/png';
            await snapshotCreator();
            const blob = await snapshotCreator();
            let data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard
              .write(data)
              .then(() => {
                // Success
                toast.success('Template copied to clipboard');

                if (window.pirsch) {
                  pirsch('🙌 Screenshot copied');
                }

                if (user) {
                  // update stats
                  updateStats(user.id, 'Template_Copied');
                }
              })
              .catch(err => {
                // Error
                console.error('Error:', err);
              });
          }
        });
    } else {
      alert('Firefox does not support this functionality');
    }
  };

  const pickBackground = () => {
    return (
      <>
        {bgPicker ? (
          <div
            className='fixed inset-0 w-full h-full bg-transparent'
            onClick={() => setBGPicker(false)}
          />
        ) : (
          ''
        )}
        <div
          className={classnames(
            'absolute w-auto max-w-[400px] z-10 top-[calc(100%)] left-[-30px] bg-white/80 backdrop-blur shadow-lg py-4 px-5 rounded-xl flex shadow-gray-500/50 dark:shadow-black/80 border border-gray-400 flex-col dark:border-gray-800 dark:bg-black/80 duration-200',
            {
              'opacity-0 pointer-events-none scale-[0.9]': !bgPicker,
            },
            {
              'opacity-100 pointer-events-auto scale-[1]': bgPicker,
            },
          )}>
          <div
            className='absolute top-[5%] right-[5%] opacity-50 cursor-pointer hover:opacity-100 z-10'
            onClick={() => setBGPicker(false)}>
            ✕
          </div>
          <div className='relative mb-3'>
            {/* Pick Start Color */}
            <div className='mb-1'>Pick first color</div>
            <div className='flex items-center'>
              <div className='relative group'>
                <input
                  id='startColorPicker'
                  type='color'
                  className='absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer'
                  value={options.customTheme.colorStart || '#222'}
                  onChange={e =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorStart: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorStart || '#222',
                  }}
                  htmlFor='startColorPicker'
                  className='left-0 flex items-center justify-center w-12 h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100'>
                  <span className='font-mono text-xs text-white/80 drop-shadow'>
                    Pick
                  </span>
                </label>
              </div>
              <span className='px-4 opacity-50'>/</span>
              <input
                placeholder='Enter hex value'
                type='text'
                value={options.customTheme.colorStart || '#000000'}
                className='px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black'
                onChange={e => {
                  let startColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorStart: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(startColorToast);
                    toast.success('First color applied', {
                      id: startColorToast,
                    });
                  } else {
                    toast.dismiss(startColorToast);
                    toast.error('Invalid Hex color', { id: startColorToast });
                  }
                }}
              />
            </div>
          </div>

          {/* Pick End Color */}
          <div>
            <div className='mb-1'>Pick second color</div>
            <div className='flex items-center'>
              <div className='relative group'>
                <input
                  id='startColorPicker'
                  type='color'
                  className='absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer'
                  value={options.customTheme.colorEnd || '#222'}
                  onChange={e =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorEnd: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorEnd || '#222',
                  }}
                  htmlFor='startColorPicker'
                  className='left-0 flex items-center justify-center w-12  h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100'>
                  <span className='font-mono text-xs text-white/80 drop-shadow'>
                    Pick
                  </span>
                </label>
              </div>
              <span className='px-4 opacity-50'>/</span>
              <input
                placeholder='Enter hex value'
                type='text'
                value={options.customTheme.colorEnd || '#000000'}
                className='px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black'
                onChange={e => {
                  let endColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorEnd: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(endColorToast);
                    toast.success('Second color applied', {
                      id: endColorToast,
                    });
                  } else {
                    toast.dismiss(endColorToast);
                    toast.error('Invalid Hex color', { id: endColorToast });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const onTiltMove = stick => {
    setManualTiltAngle([stick.y ? stick.y / 2 : 0, stick.x ? stick.x / 2 : 0]);
  };

  const resetCanvas = () => {
    setOptions(defaultOptions);
    setManualTiltAngle([0, 0]);
  };

  const renderPreview = () => (
    <article className='bg-[#2B2C2F] h-full p-8 rounded-md flex justify-center'>
      {/* wrapper */}
      <div
        ref={wrapperRef}
        style={
          options?.customTheme
            ? {
                background: `linear-gradient(${
                  cssGradientsDirections[options.bgDirection]
                }, ${options?.customTheme?.colorStart || 'transparent'}, ${
                  options?.customTheme?.colorEnd || 'transparent'
                })`,
              }
            : {}
        }
        className={`${options.bgDirection} ${options.theme} ${
          options.roundedWrapper
        }  w-full relative overflow-hidden transition-all flex px-4 py-8 ${
          options.text.position === 'top' ? 'flex-col' : 'flex-col-reverse'
        } justify-center items-center`}>
        {/* Text */}

        {options?.text.show && (
          <div
            className={`w-full ${options.text.align} ${
              options.text.position === 'top' ? 'mb-6' : 'mt-6'
            } ${options.text.color === 'dark' ? 'text-black' : 'text-white'}`}>
            <p className='font-bold text-3xl mb-2 break-word whitespace-pre-wrap'>
              {options.text.heading}
            </p>
            <p className='break-word whitespace-pre-wrap'>
              {options.text.subheading}
            </p>
          </div>
        )}

        <ReactTilt
          tiltAngleXManual={manualTiltAngleX}
          tiltAngleYManual={manualTiltAngleY}
          tiltMaxAngleY={30}
          tiltMaxAngleX={30}
          reset={false}
          className='flex justify-center items-center w-[100%] md:w-[80%]'>
          {/* Tweet Card */}
          <div
            style={{
              transform: `scale(${options.size / 100})`,
            }}
            className={`bg-white w-full p-8 ${options.rounded} ${options.shadow} scale-75 md:scale-100`}>
            {/* Header */}
            <header className='flex items-center justify-between'>
              {/* User  */}
              <div className='flex flex-1 items-center space-x-2'>
                <div
                  className='w-12 h-12 bg-gray-200 rounded-full bg-cover'
                  style={{
                    backgroundImage: `url(${options?.tweet?.user?.image})`,
                  }}></div>

                <div className='w-full'>
                  <h3 className='font-bold'>{options.tweet.user.name}</h3>
                  <p className='text-gray-500 text-sm'>
                    {options.tweet.user.username}
                  </p>
                </div>
              </div>

              <TwitterIcon className='w-8 text-[#1DA1F2]' />
            </header>

            {/* Content */}
            <div
              className='my-6 text-gray-700 tweet-content'
              dangerouslySetInnerHTML={{
                __html: options.tweet.content,
              }}></div>

            {/* Footer */}
            <footer>
              {/* Date */}
              {options.tweet.showDate && (
                <p className='text-gray-500 text-sm'>
                  {getTweetDate(options.tweet.date)}
                </p>
              )}

              {/* metrics */}
              {options.tweet.metrics.show && (
                <ul className='mt-4 flex space-x-4'>
                  <li className='flex items-center space-x-1 text-gray-500 text-sm'>
                    <HeartIcon className='w-5 h-5 text-red-400' />
                    <span>{options.tweet.metrics.likes.value}</span>
                  </li>
                  <li className='flex items-center space-x-1 text-gray-500 text-sm'>
                    <CommentIcon className='w-5 h-5 text-blue-400' />
                    <span>{options.tweet.metrics.comments.value}</span>
                  </li>
                </ul>
              )}
            </footer>
          </div>
        </ReactTilt>

        {/* watermark */}
        {options?.watermark && (
          <div className='bg-green-500 text-white absolute bottom-0 right-1/2 translate-x-1/2 p-1 px-2 select-none text-xs rounded-t-md'>
            Made with snapit.gg
          </div>
        )}
      </div>
    </article>
  );

  const renderOptions = () => (
    <article className='bg-[#2B2C2F] rounded-md p-4 overflow-y-auto overflow-x-hidden max-h-[680px] custom-scrollbar'>
      <div className='space-y-4'>
        <h3 className='text-center text-gray-500 w-full'>Tweet Options</h3>

        {/* Get Tweet from url */}
        <input
          type='text'
          placeholder='Enter tweet URL'
          className='w-full p-2 text-center text-sm bg-[#212121] rounded-md border border-[#2B2C2F] text-white outline-none'
          value={tweetUrl}
          onChange={e => setTweetUrl(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              getTweetFromUrl();
            }
          }}
        />

        <button
          className='bg-primary w-full py-1 rounded-md text-white text-sm hover:bg-green-500 transition'
          onClick={getTweetFromUrl}>
          Get tweet
        </button>

        {/* Tweet */}
        <Tweet options={options} setOptions={setOptions} />

        {/* Shadow */}
        <Shadow options={options} setOptions={setOptions} />

        {/* Edit Text */}
        <EditText options={options} setOptions={setOptions} />

        {/* Device tilt */}
        <Tilt
          proMode={proMode}
          onTiltMove={onTiltMove}
          setManualTiltAngle={setManualTiltAngle}
        />

        <h3 className='text-center text-gray-500 w-full'>Canvas Options</h3>

        {/* Background */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='w-full'>
                <div className='relative flex items-center justify-between pb-2 text-sm text-gray-400 w-full'>
                  <div className='flex items-center'>
                    <div className='flex items-center space-x-2'>
                      <BackgroundIcon className='h-6 w-6 text-[#A0A0A0]' />

                      <h3 className='text-sm text-gray-400'>Background</h3>
                    </div>

                    <div className='relative'>
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          setBGPicker(!bgPicker);
                        }}
                        className='flex items-center px-2 ml-2 rounded-lg cursor-pointer bg-primary text-white'>
                        <span className='w-3 h-3 mr-1'>{ColorPickerIcon}</span>
                        Pick
                      </div>
                    </div>
                    {pickBackground()}
                  </div>
                  <ChevronRightIcon
                    className={`${
                      open ? 'rotate-90 transform' : ''
                    } h-5 w-5 text-gray-500`}
                  />
                </div>
              </Disclosure.Button>

              <Disclosure.Panel className='w-full overflow-x-scroll scrollbar-none'>
                <div>
                  <div className='grid flex-wrap grid-cols-6 mt-1 gap-x-4 gap-y-2'>
                    {[
                      'bg-gradient-to-br from-pink-300 via-orange-200 to-red-300',
                      'bg-gradient-to-br from-green-300 via-yellow-200 to-green-200',
                      'bg-gradient-to-br from-green-200 via-blue-100 to-blue-300',
                      'bg-gradient-to-br from-indigo-300 via-blue-400 to-purple-500',
                      'bg-gradient-to-br from-red-300 via-orange-300 to-yellow-200',
                      'bg-gradient-to-br from-pink-300 via-pink-400 to-red-400',
                      'bg-gradient-to-br from-slate-400 via-gray-500 to-gray-700',
                      'bg-gradient-to-br from-orange-300 via-orange-400 to-red-400',
                      'bg-gradient-to-br from-teal-300 to-cyan-400',
                      'bg-gradient-to-br from-red-300 to-purple-600',
                      'bg-white',
                      'bg-black',
                    ].map(theme => (
                      <div
                        key={theme}
                        className={`cursor-pointer shadow dark:shadow-black/20 shadow-gray-500/20 w-8 h-8 rounded-full ${theme}`}
                        onClick={() => {
                          setOptions({
                            ...options,
                            theme: theme,
                            customTheme: false,
                          });
                        }}
                      />
                    ))}
                  </div>

                  {/* gradient direction */}
                  <RadioGroup
                    className='flex items-center space-x-2 mt-4'
                    value={options.bgDirection}
                    onChange={value =>
                      setOptions({
                        ...options,
                        bgDirection: value,
                      })
                    }>
                    {gradientDirections.map(gd => (
                      <RadioGroup.Option
                        key={gd}
                        value={gd.value}
                        className='border p-1 rounded-md ui-checked:border-green-400 cursor-pointer'>
                        <span>{gd.icon}</span>
                      </RadioGroup.Option>
                    ))}
                  </RadioGroup>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Roundness */}
        <Roundness options={options} setOptions={setOptions} target='wrapper' />

        {/* Snapit Watermark */}
        <SnapitWatermark
          options={options}
          setOptions={setOptions}
          proMode={proMode}
        />

        {/* Export / Copy */}
        <div className='flex items-center justify-center w-full space-x-6 !mt-12'>
          <button
            className='flex items-center justify-center px-4 py-2 text-base bg-primary rounded-md text-white'
            title='Use Ctrl/Cmd + S to save the image'
            onClick={saveImage}>
            <span className='w-6 h-6 mr-2'>{SaveIcon}</span>
            Save
          </button>

          <button
            className='flex items-center justify-center px-4 py-2 text-base bg-primary rounded-md text-white'
            onClick={copyImage}
            title='Use Ctrl/Cmd + C to copy the image'>
            <span className='w-6 h-6 mr-2'>{ClipboardIcon}</span>
            Copy
          </button>
        </div>

        {/* Reset */}
        <div
          onClick={resetCanvas}
          className='flex items-center justify-center w-full mx-auto text-green-400 cursor-pointer !mt-8'>
          <span className='w-4 h-4 mr-1'>{ResetIcon}</span>
          Reset
        </div>
      </div>
    </article>
  );

  return (
    <section className='w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[1fr,300px] gap-10'>
      {renderPreview()} {renderOptions()}
    </section>
  );
};

export default TemplateMaker;
