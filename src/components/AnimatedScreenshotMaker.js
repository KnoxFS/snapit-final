import { useRef, useState } from 'react';
import ReactTilt from 'react-parallax-tilt';
import URLScreenshot from './tools/URLScreenshot';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image';
import { SaveIcon } from 'ui/icons';
import Size from './tools/Size';
import { cssGradientsDirections } from 'constants/gradients';

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

const AnimatedScreenshotMaker = ({ proMode }) => {
  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);
  const [image, setImage] = useState(null);
  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const wrapperRef = useRef(null);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });
  const [duration, setDuration] = useState({
    ...defaultOptions,
    size: 5,
    watermark: !proMode,
  });
  const [size, setSize] = useState({ width: 1920, height: 1080 });
  const [toggle, setToggle] = useState(false);
  const [scrollToggle, setScrollToggle] = useState(false);
  const saveImage = () => {
    const wrapperElement = wrapperRef.current;

    if (!blob.src) {
      toast.error('No image to Save');
      return;
    }

    domtoimage.toBlob(wrapperElement).then(() => {
      const link = document.createElement('a');
      link.download = `snapit-${new Date().toISOString()}.${
        toggle ? 'mp4' : 'gif'
      }`;
      link.href = blob.src;
      setImage(link.href);
      link.click();
    });
  };

  const handleChange = e => {
    setSize({ ...size, [e.target.name]: e.target.value });
  };
  const handleToggle = e => {
    if (e.target.value) {
      setToggle(!toggle);
      setScrollToggle(false);
    }
  };

  const handleScrollToggle = e => {
    if (e.target.value) {
      setScrollToggle(!scrollToggle);
    }
  };
  const { width, height } = size;
  const type = blob?.src?.split(';')[0].split('/')[1];
  const renderPreview = () => (
    <article className='flex h-full justify-center rounded-md bg-primary bg-opacity-20 p-8 dark:bg-opacity-10'>
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
        // className={`w-full relative overflow-hidden transition-all flex px-4 py-8 flex-col justify-center items-center`}
        className={` ${options.bgDirection} ${options.theme} ${
          options.roundedWrapper
        } flex p-4 ${
          options.text.position === 'top' ? 'flex-col' : 'flex-col-reverse'
        } relative h-[600px] w-full overflow-hidden transition-all`}>
        {/* Text */}
        <div className=' relative flex h-[600px] w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-300 to-purple-300 p-4 transition-all'>
          <ReactTilt
            tiltAngleXManual={manualTiltAngleX}
            tiltAngleYManual={manualTiltAngleY}
            tiltMaxAngleY={30}
            tiltMaxAngleX={30}
            reset={false}
            className='mx-2 flex h-[100%]  items-center justify-center '>
            <div
              style={{
                transform: `scale(${options.size / 100})`,
              }}>
              {toggle
                ? type === 'mp4' && (
                    <video className='p-20' controls preload='auto'>
                      <source
                        src={blob.src}
                        type='video/mp4'
                        alt='Image not loaded'
                      />
                      Your browser does not support the video tag.
                    </video>
                  )
                : type === 'png' && (
                    <img
                      src={blob.src}
                      className='pointer-events-none h-full w-full select-none rounded-2xl'
                    />
                  )}
            </div>
          </ReactTilt>
        </div>
      </div>
    </article>
  );

  const renderOptions = () => (
    <article className='custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-primary bg-opacity-20 p-4 dark:bg-opacity-10'>
      <div className='flex h-full flex-col space-y-4'>
        <h3 className='w-full text-center text-darkGreen dark:text-white'>
          Device Options
        </h3>
        <div>
          <input
            type='number'
            name='width'
            min='0'
            onChange={handleChange}
            className='w-full rounded-md bg-primary bg-opacity-30 p-3 text-center text-sm text-darkGreen placeholder-darkGreen outline-none dark:bg-darkGreen dark:text-white dark:placeholder-white'
            placeholder='Enter Width'
            value={width}
          />
          <input
            type='number'
            name='height'
            min='0'
            onChange={handleChange}
            className='mt-4 w-full rounded-md bg-primary bg-opacity-30 p-3 text-center text-sm text-darkGreen placeholder-darkGreen outline-none dark:bg-darkGreen dark:text-white dark:placeholder-white'
            placeholder='Enter Height'
            value={height}
          />
          <div className='mt-4 flex items-center justify-between'>
            <h3 className='text-sm text-darkGreen dark:text-white'>
              Format (GIF/MP4)
            </h3>
            <div className='flex items-center'>
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-green-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] "
                type='checkbox'
                role='switch'
                id='flexSwitchChecked'
                onChange={handleToggle}
              />
              <label
                className='pl-[0.15rem] text-white hover:cursor-pointer'
                htmlFor='flexSwitchChecked'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-sm text-darkGreen dark:text-white'>
                    {toggle ? 'mp4' : 'gif'}
                  </h3>
                </div>
              </label>
            </div>
          </div>
          <div className='mt-4'>
            {toggle && (
              <Size
                options={duration}
                setOptions={setDuration}
                label='Duration (seconds)'
                max='30'
                min='5'
              />
            )}
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <h3 className='text-sm text-darkGreen dark:text-white'>
              Scrollable
            </h3>
            <div className='flex items-center'>
              <div className='mr-2 justify-self-end'>⚡</div>
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-gray-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-green-400 checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type='checkbox'
                role='switch'
                id='flexSwitchChecked'
                onChange={handleScrollToggle}
                disabled={!proMode ? true : false}
                checked={scrollToggle ? true : false}
              />
              <label
                className='pl-[0.15rem] text-white hover:cursor-pointer'
                htmlFor='flexSwitchChecked'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-sm text-darkGreen dark:text-white'>
                    {scrollToggle ? 'on' : 'off'}
                  </h3>
                </div>
              </label>
            </div>
          </div>

          <URLScreenshot
            proMode={proMode}
            blob={blob}
            setBlob={setBlob}
            animate={true}
            target='desktop'
            animatedWidth={width}
            animatedHeight={height}
            format={toggle}
            duration={toggle && duration.size}
            scrollable={scrollToggle}
          />
        </div>
        {/* <Size
          options={options}
          setOptions={setOptions}
          label="Size"
          max="100"
          min="50"
        /> */}
        <div className='!mt-auto flex flex-row justify-between'>
          <button
            className='flex items-center justify-center rounded-md bg-green-400 px-4 py-2 text-base text-darkGreen dark:text-white'
            title='Use Ctrl/Cmd + S to save the image'
            onClick={saveImage}>
            <span className='mr-2 h-5 w-6'>{SaveIcon}</span>
            Save
          </button>
          <div className='px-1'></div>
        </div>
      </div>
    </article>
  );

  return (
    <section className='mx-auto grid w-[90%] grid-cols-1 gap-10 sm:grid-cols-1 md:w-[80%] md:grid-cols-[1fr,300px]'>
      {renderPreview()} {renderOptions()}
    </section>
  );
};

export default AnimatedScreenshotMaker;
