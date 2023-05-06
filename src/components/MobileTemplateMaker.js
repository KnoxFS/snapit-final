import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import classnames from 'classnames';

import ReactTilt from 'react-parallax-tilt';
import { Disclosure, Popover, RadioGroup } from '@headlessui/react';

import {
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  ColorPickerIcon,
  SaveIcon,
  ClipboardIcon,
  BackgroundIcon,
  ResetIcon,
} from 'ui/icons';

import updateStats from 'utils/updateStats';
import useAuth from 'hooks/useAuth';

import DropShadow from './tools/DropShadow';
import DevicePosition from './tools/DevicePosition';
import EditText from './tools/EditText';
import Tilt from './tools/Tilt';
import Roundness from './tools/Roundness';
import SnapitWatermark from './tools/SnapitWatermark';
import URLScreenshot from './tools/URLScreenshot';

import {
  cssGradientsDirections,
  gradientDirections,
  wallpapers,
} from 'constants/gradients';

import { mobileDevices as devices } from 'constants/devices';
import Size from './tools/Size';

const defaultOptions = {
  aspectRatio: 'aspect-auto',
  theme: 'from-indigo-400 via-blue-400 to-purple-600',
  bgDirection: 'bg-gradient-to-br',
  wallpaper: '',
  watermark: true,
  customTheme: {
    colorStart: '#d2fefd',
    colorEnd: '#f3b4e1',
  },
  device: 'device device-iphone-x',
  shadow: 'drop-shadow-none',
  position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',

  roundedWrapper: 'rounded-2xl',

  size: 50,

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

  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });

  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  const onPaste = async event => {
    var items =
      (event?.clipboardData || event?.originalEvent?.clipboardData)?.items ||
      event?.target?.files ||
      event?.dataTransfer?.files;
    var index = 0;
    for (index in items) {
      var item = items[index];
      if (item.kind === 'file' || item?.type?.includes('image')) {
        var blob = item?.kind ? item.getAsFile() : item;
        var reader = new FileReader();
        reader.onload = function (event) {
          setBlob({ ...blob, src: event.target.result });
        };
        reader.readAsDataURL(blob);
      }
    }
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

  const resetCanvas = () => {
    setBlob({ src: null, width: 0, height: 0 });
    setOptions(defaultOptions);

    setManualTiltAngle([0, 0]);
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

  const renderPreview = () => (
    <article className='bg-primary bg-opacity-10 h-full p-8 rounded-md flex justify-center'>
      {/* wrapper */}
      <div
        ref={wrapperRef}
        style={
          options.customTheme
            ? {
                background: `linear-gradient(${
                  cssGradientsDirections[options.bgDirection]
                }, ${options?.customTheme?.colorStart || 'transparent'}, ${
                  options?.customTheme?.colorEnd || 'transparent'
                })`,
              }
            : {
                background: options.background
                  ? `url(${options.background})`
                  : '',
              }
        }
        className={classnames(
          `bg-cover h-[600px] w-full relative overflow-hidden transition-all flex p-4 ${
            options.text.position === 'top' ? 'flex-col' : 'flex-col-reverse'
          }`,
          { [options?.theme]: !options.customTheme },
          options.bgDirection,
          options.roundedWrapper,
        )}>
        {/* Text */}

        {options?.text.show && (
          <div
            className={`w-full ${options.text.align} ${
              options.text.position === 'top' ? 'mt-2' : 'mb-2'
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
          className='relative w-full h-[600px]'>
          {/* device */}
          <div
            className={`absolute ${options.position} transform transition-all`}>
            <div
              className={`${options.device} ${options.shadow}`}
              style={{
                transform: `scale(${options.size / 100})`,
              }}>
              <div className='device-frame'>
                <img
                  src={blob.src || '/bg-mobile.jpg'}
                  className='w-full h-full rounded-[calc(68px/1.6)] bg-top pointer-events-none select-none'
                />
              </div>
              <div className='device-stripe'></div>
              <div className='device-header'></div>
              <div className='device-sensors'></div>
              <div className='device-btns'></div>
              <div className='device-power'></div>
              <div className='device-home'></div>
            </div>
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
    <article className='bg-primary bg-opacity-10 rounded-md p-4 overflow-y-auto overflow-x-hidden max-h-[680px] custom-scrollbar'>
      <div className='space-y-4'>
        <h3 className='text-center text-white/90 w-full'>Device Options</h3>

        {/* Add image */}
        <div className='bg-primary font-medium p-2 rounded-md text-darkGreen flex items-center justify-between'>
          <p className='w-[60%] text-sm'>Add Image</p>

          <input
            type='file'
            id='image'
            accept='image/png,image/jpg,image/jpeg'
            className='hidden'
            onChange={onPaste}
          />

          <label
            htmlFor='image'
            className={`cursor-pointer bg-darkGreen w-max p-2 rounded-md text-sm relative ${
              blob.src ? 'bg-opacity-70' : ''
            }`}>
            <PlusIcon className='w-6 h-6 text-white' />

            {/* remove image */}
            {blob.src && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setBlob({ src: null, h: 0, w: 0 });
                }}
                className='absolute -right-1 -top-1 bg-darkGreen shadow-md rounded-full p-0.5 z-10'>
                <XMarkIcon className='h-3 w-3 text-white' />
              </button>
            )}
          </label>
        </div>

        <p className='text-center text-white text-sm'>
          Or add screenshot from website/link.
        </p>

        {/* Get screenshot from url */}
        <URLScreenshot
          proMode={proMode}
          blob={blob}
          setBlob={setBlob}
          target='mobile'
        />

        {/* Device */}
        <div className='grid grid-cols-[3fr,1fr] w-full'>
          <div className='flex items-center space-x-2'>
            <DevicePhoneMobileIcon className='h-6 w-6 text-white/90' />

            <h3 className='text-sm text-white/90'>Device</h3>
          </div>
          <div className='flex justify-around items-center'>
            {/* tip */}
            <div className='relative'>
              <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />

              <div className='absolute top-full text-center left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
                <p className='text-sm text-white'>Sets the device to use.</p>
              </div>
            </div>

            <Popover className='relative justify-self-end'>
              {({ open }) => (
                <>
                  <Popover.Button>
                    <ChevronRightIcon
                      className={`${
                        open ? 'rotate-90 transform' : ''
                      } h-5 w-5 text-white/90`}
                    />
                  </Popover.Button>

                  <Popover.Panel className='absolute z-50 top-full mt-2 -right-[9px]  bg-dark/40 backdrop-blur-md  p-4 rounded-md shadow-md w-72'>
                    <div className='grid grid-cols-2 gap-4'>
                      {/* render preview */}
                      {devices.map((device, i) => {
                        const isActive = options.device === device.value;

                        return (
                          <button
                            className={`relative ${
                              isActive ? 'bg-primary/70' : 'bg-gray-400/50'
                            }  w-full rounded-md p-2`}
                            key={i}
                            onClick={() => {
                              // check if pro mode is enabled
                              const userIsNotPro = !proMode && device.isPro;

                              if (userIsNotPro) {
                                toast.error(
                                  'This device is only available in pro mode.',
                                );
                                return;
                              }

                              setOptions({
                                ...options,
                                device: device.value,
                              });
                            }}>
                            {/* pro badge */}
                            {device.isPro && (
                              <div className='absolute top-0 right-0 bg-green-500 text-white px-2 text-xs rounded-bl-md'>
                                Pro
                              </div>
                            )}

                            {/* device */}
                            <div className='h-32 relative'>
                              <div
                                className={`${device.value} scale-[0.12] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                                <div className='device-frame'>
                                  <img
                                    src={blob.src || '/bg-mobile.jpg'}
                                    className='w-full h-full rounded-[calc(68px/1.6)] bg-top pointer-events-none select-none'
                                  />
                                </div>
                                <div className='device-stripe'></div>
                                <div className='device-header'></div>
                                <div className='device-sensors'></div>
                                <div className='device-btns'></div>
                                <div className='device-power'></div>
                                <div className='device-home'></div>
                              </div>
                            </div>

                            <p className='text-xs mt-2 text-white'>
                              {device.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
        </div>

        {/* Shadow */}
        <DropShadow options={options} setOptions={setOptions} />

        {/* Device position */}
        <DevicePosition options={options} setOptions={setOptions} />

        {/* Edit Text */}
        <EditText options={options} setOptions={setOptions} />

        {/* Device tilt */}
        <Tilt
          proMode={proMode}
          onTiltMove={onTiltMove}
          setManualTiltAngle={setManualTiltAngle}
        />

        {/* Device size */}
        <Size
          options={options}
          setOptions={setOptions}
          label='Device size'
          max='65'
          min='30'
        />

        <h3 className='text-center text-white/90 w-full'>Canvas Options</h3>

        {/* Background */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='w-full'>
                <div className='relative flex items-center justify-between pb-2 text-sm text-white/90 w-full'>
                  <div className='grid grid-cols-[2fr,1fr] w-full'>
                    <div className='flex items-center space-x-2'>
                      <BackgroundIcon className='h-6 w-6 text-white/90' />

                      <h3 className='text-sm text-white/90'>Background</h3>
                    </div>

                    <div className='flex justify-around items-center gap-2'>
                      <div className='relative'>
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            setBGPicker(!bgPicker);
                          }}
                          className='flex items-center px-2 ml-2 rounded-lg cursor-pointer bg-primary hover:bg-green-500 font-medium text-darkGreen'>
                          <span className='w-3 h-3 mr-1'>
                            {ColorPickerIcon}
                          </span>
                          Pick
                        </div>
                      </div>
                      <ChevronRightIcon
                        className={`${
                          open ? 'rotate-90 transform' : ''
                        } h-5 w-5 text-white/90`}
                      />
                    </div>
                    {pickBackground()}
                  </div>
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
                            background: '',
                          });
                        }}
                      />
                    ))}
                  </div>

                  <div className='grid flex-wrap grid-cols-6 mt-2 gap-x-4 gap-y-2'>
                    {wallpapers.map(wallpaper => (
                      <div
                        key={wallpaper.name}
                        className='cursor-pointer shadow dark:shadow-black/20 shadow-gray-500/20 w-8 h-8 rounded-full bg-cover bg-center'
                        style={{
                          backgroundImage: `url(${wallpaper.src})`,
                        }}
                        onClick={() => {
                          setOptions({
                            ...options,
                            background: wallpaper.src,
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
            className='flex items-center justify-center px-4 py-2 text-base bg-primary hover:bg-green-500 font-medium rounded-md text-darkGreen'
            title='Use Ctrl/Cmd + S to save the image'
            onClick={saveImage}>
            <span className='w-6 h-6 mr-2'>{SaveIcon}</span>
            Save
          </button>

          <button
            className='flex items-center justify-center px-4 py-2 text-base bg-primary hover:bg-green-500 font-medium rounded-md text-darkGreen'
            onClick={copyImage}
            title='Use Ctrl/Cmd + C to copy the image'>
            <span className='w-6 h-6 mr-2'>{ClipboardIcon}</span>
            Copy
          </button>
        </div>

        {/* Reset */}
        <div
          onClick={resetCanvas}
          className='flex items-center justify-center w-full mx-auto text-primary cursor-pointer !mt-8'>
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
