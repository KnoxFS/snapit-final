import { useRef, useState, useCallback } from 'react';
import ReactTilt from 'react-parallax-tilt';
import EnterInput from './KeyCaps/enter-input/enter-input';
import Preview from './KeyCaps/preview/preview';
import isMac from './KeyCaps/utils/is-mac';
import { Tab } from '@headlessui/react';
import handleDownload from './KeyCaps/utils/handle-download';
import { ResetIcon } from 'ui/icons';
import { useSettings } from 'hooks/use-settings';
import KeyboardFrame from './KeyCaps/tools/KeyboardFrame';
import Size from './tools/Size';
import PlusShow from './KeyCaps/tools/PlusShow';
import MacSymbolShow from './KeyCaps/tools/MacSymbolShow';
import Roundness from './tools/Roundness';
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
  shadow: 'drop-shadow-none',
  position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',

  roundedWrapper: 'rounded-2xl',

  size: 85,

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

const defaultKeys = [isMac() ? 'Cmd' : 'Ctrl', 'v'];
const KeyCapsMaker = ({ proMode }) => {
  const [value, setValue] = useState(defaultKeys);
  const [themeSelected, setThemeSelected] = useState('light');
  const [plusEnabled, setPlusEnabled] = useState(true);
  const [macEnabled, setMacEnabled] = useState(true);
  const [settings, setSetting] = useSettings();
  const combinationStr = value.join('-').toLocaleLowerCase();
  const filename = combinationStr;
  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);
  const wrapperRef = useRef(null);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });

  const handleDownloadButton = useCallback(
    async type => {
      if (wrapperRef.current === null) {
        return;
      }
      handleDownload({ type, wrapperElement: wrapperRef.current, filename });
    },
    [wrapperRef, filename],
  );

  const resetCanvas = () => {
    setOptions(defaultOptions);
    if (!plusEnabled) {
      setPlusEnabled(true);
      setSetting({ showPlus: !settings.showPlus });
    }
    if (!macEnabled) {
      setMacEnabled(true);
      setSetting({ macChars: !settings.macChars });
    }
  };

  const renderPreview = () => (
    <article className='flex flex-col justify-around h-full gap-3 p-8 rounded-md bg-bgDark'>
      <div>
        <EnterInput value={value} setValue={setValue} />
      </div>

      <div
        // with background
        // ref={wrapperRef}
        // style={{
        //   background: `linear-gradient(291.46deg, #FEEC89 -1.02%, #FBA5A4 101.23%)`,
        // }}
        // className={
        //   `${options.bgDirection} ${options.theme} ${options.roundedWrapper}`
        //   // relative flex w-full overflow-hidden px-4 py-8 transition-all ${
        //   //   options.text.position === "top" ? "flex-col" : "flex-col-reverse"
        //   // } items-center justify-center`
        // }

        // without background
        style={
          options?.customTheme
            ? {
                background: `linear-gradient(291.46deg, #FEEC89 -1.02%, #FBA5A4 101.23%)`,
              }
            : {}
        }
        className={` ${options.bgDirection} ${options.theme} ${
          options.roundedWrapper
        } flex p-4 ${
          options.text.position === 'top' ? 'flex-col' : 'flex-col-reverse'
        }  h-[500px] w-full overflow-hidden transition-all`}>
        <ReactTilt
          tiltAngleXManual={manualTiltAngleX}
          tiltAngleYManual={manualTiltAngleY}
          tiltMaxAngleY={30}
          tiltMaxAngleX={30}
          reset={false}
          className='mx-2 flex h-[100%] items-center justify-center '>
          <div
            style={{
              transform: `scale(${options.size / 100})`,
              width: '500px',
            }}>
            <Preview
              themeSelected={themeSelected}
              wrapperRef={wrapperRef}
              setThemeSelected={setThemeSelected}
              value={value}
            />
          </div>
        </ReactTilt>
      </div>
    </article>
  );

  const renderOptions = () => (
    <Tab.Group as='div' id='tabs' className='relative' style={{}}>
      <Tab.Panels>
        {/* options */}
        <Tab.Panel>
          <article
            style={{ height: '1000px' }}
            className='custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-bgDark p-4'>
            <div className='space-y-4'>
              <h3 className='w-full text-center text-darkGreen dark:text-white'>
                Shortcut Keys Options
              </h3>

              {/* Code Frame */}
              <KeyboardFrame
                options={options}
                setOptions={setOptions}
                themeSelected={themeSelected}
                setThemeSelected={setThemeSelected}
                defaultKeys={defaultKeys}
              />

              {/* Key Size */}
              <Size
                options={options}
                setOptions={setOptions}
                label='Keys Size'
                max='100'
                min='30'
              />
              {/* + Show */}
              <PlusShow
                enabled={plusEnabled}
                setEnabled={setPlusEnabled}
                settings={settings}
                setSetting={setSetting}
              />

              {/* Mac Symbol */}
              <MacSymbolShow
                enabled={macEnabled}
                setEnabled={setMacEnabled}
                settings={settings}
                setSetting={setSetting}
              />

              <h3 className='w-full text-center text-darkGreen dark:text-white'>
                Canvas Options
              </h3>

              {/* Roundness */}
              <Roundness
                options={options}
                setOptions={setOptions}
                target='wrapper'
              />

              <h3 className='w-full text-center text-darkGreen dark:text-white'>
                Save As
              </h3>

              {/* Export / Copy */}
              <div className='flex items-center justify-center w-full space-x-6'>
                <button
                  className='flex items-center justify-center px-4 py-2 text-base text-white rounded-md bg-primary'
                  title='Use Ctrl/Cmd + S to save the image'
                  onClick={() => handleDownloadButton('png')}>
                  <span className='w-6 h-6 mr-2 font-medium text-slate-900'>
                    PNG
                  </span>
                </button>

                <button
                  className='flex items-center justify-center px-4 py-2 text-base text-white rounded-md bg-primary'
                  onClick={() => handleDownloadButton('jpg')}
                  title='Use Ctrl/Cmd + C to copy the image'>
                  <span className='w-6 h-6 mr-2 font-medium text-slate-900'>
                    JPG
                  </span>
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={resetCanvas}
                className='mx-auto !mt-8 flex w-full cursor-pointer items-center justify-center text-primary'>
                <span className='w-4 h-4 mr-1'>{ResetIcon}</span>
                Reset
              </button>
            </div>
          </article>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );

  return (
    <section className='mx-auto grid w-[90%] grid-cols-1 gap-10 sm:grid-cols-1 md:w-[80%] md:grid-cols-[1fr,300px]'>
      {renderPreview()}
      {renderOptions()}
    </section>
  );
};

export default KeyCapsMaker;
