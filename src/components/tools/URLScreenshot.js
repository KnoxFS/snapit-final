import { useState } from 'react';
import { toast } from 'react-hot-toast';

import bufferToBase64 from 'utils/bufferToBase64';

const targets = {
  mobile: { width: 414, height: 896 },
  desktop: { width: 1920, height: 1080 },
};

const URLScreenshot = ({ proMode, blob, setBlob, target }) => {
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

      const res = await fetch(
        `/api/getScreenshot?url=${encodeURIComponent(websiteUrl)}&width=${
          targets[target].width
        }&height=${targets[target].height}`,
      );
      const { image, error } = await res.json();

      if (error) {
        toast.error(error, { id: toastId });
        return;
      }

      const finalImage = bufferToBase64(image.data);

      setBlob({ ...blob, src: `data:image/png;base64,${finalImage}` });

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
    <div>
      <input
        type='text'
        placeholder='Enter url, e.g (https://stripe.com)'
        className='w-full p-2 text-center text-sm bg-darkGreen rounded-md border border-[#2B2C2F] text-white outline-none'
        value={websiteUrl}
        onChange={e => setWebsiteUrl(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            getWebsiteScreenshot();
          }
        }}
      />
    </div>
  );
};

export default URLScreenshot;
