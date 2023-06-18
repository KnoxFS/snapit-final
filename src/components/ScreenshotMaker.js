import { useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import toast from 'react-hot-toast';
import classnames from 'classnames';

import { useHotkeys } from 'react-hotkeys-hook';
import {
  ResetIcon,
  SaveIcon,
  ClipboardIcon,
  ColorPickerIcon,
  BackgroundIcon,
  UploadIcon,
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
  ThunderIcon,
} from 'ui/icons';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  PhotoIcon,
  StopIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { Disclosure, RadioGroup, Tab } from '@headlessui/react';

import ReactTilt from 'react-parallax-tilt';

// utils
import getTabFrame from 'utils/getTabFrame';
import getImageRadius from 'utils/getImageRadius';
import bufferToBase64 from 'utils/bufferToBase64';
import cropImage from 'utils/cropImage';

import updateStats from 'utils/updateStats';

import useAuth from 'hooks/useAuth';

import useWindowSize from 'hooks/useWindowSize';

import Confetti from 'react-confetti';
import { supabase } from 'lib/supabase';

// Tools
import AspectRatio from './tools/AspectRatio';
import BrowserFrame from './tools/BrowserFrame';
import EditText from './tools/EditText';
import Padding from './tools/Padding';
import Shadow from './tools/Shadow';
import Roundness from './tools/Roundness';
import Tilt from './tools/Tilt';
import ScreenshotPosition from './tools/ScreenshotPosition';
import CustomWatermark from './tools/CustomWatermark';
import Noise from './tools/Noise';
import SnapitWatermark from './tools/SnapitWatermark';

import CropModal from 'components/CropModal';

import {
  cssGradientsDirections,
  gradientDirections,
  wallpapers,
} from 'constants/gradients';

const isValidHexColor = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';

const whitelist = ['toon', 'silver', 'silver_black', 'hidden'];

const defaultOptions = {
  aspectRatio: 'aspect-auto !scale-100',
  theme: 'from-green-300 via-yellow-200 to-green-200',
  bgDirection: 'bg-gradient-to-br',
  background: '',
  customTheme: {
    colorStart: '#d2fefd',
    colorEnd: '#f3b4e1',
  },
  padding: 'p-10',
  rounded: 'rounded-xl',
  roundedWrapper: 'rounded-xl',
  shadow: 'drop-shadow-xl',
  noise: false,
  browserBar: 'mac_dark',
  position: '',
  watermark: true,
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

  // custom watermark
  customWatermark: {
    text: '',
    link: 'yourwebsite.com',
    twitter: '',
    linkedin: '',
    youtube: '',
    instagram: '',
    github: '',

    show: false,
    color: 'bg-gray-500/20 text-dark',
    position: 'bottom-5',
  },
};

export default function ScreenshotMaker({ proMode }) {
  const { user, getUser, setShowBuyPro } = useAuth();

  const wrapperRef = useRef();

  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [websiteUrl, setWebsiteUrl] = useState('');
  const [fetchingWebsite, setFetchingWebsite] = useState(false);

  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  const [optionsOpen, setOptionsOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  // crop
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();

  const [completedCrop, setCompletedCrop] = useState();

  const { width, height } = useWindowSize();

  // shortcuts
  useHotkeys(
    'ctrl+shift+c',
    e => {
      e.preventDefault();
      copyImage();
    },
    [blob.src],
  );

  useHotkeys(
    'ctrl+shift+s',
    e => {
      e.preventDefault();
      saveImage();
    },
    [blob.src],
  );

  useHotkeys(
    'ctrl+shift+v',
    e => {
      onPaste(e);
    },
    [blob.src],
  );

  const onTiltMove = stick => {
    setManualTiltAngle([stick.y ? stick.y / 2 : 0, stick.x ? stick.x / 2 : 0]);
  };

  const handleCropImage = () => {
    setShowCropModal(true);
  };

  const saveCrop = crop => {
    const image = new Image();
    image.src = blob.src;

    image.onload = async () => {
      // assign scaled width and height to image object
      image.width = blob.w;
      image.height = blob.h;

      const res = await cropImage(image, crop);
      const url = URL.createObjectURL(res);

      setBlob({ src: url, w: image.naturalWidth, h: image.naturalHeight });
      setCrop(null);
      setShowCropModal(false);
    };
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

  // export image
  const saveImage = async () => {
    if (!blob?.src) {
      toast.error('Nothing to save, make sure to add a screenshot first!');
      return;
    }
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
            toast.success('Image exported!', { id: savingToast });

            if (window.pirsch) {
              pirsch('🎉 Screenshot saved');
            }

            setShowConfetti(true);

            if (user) {
              // update stats
              updateStats(user.id, 'Screenshot_Saved');
            }

            setTimeout(() => {
              setShowConfetti(false);
            }, 2000);
          });
      });
  };

  // copy image to clipboard
  const copyImage = () => {
    if (!blob?.src) {
      toast.error('Nothing to copy, make sure to add a screenshot first!');
      return;
    }
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
          toast.success('Image copied to clipboard');

          if (window.pirsch) {
            pirsch('🙌 Screenshot copied');
          }

          if (user) {
            // update stats
            updateStats(user.id, 'Screenshot_Copied');
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
                toast.success('Image copied to clipboard');

                if (window.pirsch) {
                  pirsch('🙌 Screenshot copied');
                }

                if (user) {
                  // update stats
                  updateStats(user.id, 'Screenshot_Copied');
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

  // save options as preset
  const savePreset = async () => {
    if (!presetName) {
      toast.error('Please enter a name for your preset');
      return;
    }

    const toastId = toast.loading('Saving preset...');
    // get current presets from db
    const { data } = await supabase
      .from('users')
      .select('presets')
      .eq('user_id', user.id)
      .single();

    const preset = {
      options,
      tilt: [manualTiltAngleX, manualTiltAngleY],
      name: presetName,
    };

    const { error } = await supabase
      .from('users')
      .update({
        presets: {
          ...data.presets,
          screenshots: [...data.presets.screenshots, preset],
        },
      })
      .eq('user_id', user.id);

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });
    }

    toast.success('Preset saved!', {
      id: toastId,
    });

    // cleanup
    setPresetName('');
    setShowPresetModal(false);

    // refresh data
    await getUser();
  };

  const handleSavePreset = async () => {
    if (showPresetModal) {
      await savePreset();
    } else {
      setShowPresetModal(true);
    }
  };

  const setPreset = options => {
    // set preset options
    setOptions(options);

    // set options tab
    setActiveTabIndex(0);

    toast.success('Preset loaded!');
  };

  const handleDeletePreset = async presetName => {
    const toastId = toast.loading('Deleting preset...');

    // get current presets from db
    const { data } = await supabase
      .from('users')
      .select('presets')
      .eq('user_id', user.id)
      .single();

    const filteredPresets = data.presets.screenshots.filter(
      p => p.name !== presetName,
    );

    const { error } = await supabase
      .from('users')
      .update({ presets: { ...data.presets, screenshots: filteredPresets } })
      .eq('user_id', user.id);

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });
    }

    toast.success('Preset deleted!', {
      id: toastId,
    });

    // refresh data
    await getUser();
  };

  const setDemoImage = () => {
    setBlob({
      src: '/demo.png',
      w: 1920,
      h: 1080,
    });
  };

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

  const getWebsiteScreenshot = async () => {
    if (!proMode) {
      toast.error('This feature is only available in pro mode');
      return;
    }

    // valid url with http or https
    if (!websiteUrl.match(/^(http|https):\/\//)) {
      toast.error('Please enter a valid url (https://example.com).');
      return;
    }

    if (websiteUrl.length > 0) {
      let toastId = toast.loading('Getting website screenshot...');
      setFetchingWebsite(true);

      const res = await fetch(
        `/api/getScreenshot?url=${encodeURIComponent(websiteUrl)}`,
      );
      const { image, error } = await res.json();

      if (error) {
        toast.error(error, { id: toastId });
        setFetchingWebsite(false);

        return;
      }

      const finalImage = bufferToBase64(image.data);

      setBlob({ ...blob, src: `data:image/png;base64,${finalImage}` });

      toast.success('Website screenshot loaded!', { id: toastId });
      setFetchingWebsite(false);

      if (window.pirsch) {
        pirsch('🙌 Screenshot gotten from URL');
      }

      return;
    }

    toast.error('No url provided.');
    return;
  };

  const resetCanvas = () => {
    setBlob({ src: null, width: 0, height: 0 });
    setOptions(defaultOptions);

    setManualTiltAngle([0, 0]);
    setWebsiteUrl('');
  };

  const pickBackground = () => {
    return (
      <>
        {bgPicker ? (
          <div
            className='fixed inset-0 h-full w-full bg-transparent'
            onClick={() => setBGPicker(false)}
          />
        ) : (
          ''
        )}
        <div
          className={classnames(
            'absolute top-[calc(100%)] left-[-30px] z-10 flex w-auto max-w-[400px] flex-col rounded-xl border border-gray-400 bg-white/80 py-4 px-5 shadow-lg shadow-gray-500/50 backdrop-blur duration-200 dark:border-gray-800 dark:bg-black/80 dark:shadow-black/80',
            {
              'pointer-events-none scale-[0.9] opacity-0': !bgPicker,
            },
            {
              'pointer-events-auto scale-[1] opacity-100': bgPicker,
            },
          )}>
          <div
            className='absolute top-[5%] right-[5%] z-10 cursor-pointer opacity-50 hover:opacity-100'
            onClick={() => setBGPicker(false)}>
            ✕
          </div>
          <div className='relative mb-3'>
            {/* Pick Start Color */}
            <div className='mb-1'>Pick first color</div>
            <div className='flex items-center'>
              <div className='group relative'>
                <input
                  id='startColorPicker'
                  type='color'
                  className='absolute top-0 left-0 h-12 w-12 cursor-pointer rounded-full opacity-0'
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
                  className='pointer-events-none left-0 flex h-12 w-12 items-center justify-center rounded-full text-white/50 duration-100 group-hover:scale-[1.1]'>
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
                className='rounded-lg border-2 border-gray-500 px-2 py-1 font-mono text-base text-black focus:border-black focus:outline-none'
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
              <div className='group relative'>
                <input
                  id='startColorPicker'
                  type='color'
                  className='absolute top-0 left-0 h-12 w-12 cursor-pointer rounded-full opacity-0'
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
                  className='pointer-events-none left-0 flex h-12 w-12  items-center justify-center rounded-full text-white/50 duration-100 group-hover:scale-[1.1]'>
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
                className='rounded-lg border-2 border-gray-500 px-2 py-1 font-mono text-base text-black focus:border-black focus:outline-none'
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

  const renderOptions = () => {
    return (
      <Tab.Group
        as='div'
        className='relative rounded-lg'
        selectedIndex={activeTabIndex}
        onChange={setActiveTabIndex}>
        {/* Minimize button
        <div
          className="absolute hidden px-1 py-6 -translate-x-1/2 cursor-pointer md:block top-1/2 -right-9 rounded-r-2xl bg-primary"
          onClick={() => setOptionsOpen(false)}
        >
          <ChevronLeftIcon className="w-4 h-4 text-white" />
        </div> */}

        {/* tabs */}

        <Tab.List className='absolute top-1/2 -left-[122px] flex w-52 -rotate-90 cursor-pointer flex-row-reverse justify-between overflow-auto rounded-t-xl bg-primary bg-opacity-5 text-sm text-darkGreen dark:bg-primary dark:bg-opacity-20 dark:text-white'>
          <Tab
            as='button'
            className='w-full px-4 py-2 font-light outline-none ui-selected:bg-primary dark:ui-selected:bg-opacity-60'>
            Options
          </Tab>
          <Tab
            as='button'
            className='w-full px-4 py-2 font-light outline-none ui-selected:bg-primary ui-selected:bg-opacity-60'>
            Presets
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* options */}
          <Tab.Panel>
            <div className='custom-scrollbar relative mt-10 h-auto w-full overflow-y-scroll rounded-md bg-primary bg-opacity-10 p-6 dark:bg-opacity-20 md:max-h-[550px] lg:mt-0 lg:p-8'>
              <div className='relative flex flex-row flex-wrap items-start justify-start space-y-5 lg:flex-col lg:items-start'>
                <h3 className='text-light w-full text-center text-sm text-darkGreen dark:text-white'>
                  Screenshot Options
                </h3>

                {/* Aspect Ratio */}
                <AspectRatio options={options} setOptions={setOptions} />

                {/* Browser frame */}
                <BrowserFrame
                  options={options}
                  setOptions={setOptions}
                  whitelist={whitelist}
                />

                {/* Padding */}
                <Padding options={options} setOptions={setOptions} />

                {/* Shadow */}
                <Shadow options={options} setOptions={setOptions} />

                {/* Roundness */}
                <Roundness
                  options={options}
                  setOptions={setOptions}
                  target='screenshot'
                />

                {/* Screenshot tilt */}
                <Tilt
                  proMode={proMode}
                  onTiltMove={onTiltMove}
                  setManualTiltAngle={setManualTiltAngle}
                />

                {/* canvas opts */}

                <h3 className='w-full text-center text-sm text-darkGreen dark:text-white'>
                  Canvas Options
                </h3>

                {/* Background */}
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className='w-full'>
                        <div className='relative flex w-full items-center justify-between pb-2 text-sm text-gray-400'>
                          <div className='flex items-center'>
                            <div className='flex items-center space-x-2'>
                              <BackgroundIcon className='h-6 w-6 text-darkGreen dark:text-white' />

                              <h3 className='text-sm text-darkGreen dark:text-white'>
                                Background
                              </h3>
                            </div>

                            {pickBackground()}
                          </div>
                          <div className='relative'>
                            <div
                              onClick={e => {
                                e.stopPropagation();
                                setBGPicker(!bgPicker);
                              }}
                              className='flex cursor-pointer items-center rounded-sm px-2'>
                              <ChevronRightIcon
                                className={`${
                                  open ? 'rotate-90 transform' : ''
                                } h-5 w-5 justify-self-end text-darkGreen dark:text-white`}
                              />
                            </div>
                          </div>
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel className='scrollbar-none w-full overflow-x-scroll'>
                        <div>
                          <div className='mt-1 grid grid-cols-6 flex-wrap gap-x-4 gap-y-2'>
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
                                className={`h-8 w-8 cursor-pointer rounded-full shadow shadow-gray-500/20 dark:shadow-black/20 ${theme}`}
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

                          <div className='mt-2 grid grid-cols-6 flex-wrap gap-x-4 gap-y-2'>
                            {wallpapers.map(wallpaper => (
                              <div
                                key={wallpaper.name}
                                className='h-8 w-8 cursor-pointer rounded-full bg-cover bg-center shadow shadow-gray-500/20 dark:shadow-black/20'
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
                            className='mt-4 flex items-center space-x-2'
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
                                className='cursor-pointer rounded-md border p-1 ui-checked:border-green-400'>
                                <span>{gd.icon}</span>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                {/* Edit Text */}
                <EditText options={options} setOptions={setOptions} />

                {/* Roundness */}
                <Roundness
                  options={options}
                  setOptions={setOptions}
                  target='wrapper'
                />

                {/* Position */}
                <ScreenshotPosition options={options} setOptions={setOptions} />

                {/* Custom watermark */}
                <CustomWatermark options={options} setOptions={setOptions} />

                {/* Noise */}
                <Noise options={options} setOptions={setOptions} />

                {/* Snapit Watermark */}
                <SnapitWatermark
                  options={options}
                  setOptions={setOptions}
                  proMode={proMode}
                />

                {/* Reset */}
                <div
                  onClick={resetCanvas}
                  className='mx-auto !mt-8 flex w-full cursor-pointer items-center justify-center text-darkGreen dark:text-green-400'>
                  <span className='mr-1 h-4 w-4'>{ResetIcon}</span>
                  Reset
                </div>
                {/* Pro plan tooltip */}
                {!proMode && (
                  <div className='mb-4 flex flex-1 flex-col items-center justify-between rounded-md bg-primary p-4 text-center text-darkGreen md:w-full md:flex-row md:text-left'>
                    <p className='w-full text-xs md:w-[60%]'>
                      Premium features are avaiable in PRO Account
                    </p>

                    <button
                      onClick={() => setShowBuyPro(true)}
                      className='mt-4 w-max rounded-sm bg-darkGreen p-2 text-xs text-primary transition md:mt-0'>
                      Get Snapit Pro
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>

          {/* presets */}
          <Tab.Panel>
            <div className='custom-scrollbar min-h-[550px] w-full overflow-y-scroll rounded-md bg-primary bg-opacity-10 p-8 dark:bg-opacity-20'>
              {!proMode && (
                <div className='text-center text-darkGreen dark:text-white'>
                  <h3>
                    Save time applying customizations with Presets. You can save
                    your customizations and apply them later with just
                    one-click.
                  </h3>

                  <button
                    onClick={() => setShowBuyPro(true)}
                    className='mt-6 w-full rounded-md bg-primary p-2 text-darkGreen transition hover:bg-green-500'>
                    Get Snapit Pro
                  </button>
                </div>
              )}
              {proMode && (
                <article className='space-y-4'>
                  <h3 className='w-full text-center text-gray-500'>Presets</h3>

                  {user?.presets?.screenshots?.length === 0 && (
                    <div className='mt-6 text-center text-gray-400'>
                      <h3>
                        You don't have any presets yet. Create one by clicking
                        the "Save as Preset" button.
                      </h3>
                    </div>
                  )}

                  {user?.presets?.screenshots?.map((preset, i) => (
                    <div className='flex items-center space-x-2' key={i}>
                      <button
                        key={preset.id}
                        className='flex w-full items-center justify-between rounded-md bg-dark/40 p-2 transition hover:bg-dark/80'
                        onClick={() => setPreset(preset.options)}>
                        <p className='text-sm text-gray-400'>{preset.name}</p>
                      </button>

                      <button
                        onClick={async () =>
                          await handleDeletePreset(preset.name)
                        }>
                        <TrashIcon className='h-5 w-5 text-gray-500' />
                      </button>
                    </div>
                  ))}
                </article>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    );
  };

  const optionsPlaceholder = () => {
    return (
      <div className='relative h-full min-h-[550px] w-6 rounded-md bg-[#2B2C2F]'>
        {/* Minimize button */}
        <div
          className='absolute top-1/2 -right-9 -translate-x-1/2 cursor-pointer rounded-r-2xl bg-[#2B2C2F] py-6 px-1'
          onClick={() => setOptionsOpen(true)}>
          <ChevronLeftIcon className='h-4 w-4 rotate-180 text-white' />
        </div>
      </div>
    );
  };

  return (
    <div
      id='screenshots'
      className='relative mt-[50px] h-auto w-full rounded-md bg-primary bg-opacity-5 p-4 dark:bg-opacity-10 md:p-10 '
      onPaste={onPaste}
      onDragOver={e => e.preventDefault()}
      onDragEnter={e => e.preventDefault()}
      onDragLeave={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        onPaste(e);
      }}>
      <Confetti
        className='oveflow-hidden !fixed !inset-0 !z-50 !w-full'
        width={width}
        height={height}
        numberOfPieces={showConfetti ? 200 : 0}
        onConfettiComplete={confetti => {
          confetti.reset();
          setShowConfetti(false);
        }}
        recycle={false}
      />

      {/* Handle buttons */}
      <div className='mb-6 w-full items-center justify-end space-y-4 md:flex md:space-y-0 md:space-x-6 [&>*]:w-full md:[&>*]:w-max'>
        {showPresetModal && user?.isPro && (
          <input
            type='text'
            placeholder="Preset's name"
            className='rounded-md bg-[#212121] py-2 px-4 text-white outline-none ring-1 ring-transparent focus:ring-green-400'
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
          />
        )}

        {user && user.isPro && (
          <button
            className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen'
            onClick={handleSavePreset}>
            <span className='mr-2 h-6 w-6'>{SaveIcon}</span>
            Create Preset
          </button>
        )}

        {blob?.src && (
          <label className='flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen'>
            <span className='mr-2 h-6 w-6'>
              <PhotoIcon />
            </span>
            Replace Image
            <input
              type='file'
              className='hidden'
              onChange={onPaste}
              accept='image/png,image/jpg,image/jpeg'
            />
          </label>
        )}

        {!blob?.src && (
          <button
            className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen transition hover:bg-green-500'
            onClick={setDemoImage}>
            <span className='mr-2 h-6 w-6'>
              <PhotoIcon />
            </span>
            Try demo image
          </button>
        )}

        {blob?.src && (
          <button
            className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen transition hover:bg-green-500'
            onClick={handleCropImage}>
            <span className='mr-2 h-6 w-6'>
              <StopIcon />
            </span>
            Crop
          </button>
        )}

        <button
          className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen transition hover:bg-green-500'
          title='Use Ctrl/Cmd + S to save the image'
          onClick={saveImage}>
          <span className='mr-2 h-6 w-6'>{SaveIcon}</span>
          Save
        </button>

        <button
          className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-darkGreen transition hover:bg-green-500'
          onClick={copyImage}
          title='Use Ctrl/Cmd + C to copy the image'>
          <span className='mr-2 h-6 w-6'>{ClipboardIcon}</span>
          Copy
        </button>
      </div>

      <div
        className={`relative grid grid-cols-1 place-items-start ${
          optionsOpen ? 'md:grid-cols-[360px,1fr]' : 'md:grid-cols-[50px,1fr]'
        } mx-auto w-full gap-10`}>
        {optionsOpen ? (
          <div className='row-start-1 mt-6 w-full self-start md:row-span-1'>
            {renderOptions()}
            {!proMode && (
              <p className='mt-6 inline-flex w-full justify-center gap-2 text-center text-sm text-darkGreen dark:text-white md:mb-0 md:px-4'>
                Features with{' '}
                <span>
                  <ThunderIcon />
                </span>{' '}
                are only available for pro version.
              </p>
            )}
          </div>
        ) : (
          <div className='row-start-2 w-full md:row-span-1'>
            {optionsPlaceholder()}
          </div>
        )}

        <div className='flex w-full items-center'>
          {/* Crop Modal */}
          {showCropModal && (
            <CropModal
              open={showCropModal}
              setOpen={setShowCropModal}
              crop={crop}
              setCrop={setCrop}
              saveCrop={saveCrop}
              completedCrop={completedCrop}
              setCompletedCrop={setCompletedCrop}
              blob={blob}
              setBlob={setBlob}
            />
          )}

          <div
            className={`relative my-5 flex w-full items-center justify-center overflow-hidden duration-200 ease-in-out`}>
            <div
              ref={el => (wrapperRef.current = el)}
              style={
                options.customTheme
                  ? {
                      background: `linear-gradient(${
                        cssGradientsDirections[options.bgDirection]
                      }, ${
                        options?.customTheme?.colorStart || 'transparent'
                      }, ${options?.customTheme?.colorEnd || 'transparent'})`,
                    }
                  : {
                      background: options.background
                        ? `url(${options.background})`
                        : '',
                    }
              }
              className={classnames(
                `relative overflow-hidden bg-cover transition-all duration-200 ease-in-out ${
                  options.aspectRatio === 'aspect-appstore !scale-75'
                    ? 'h-[7.0in] w-[5in]'
                    : 'w-full'
                }`,
                options?.padding,
                options?.position,
                options?.roundedWrapper,
                { [options?.theme]: !options.customTheme },

                options?.bgDirection,
              )}>
              {/* noise */}
              {options?.noise ? (
                <div
                  style={{ backgroundImage: `url("/noise.svg")` }}
                  className={`absolute inset-0 h-full w-full bg-repeat opacity-[0.25] ${
                    options?.rounded
                  } ${options.browserBar !== 'hidden' ? 'rounded-t-none' : ''}`}
                />
              ) : (
                ''
              )}

              {blob?.src ? (
                <div
                  className={`flex h-full ${
                    options.text.position === 'top'
                      ? 'flex-col'
                      : 'flex-col-reverse'
                  }  items-center justify-center`}>
                  {/* Text */}

                  {options?.text.show && (
                    <div
                      className={`w-full ${options.text.align} ${
                        options.text.position === 'top' ? 'mb-6' : 'mt-6'
                      } ${
                        options.text.color === 'dark'
                          ? 'text-black'
                          : 'text-white'
                      }`}>
                      <p className='break-word mb-2 whitespace-pre-wrap text-3xl font-bold'>
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
                    className={`relative`}>
                    <div
                      className={`flex flex-col items-center justify-center ${options.aspectRatio} transition`}>
                      {getTabFrame(options?.browserBar, options?.rounded)}
                      <img
                        src={blob?.src}
                        className={`relative z-10 max-w-full select-none bg-cover transition-all duration-200 ease-in-out ${
                          options?.rounded
                        } ${options.shadow} ${getImageRadius(
                          options?.padding,
                          options?.position,
                        )} ${
                          whitelist.includes(options?.browserBar)
                            ? ''
                            : 'rounded-t-none'
                        }`}
                      />
                    </div>
                  </ReactTilt>
                </div>
              ) : (
                <div className='flex min-h-[50vh] w-full items-center justify-center'>
                  <div className='overflow-hidden rounded-md bg-white shadow-md dark:bg-darkGreen'>
                    <label
                      className='flex max-w-[550px] cursor-pointer select-none flex-col items-center justify-center rounded-xl p-10 text-center text-sm text-darkGreen duration-300 hover:opacity-50 dark:text-white md:text-lg'
                      htmlFor='imagesUpload'>
                      <input
                        className='hidden'
                        id='imagesUpload'
                        type='file'
                        onChange={onPaste}
                      />
                      <span className='mb-2 px-3 py-1 '>
                        <UploadIcon className='text-darkGreen dark:text-white' />
                      </span>
                      <p>Upload a Screenshot</p>
                    </label>

                    {/* website url request */}
                    <div className='mt-4 bg-primary bg-opacity-10 p-6 text-center text-darkGreen dark:bg-[#004D3E] dark:text-white'>
                      <p className='text-base font-light'>Or</p>
                      <h4 className='text-base font-light'>
                        Add a screenshot from website/link
                      </h4>

                      <input
                        type='text'
                        placeholder='https://example.com'
                        className='my-4 w-full rounded-sm bg-primary bg-opacity-30 p-2 text-center text-sm text-darkGreen placeholder-darkGreen dark:bg-darkGreen dark:text-white dark:placeholder-white md:text-base'
                        value={websiteUrl}
                        onChange={e => setWebsiteUrl(e.target.value)}
                        onKeyUp={e => {
                          if (e.key === 'Enter') {
                            getWebsiteScreenshot();
                          }
                        }}
                      />

                      <button
                        className='mt-5 rounded-sm bg-primary p-2 text-xs font-semibold text-darkGreen transition hover:bg-green-500 disabled:opacity-80'
                        disabled={fetchingWebsite}
                        onClick={getWebsiteScreenshot}>
                        Capture website screenshot
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* custom watermark */}
              {options?.customWatermark.show && blob?.src && (
                <div
                  className={`absolute ${options.customWatermark.position} left-1/2 z-50 -translate-x-1/2 ${options.customWatermark.color} flex items-center space-x-2 rounded-md py-1 px-2 text-xs`}>
                  {options?.customWatermark.text && (
                    <p>{options.customWatermark?.text}</p>
                  )}

                  {/* link */}
                  {options?.customWatermark?.link && (
                    <p className='flex items-center'>
                      <LinkIcon className='mr-1 h-3 w-3' />
                      {options?.customWatermark?.link}
                    </p>
                  )}

                  {options.customWatermark.twitter && (
                    <p className='flex items-center'>
                      <TwitterIcon className='mr-1 h-3 w-3' />
                      {options.customWatermark?.twitter}
                    </p>
                  )}

                  {/* instagram */}
                  {options.customWatermark.instagram && (
                    <p className='flex items-center'>
                      <InstagramIcon className='mr-1 h-3 w-3' />
                      {options.customWatermark?.instagram}
                    </p>
                  )}

                  {/* github */}
                  {options.customWatermark.github && (
                    <p className='flex items-center'>
                      <GitHubIcon className='mr-1 h-3 w-3' />
                      {options.customWatermark?.github}
                    </p>
                  )}

                  {/* linkedin */}
                  {options.customWatermark.linkedin && (
                    <p className='flex items-center'>
                      <LinkedInIcon className='mr-1 h-3 w-3' />
                      {options.customWatermark?.linkedin}
                    </p>
                  )}
                </div>
              )}

              {/* watermark */}
              {options?.watermark && blob?.src && (
                <div className='absolute bottom-0 right-12 select-none rounded-t-md bg-green-500 p-1 px-2 text-xs text-white'>
                  Made with snapit.gg
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
