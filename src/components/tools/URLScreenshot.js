import { useState } from 'react';
import { toast } from 'react-hot-toast';

import bufferToBase64 from 'utils/bufferToBase64';

const targets = {
  mobile: { width: 414, height: 896 },
  desktop: { width: 1920, height: 1080 },
};

const URLScreenshot = ({
  proMode,
  blob,
  setBlob,
  target,
  animate = false,
  animatedWidth,
  animatedHeight,
  format,
  duration,
  scrollable,
}) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
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

      const screenshotApi = animate ? 'getAnimatedScreenshot' : 'getScreenshot';
      const width = animate ? animatedWidth : targets[target].width;
      const height = animate ? animatedHeight : targets[target].height;
      const res = await fetch(
        `/api/${screenshotApi}?url=${encodeURIComponent(
          websiteUrl,
        )}&width=${width}&height=${height}&format=${format ? 'mp4' : 'gif'}${
          format ? `&duration=${duration}` : ''
        }${scrollable ? `&scenario=scroll` : ''}`,
      );
      const { image, error } = await res.json();
      if (error) {
        toast.error(error, { id: toastId });
        return;
      }

      const finalImage = bufferToBase64(image.data);
      setBlob({
        ...blob,
        src: `data:${format ? 'video/mp4' : 'image/png'};base64,${finalImage}`,
      });

      toast.success('Website screenshot loaded!', { id: toastId });

      if (window.pirsch) {
        pirsch('🙌 Screenshot gotten from URL');
      }

      return;
    }

    toast.error('No url provided.');
    return;
  };

  return (
    <div className='mt-4 '>
      <div className='mt-4'>
        <input
          type='text'
          placeholder='Enter Url, e.g (https://stripe.com)'
          className='w-full rounded-md border-none bg-primary bg-opacity-30 p-3 text-center text-sm text-white placeholder-darkGreen outline-none dark:bg-darkGreen dark:placeholder-white'
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
          onKeyUp={e => {
            if (e.key === 'Enter' && !animate) {
              getWebsiteScreenshot();
            }
          }}
        />
      </div>
      <div className='mt-4 flex flex-col items-center justify-center'>
        {animate && (
          <button
            className='flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base text-darkGreen dark:text-white'
            onClick={e => {
              getWebsiteScreenshot();
            }}>
            <span className='w=6 h=5 mr-2'>Get Screenshot</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default URLScreenshot;
