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
    <article className='bg-primary bg-opacity-10 h-full p-8 rounded-md flex justify-center'>
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
          className='flex justify-center items-center w-[90%]'>
          {/* editor */}
          <div
            style={{
              background: themesBG[options.editorTheme],
              transform: `scale(${options.size / 100})`,
            }}
            className={`w-[90%] min-h-[250px] p-4 ${options.roundedWrapper} ${options.shadow}`}>
            {/* Header */}
            <header className='mb-4 flex items-center'>
              {/* dots */}
              {getCodeFrame(options.frame, options.editorTheme)}

              {/* tabs */}
              <div className='flex items-center space-x-2 mx-4 text-gray-500 custom-scrollbar-sm'>
                {tabs.map((tab, index) => {
                  const isActive = index === activeTab;

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`relative text-xs p-2 rounded-md text-gray-300 ${
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
                          className='absolute -top-0 -right-1 w-3 h-3 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] cursor-pointer'>
                          x
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* add tab */}
                <Popover className='relative'>
                  <Popover.Button className='text-sm font-medium p-2 rounded-md text-gray-800'>
                    <PlusIcon className='w-5 w-5 text-gray-500' />
                  </Popover.Button>

                  <Popover.Panel>
                    <div className='absolute -top-10 left-0 z-10 bg-[#212121] rounded-md shadow-lg py-2 px-4'>
                      <input
                        type='text'
                        className='bg-[#212121] outline-none text-xs'
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
              className={`outline-none ${options.fontSize} w-full !bg-transparent !min-h-[250px] !overflow-hidden`}
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
          <div className='bg-primary text-darkGreen absolute bottom-0 right-1/2 translate-x-1/2 p-1 px-2 select-none text-xs rounded-t-md'>
            Made with snapit.gg
          </div>
        )}
      </div>
    </article>
  );

  const renderOptions = () => (
    <Tab.Group as='div' id='tabs' className='relative'>
      {/* tabs */}

      <Tab.List className='absolute w-52 rotate-90 top-1/2 -right-[117px] px-6 py-1 cursor-pointer rounded-t-xl bg-primary bg-opacity-10 text-white text-sm flex flex-row justify-between'>
        <Tab
          as='button'
          className='ui-selected:bg-green-500 ui-not-selected:bg-transparent px-2 rounded-md outline-none'>
          Options
        </Tab>
        <Tab
          as='button'
          className='ui-selected:bg-green-500 ui-not-selected:bg-transparent px-2 rounded-md outline-none'>
          Presets
        </Tab>
      </Tab.List>

      <Tab.Panels>
        {/* options */}
        <Tab.Panel>
          <article className='bg-primary bg-opacity-10 rounded-md p-4 overflow-y-auto overflow-x-hidden max-h-[680px] custom-scrollbar'>
            <div className='space-y-4'>
              <h3 className='text-center text-white w-full'>Editor Options</h3>

              {/* Lang */}
              <div className='grid grid-cols-2 w-full'>
                <div className='flex items-center space-x-2'>
                  <CodeBracketIcon className='h-6 w-6 text-white' />

                  <h3 className='text-sm text-white'>Language</h3>
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
                  className='bg-primary p-2 text-dark font-semibold rounded-md cursor-pointer text-sm custom-scrollbar-sm outline-none'>
                  {langNames.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}

                  <option value='solidity'>Solidity</option>
                </select>
              </div>

              {/* Theme */}
              <div className='grid grid-cols-2 w-full'>
                <div className='flex items-center space-x-2'>
                  <Bars3Icon className='h-6 w-6 text-white' />

                  <h3 className='text-sm text-white'>Theme</h3>
                </div>

                <select
                  value={options.editorTheme}
                  onChange={e =>
                    setOptions({ ...options, editorTheme: e.target.value })
                  }
                  className='bg-primary p-2 text-dark font-semibold rounded-md text-sm cursor-pointer custom-scrollbar-sm outline-none'>
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
                      <div className='grid grid-cols-[3fr,1fr] w-full'>
                        <div className='flex items-center space-x-2'>
                          <BarsArrowUpIcon className='h-6 w-6 text-white' />

                          <h3 className='text-sm text-white'>Font Size</h3>
                        </div>

                        <div className='flex justify-around items-center'>
                          {/* tip */}
                          <div className='relative'>
                            <QuestionMarkCircleIcon className='w-6 h-6 text-white cursor-pointer [&~div]:hover:block' />
                            <div className='absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44'>
                              <p className='text-sm text-white'>
                                Change the font size of the code editor.
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
                        className='p-2 flex items-center space-x-2 w-max'
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
                          className={`border border-white py-2 px-4 text-sm text-white rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                          Small
                        </RadioGroup.Option>

                        <RadioGroup.Option
                          as='button'
                          value='text-base'
                          className={`border border-white py-2 px-4 text-sm text-white rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
                          Medium
                        </RadioGroup.Option>

                        <RadioGroup.Option
                          as='button'
                          value='text-lg'
                          className={`border border-white py-2 px-4 text-sm text-white rounded-md ui-checked:bg-primary ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}>
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

              <h3 className='text-center text-white w-full'>Canvas Options</h3>

              {/* Background */}
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className='w-full'>
                      <div className='relative flex items-center justify-between pb-2 text-sm text-gray-400 w-full'>
                        <div className='grid grid-cols-[2fr,1fr]'>
                          <div className='flex items-center space-x-2'>
                            <BackgroundIcon className='h-6 w-6 text-white' />

                            <h3 className='text-sm text-white'>Background</h3>
                          </div>

                          <div className='flex justify-around items-center'>
                            <div className='relative'>
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setBGPicker(!bgPicker);
                                }}
                                className='flex items-center px-2 ml-2 rounded-lg cursor-pointer bg-primary hover:bg-green-500 text-darkGreen font-medium'>
                                <span className='w-3 h-3 mr-1'>
                                  {ColorPickerIcon}
                                </span>
                                Pick
                              </div>
                            </div>
                            <ChevronRightIcon
                              className={`${
                                open ? 'rotate-90 transform' : ''
                              } h-5 w-5 text-white`}
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

              <p className='text-center text-white'>or</p>

              <div className='space-y-4'>
                {showPresetModal && user?.isPro && (
                  <input
                    type='text'
                    placeholder="Preset's name"
                    className='py-2 px-4 rounded-md bg-[#212121] outline-none ring-1 ring-transparent focus:ring-green-400 text-white w-full'
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                  />
                )}

                {user && user.isPro && (
                  <button
                    className='flex items-center justify-center px-4 py-2 w-full text-base bg-primary rounded-md text-white'
                    onClick={handleSavePreset}>
                    <span className='w-6 h-6 mr-2'>{SaveIcon}</span>
                    Create Preset
                  </button>
                )}
              </div>

              {/* Reset */}
              <button
                onClick={resetCanvas}
                className='flex items-center justify-center w-full mx-auto text-green-400 cursor-pointer !mt-8'>
                <span className='w-4 h-4 mr-1'>{ResetIcon}</span>
                Reset
              </button>
            </div>
          </article>
        </Tab.Panel>

        {/* presets */}
        <Tab.Panel>
          <div className='p-8 rounded-md bg-primary bg-opacity-10 w-full min-h-[550px] overflow-y-scroll custom-scrollbar'>
            {!proMode && (
              <div className='text-center text-white'>
                <h3>
                  Save time applying customizations with Presets. You can save
                  your customizations and apply them later with just one-click.
                </h3>

                <button
                  onClick={() => setShowBuyPro(true)}
                  className='bg-primary text-darkGreen w-full p-2 rounded-md mt-6'>
                  Get Snapit Pro
                </button>
              </div>
            )}

            {proMode && (
              <article className='space-y-4'>
                <h3 className='text-center text-gray-500 w-full'>Presets</h3>

                {user?.presets?.code?.length === 0 && (
                  <div className='text-center text-gray-400 mt-6'>
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
                      className='flex items-center justify-between w-full p-2 rounded-md bg-dark/40 hover:bg-dark/80 transition'
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

  return (
    <section className='w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[1fr,300px] gap-10'>
      {renderPreview()} {renderOptions()}
    </section>
  );
};

export default TemplateMaker;
