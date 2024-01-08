import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import classnames from 'classnames';

import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';

import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';
import { parser as solidity } from '@replit/codemirror-lang-solidity';
import { themes, themesBG, extensions } from 'constants/code';

import ReactTilt from 'react-parallax-tilt';
import { Disclosure, RadioGroup, Tab, Popover } from '@headlessui/react';

import { supabase } from 'lib/supabase';

import {
  Bars3Icon,
  BarsArrowUpIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  ColorPickerIcon,
  SaveIcon,
  ClipboardIcon,
  BackgroundIcon,
  ResetIcon,
} from 'ui/icons';

import updateStats from 'utils/updateStats';
import getCodeFrame from 'utils/getCodeFrame';

import useAuth from 'hooks/useAuth';
import useDrag from 'hooks/useDrag';

import Shadow from './tools/Shadow';
import Tilt from './tools/Tilt';
import EditText from './tools/EditText';
import Roundness from './tools/Roundness';
import SnapitWatermark from './tools/SnapitWatermark';
import CodeFrame from './tools/CodeFrame';
import Editor from './tools/Editor';

import {
  cssGradientsDirections,
  gradientDirections,
} from 'constants/gradients';

const DEFAULT_CODE = `import { useState } from 'react'

export default const Home = () => {
  const [counter, setCounter] = useState(0)

  return (
    <button onClick={() => setCounter(counter + 1)}>
      {counter} 
     </button>
  )  
}`;

const defaultOptions = {
  language: 'jsx',
  aspectRatio: 'aspect-auto',
  theme: 'from-indigo-400 via-blue-400 to-purple-600',
  bgDirection: 'bg-gradient-to-br',
  watermark: true,
  customTheme: {
    colorStart: '#d2fefd',
    colorEnd: '#f3b4e1',
  },
  device: 'device device-macbook-pro',
  shadow: 'drop-shadow-none',
  position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',

  roundedWrapper: 'rounded-2xl',
  fontSize: 'text-base',

  editorTheme: 'Github Dark',
  frame: 'mac',
  size: 100,

  // text
  text: {
    heading: 'Made with Screenshots4all.com',
    subheading: 'The best screenshot maker',
    show: false,
    color: 'dark',
    size: 'text-2xl',
    position: 'top',
    align: 'text-center',
  },
};

const TemplateMaker = ({ proMode }) => {
  const { user, getUser } = useAuth();

  const wrapperRef = useRef();
  const fontSizeRef = useRef();

  const editorRef = useRef();

  const { dragStart, dragStop, dragMove } = useDrag();

  // editor tabs
  const [tabs, setTabs] = useState([
    { file: 'App', initialContent: DEFAULT_CODE, language: 'jsx' },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [newTabName, setNewTabName] = useState('');

  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
    language: tabs[activeTab].language,
  });

  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  // listen to changes in the active tab and language selector to update the language
  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      language: tabs[activeTab].language,
    }));
  }, [activeTab, tabs]);

  const handleAddTab = () => {
    setTabs(prev => [
      ...prev,
      { file: newTabName, initialContent: '', language: 'jsx' },
    ]);

    setActiveTab(tabs.length);
    setNewTabName('');
  };

  const setPreset = options => {
    // set preset options
    setOptions(options);
    toast.success('Preset loaded!');
  };

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
          code: [...data.presets.code, preset],
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

  const handleDeletePreset = async presetName => {
    const toastId = toast.loading('Deleting preset...');

    // get current presets from db
    const { data } = await supabase
      .from('users')
      .select('presets')
      .eq('user_id', user.id)
      .single();

    const filteredPresets = data.presets.code.filter(
      p => p.name !== presetName,
    );

    const { error } = await supabase
      .from('users')
      .update({ presets: { ...data.presets, code: filteredPresets } })
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
                className='px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:border-black focus:outline-none'
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
                className='px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:border-black focus:outline-none'
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
    <article className='flex justify-center h-full p-8 rounded-md bg-primary bg-opacity-20 dark:bg-opacity-10'>
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
        }  relative flex w-full overflow-hidden px-4 py-8 transition-all ${
          options.text.position === 'top' ? 'flex-col' : 'flex-col-reverse'
        } items-center justify-center`}>
        {/* Text */}

        {options?.text.show && (
          <div
            className={`w-full ${options.text.align} ${
              options.text.position === 'top' ? 'mb-6' : 'mt-6'
            } ${options.text.color === 'dark' ? 'text-black' : 'text-white'}`}>
            <p className='mb-2 text-3xl font-bold whitespace-pre-wrap break-word'>
              {options.text.heading}
            </p>
            <p className='whitespace-pre-wrap break-word'>
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
          className='flex w-[90%] items-center justify-center'>
          {/* editor */}
          <div
            style={{
              background: themesBG[options.editorTheme],
              transform: `scale(${options.size / 100})`,
            }}
            className={`min-h-[250px] w-[90%] p-4 ${options.roundedWrapper} ${options.shadow}`}>
            {/* Header */}
            <header className='flex items-center mb-4'>
              {/* dots */}
              {getCodeFrame(options.frame, options.editorTheme)}

              {/* tabs */}
              <div className='flex items-center mx-4 space-x-2 text-gray-500 custom-scrollbar-sm'>
                {tabs.map((tab, index) => {
                  const isActive = index === activeTab;

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`relative rounded-md p-2 text-xs text-gray-300 ${
                        isActive ? 'bg-[#333d43]' : 'text-gray-300'
                      }`}>
                      <p>
                        {tab.file}
                        {extensions[tab.language]}
                      </p>

                      {/* delete */}
                      {isActive && index !== 0 && (
                        <span
                          onClick={e => {
                            e.stopPropagation();

                            setActiveTab(index - 1);

                            setTabs(prev => {
                              const newTabs = [...prev];
                              newTabs.splice(index, 1);
                              return newTabs;
                            });
                          }}
                          className='absolute -top-0 -right-1 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-red-500 text-[10px] text-white'>
                          x
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* add tab */}
                <Popover className='relative'>
                  <Popover.Button className='p-2 text-sm font-medium text-gray-800 rounded-md'>
                    <PlusIcon className='w-5 text-gray-500' />
                  </Popover.Button>

                  <Popover.Panel>
                    <div className='absolute -top-10 left-0 z-10 rounded-md bg-[#212121] py-2 px-4 shadow-lg'>
                      <input
                        type='text'
                        className='bg-[#212121] text-xs outline-none'
                        placeholder='File name...'
                        value={newTabName}
                        onChange={e => setNewTabName(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            handleAddTab();
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  </Popover.Panel>
                </Popover>
              </div>
            </header>
            <CodeMirror
              ref={editorRef}
              className={`outline-none ${options.fontSize} !min-h-[250px] w-full !overflow-hidden !bg-transparent`}
              basicSetup={{
                lineNumbers: false,
                autocompletion: false,
                defaultKeymap: false,
                foldGutter: false,
                highlightActiveLine: false,
                history: true,
              }}
              theme={themes[options.editorTheme]}
              extensions={
                options.language === 'solidity'
                  ? [StreamLanguage.define(solidity)]
                  : [loadLanguage(options.language)]
              }
              value={tabs[activeTab].initialContent}
              onChange={value => {
                const newTabs = [...tabs];
                newTabs[activeTab].initialContent = value;

                setTabs(newTabs);
              }}
              placeholder='Start typing...'
            />
          </div>
        </ReactTilt>

        {/* watermark */}
        {options?.watermark && (
          <div className='absolute bottom-0 p-1 px-2 text-xs translate-x-1/2 select-none right-1/2 rounded-t-md bg-primary text-darkGreen'>
            Made with Screenshots4all.com
          </div>
        )}
      </div>
    </article>
  );

  const renderOptions = () => (
    <Tab.Group as='div' id='tabs' className='relative'>
      {/* tabs */}

      <Tab.List className='absolute top-1/2 -right-[117px] flex w-52 rotate-90 cursor-pointer flex-row justify-between rounded-t-xl bg-primary bg-opacity-20 px-6 py-1 text-sm text-darkGreen dark:bg-opacity-10 dark:text-white'>
        <Tab
          as='button'
          className='px-2 rounded-md outline-none ui-selected:bg-green-500 ui-not-selected:bg-transparent'>
          Options
        </Tab>
        <Tab
          as='button'
          className='px-2 rounded-md outline-none ui-selected:bg-green-500 ui-not-selected:bg-transparent'>
          Presets
        </Tab>
      </Tab.List>

      <Tab.Panels>
        {/* options */}
        <Tab.Panel>
          <article className='custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-primary bg-opacity-20 p-4 dark:bg-opacity-10'>
            <div className='space-y-4'>
              <h3 className='w-full text-center text-darkGreen dark:text-white'>
                Editor Options
              </h3>

              {/* Lang */}
              <div className='grid w-full grid-cols-2'>
                <div className='flex items-center space-x-2'>
                  <CodeBracketIcon className='w-6 h-6 text-darkGreen dark:text-white' />

                  <h3 className='text-sm text-darkGreen dark:text-white'>
                    Language
                  </h3>
                </div>

                <select
                  value={tabs[activeTab].language}
                  onChange={e =>
                    // use code tabs language
                    setTabs(prev => {
                      const newTabs = [...prev];
                      newTabs[activeTab].language = e.target.value;
                      return newTabs;
                    })
                  }
                  className='p-2 text-sm font-semibold rounded-md outline-none cursor-pointer custom-scrollbar-sm bg-primary text-dark'>
                  {langNames.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}

                  <option value='solidity'>Solidity</option>
                </select>
              </div>

              {/* Theme */}
              <div className='grid w-full grid-cols-2'>
                <div className='flex items-center space-x-2'>
                  <Bars3Icon className='w-6 h-6 text-darkGreen dark:text-white' />

                  <h3 className='text-sm text-darkGreen dark:text-white'>
                    Theme
                  </h3>
                </div>

                <select
                  value={options.editorTheme}
                  onChange={e =>
                    setOptions({ ...options, editorTheme: e.target.value })
                  }
                  className='p-2 text-sm font-semibold rounded-md outline-none cursor-pointer custom-scrollbar-sm bg-primary text-dark'>
                  {Object.keys(themes).map(theme => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <Editor options={options} setOptions={setOptions} />

              {/* Code Frame */}
              <CodeFrame options={options} setOptions={setOptions} />

              {/* Font Size */}
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className='w-full'>
                      <div className='grid w-full grid-cols-[3fr,1fr]'>
                        <div className='flex items-center space-x-2'>
                          <BarsArrowUpIcon className='w-6 h-6 text-darkGreen dark:text-white' />

                          <h3 className='text-sm text-darkGreen dark:text-white'>
                            Font Size
                          </h3>
                        </div>

                        <div className='flex items-center justify-around'>
                          {/* tip */}
                          <div className='relative'>
                            <QuestionMarkCircleIcon className='h-6 w-6 cursor-pointer text-darkGreen  dark:text-white [&~div]:hover:block' />
                            <div className='absolute z-50 hidden p-2 transform -translate-x-1/2 rounded-md shadow-md top-full left-1/2 w-44 bg-dark/40 backdrop-blur-sm hover:block'>
                              <p className='text-sm text-darkGreen dark:text-white'>
                                Change the font size of the code editor.
                              </p>
                            </div>
                          </div>
                          <ChevronRightIcon
                            className={`${
                              open ? 'rotate-90 transform' : ''
                            } h-5 w-5 justify-self-end text-darkGreen  dark:text-white`}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>

                    <Disclosure.Panel
                      ref={fontSizeRef}
                      onMouseDown={dragStart}
                      onMouseUp={dragStop}
                      onMouseLeave={dragStop}
                      onMouseMove={e =>
                        dragMove(
                          e,
                          diff => (fontSizeRef.current.scrollLeft += diff),
                        )
                      }
                      className='w-full overflow-x-scroll custom-scrollbar-sm'>
                      <RadioGroup
                        className='flex items-center p-2 space-x-2 w-max'
                        value={options.fontSize}
                        onChange={value =>
                          setOptions({ ...options, fontSize: value })
                        }>
                        <RadioGroup.Label className='sr-only'>
                          Font Size
                        </RadioGroup.Label>

                        <RadioGroup.Option
                          as='button'
                          value='text-sm'
                          className={`rounded-md border border-white py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                          Small
                        </RadioGroup.Option>

                        <RadioGroup.Option
                          as='button'
                          value='text-base'
                          className={`rounded-md border border-white py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                          Medium
                        </RadioGroup.Option>

                        <RadioGroup.Option
                          as='button'
                          value='text-lg'
                          className={`rounded-md border border-white py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 ui-checked:border-green-400 ui-checked:bg-primary ui-checked:text-white`}>
                          Large
                        </RadioGroup.Option>
                      </RadioGroup>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

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

              <h3 className='w-full text-center text-darkGreen dark:text-white'>
                Canvas Options
              </h3>

              {/* Background */}
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className='w-full'>
                      <div className='relative flex items-center justify-between w-full pb-2 text-sm text-gray-400'>
                        <div className='grid grid-cols-[2fr,1fr]'>
                          <div className='flex items-center space-x-2'>
                            <BackgroundIcon className='w-6 h-6 text-darkGreen dark:text-white' />

                            <h3 className='text-sm text-darkGreen dark:text-white'>
                              Background
                            </h3>
                          </div>

                          <div className='flex items-center justify-around'>
                            <div className='relative'>
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setBGPicker(!bgPicker);
                                }}
                                className='flex items-center px-2 ml-2 font-medium rounded-lg cursor-pointer bg-primary text-darkGreen hover:bg-green-500'>
                                <span className='w-3 h-3 mr-1'>
                                  {ColorPickerIcon}
                                </span>
                                Pick
                              </div>
                            </div>
                            <ChevronRightIcon
                              className={`${
                                open ? 'rotate-90 transform' : ''
                              } h-5 w-5 text-darkGreen  dark:text-white`}
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
                              className={`h-8 w-8 cursor-pointer rounded-full shadow shadow-gray-500/20 dark:shadow-black/20 ${theme}`}
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
                          className='flex items-center mt-4 space-x-2'
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
                              className='p-1 border rounded-md cursor-pointer ui-checked:border-green-400'>
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
              <Roundness
                options={options}
                setOptions={setOptions}
                target='wrapper'
              />

              {/* Snapit Watermark */}
              <SnapitWatermark
                options={options}
                setOptions={setOptions}
                proMode={proMode}
              />

              {/* Export / Copy */}
              <div className='!mt-12 flex w-full items-center justify-center space-x-6'>
                <button
                  className='flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-primary text-darkGreen hover:bg-green-500'
                  title='Use Ctrl/Cmd + S to save the image'
                  onClick={saveImage}>
                  <span className='w-6 h-6 mr-2'>{SaveIcon}</span>
                  Save
                </button>

                <button
                  className='flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-primary text-darkGreen hover:bg-green-500'
                  onClick={copyImage}
                  title='Use Ctrl/Cmd + C to copy the image'>
                  <span className='w-6 h-6 mr-2'>{ClipboardIcon}</span>
                  Copy
                </button>
              </div>

              <p className='text-center text-darkGreen dark:text-white'>or</p>

              <div className='space-y-4'>
                {showPresetModal && user?.isPro && (
                  <input
                    type='text'
                    placeholder="Preset's name"
                    className='w-full rounded-md bg-[#212121] py-2 px-4 text-darkGreen  outline-none ring-1 ring-transparent focus:ring-green-400 dark:text-white'
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                  />
                )}

                {user && user.isPro && (
                  <button
                    className='flex items-center justify-center w-full px-4 py-2 text-base text-white rounded-md bg-primary'
                    onClick={handleSavePreset}>
                    <span className='w-6 h-6 mr-2'>{SaveIcon}</span>
                    Create Preset
                  </button>
                )}
              </div>

              {/* Reset */}
              <button
                onClick={resetCanvas}
                className='mx-auto !mt-8 flex w-full cursor-pointer items-center justify-center text-darkGreen dark:text-primary'>
                <span className='w-4 h-4 mr-1'>{ResetIcon}</span>
                Reset
              </button>
            </div>
          </article>
        </Tab.Panel>

        {/* presets */}
        <Tab.Panel>
          <div className='custom-scrollbar min-h-[550px] w-full overflow-y-scroll rounded-md bg-primary bg-opacity-20 p-8 dark:bg-opacity-10'>
            {!proMode && (
              <div className='text-center text-darkGreen dark:text-white'>
                <h3>
                  Save time applying customizations with Presets. You can save
                  your customizations and apply them later with just one-click.
                </h3>

                <button
                  onClick={() => setShowBuyPro(true)}
                  className='w-full p-2 mt-6 rounded-md bg-primary text-darkGreen'>
                  Get Screenshots4all Pro
                </button>
              </div>
            )}

            {proMode && (
              <article className='space-y-4'>
                <h3 className='w-full text-center text-gray-500'>Presets</h3>

                {user?.presets?.code?.length === 0 && (
                  <div className='mt-6 text-center text-gray-400'>
                    <h3>
                      You don't have any presets yet. Create one by clicking the
                      "Save as Preset" button.
                    </h3>
                  </div>
                )}

                {user?.presets?.code?.map((preset, i) => (
                  <div className='flex items-center space-x-2' key={i}>
                    <button
                      key={preset.id}
                      className='flex items-center justify-between w-full p-2 transition rounded-md bg-dark/40 hover:bg-dark/80'
                      onClick={() => setPreset(preset.options)}>
                      <p className='text-sm text-gray-400'>{preset.name}</p>
                    </button>

                    <button
                      onClick={async () =>
                        await handleDeletePreset(preset.name)
                      }>
                      <TrashIcon className='w-5 h-5 text-gray-500' />
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

  return (
    <section className='mx-auto grid w-[90%] grid-cols-1 gap-10 sm:grid-cols-1 md:w-[80%] md:grid-cols-[1fr,300px]'>
      {renderPreview()} {renderOptions()}
    </section>
  );
};

export default TemplateMaker;
