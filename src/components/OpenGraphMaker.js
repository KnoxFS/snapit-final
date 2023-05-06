import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuth from 'hooks/useAuth';
import domtoimage from 'dom-to-image';

import { SaveIcon, ClipboardIcon } from 'ui/icons';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import updateStats from 'utils/updateStats';

const layouts = {
  card: options => (
    <div
      className={`w-full h-full grid grid-rows-[70%,1fr] ${
        options.image ? 'max-h-[500px]' : 'min-h-[500px]'
      }`}>
      <div className='h-full'>
        {options.image && (
          <img
            src={options.image.url}
            alt='preview'
            className='object-cover h-full w-full rounded-t-md'
          />
        )}
      </div>

      <footer className='bg-darkGreen bg-opacity-50 w-full py-4 px-6 flex flex-col md:flex-row md:items-end justify-between rounded-b-md'>
        <div className='w-full'>
          <h2 className='text-xl md:text-3xl text-white font-bold'>
            {options.title}
          </h2>
          <p className='text-white mt-2 md:w-[70%]'>{options.description}</p>

          {/* author */}
          {options.author && (
            <div className='flex items-center mt-4'>
              <UserCircleIcon className='h-6 w-6 text-white' />
              <p className='text-white ml-2'>{options.author}</p>
            </div>
          )}
        </div>

        {/* Watermark */}
        {options.watermark && (
          <div className='bg-primary p-2 px-3 rounded-md text-darkGreen font-medium text-sm mt-6 md:mt-0 w-max'>
            <p className='whitespace-nowrap'>Made with snapit.gg</p>
          </div>
        )}
      </footer>
    </div>
  ),
  stack: options => (
    <div className='h-[500px] flex flex-col overflow-hidden relative'>
      <header className='text-center p-6 w-[80%] mx-auto'>
        <h2 className='text-xl md:text-3xl text-white font-bold'>
          {options.title}
        </h2>
        <p className='text-white mt-4'>{options.description}</p>

        {options.author && (
          <div className='flex items-center mt-6 mx-auto w-max'>
            <UserCircleIcon className='h-6 w-6 text-white' />
            <p className='text-white ml-2'>{options.author}</p>
          </div>
        )}
      </header>

      <div className='bg-white/80 h-full w-[500px] mx-auto self-align-end rounded-t-md flex'>
        {options.image && (
          <img
            src={options.image.url}
            alt='Image'
            className='object-cover w-full rounded-t-md'
          />
        )}
      </div>

      {/* Watermark */}
      {options.watermark && (
        <div className='bg-primary p-2 rounded-md text-bgGreen text-sm w-max font-medium absolute bottom-5 right-5'>
          <p>Made with snapit.gg</p>
        </div>
      )}
    </div>
  ),
  grid: options => (
    <div
      className={`grid md:grid-cols-2 ${
        options.image ? 'max-h-[500px]' : 'min-h-[500px]'
      } relative`}>
      <article className='bg-darkGreen bg-opacity-50 h-full p-6 flex flex-col justify-center rounded-l-md'>
        <h2 className='text-xl md:text-3xl text-white font-bold'>
          {options.title}
        </h2>
        <p className='text-white mt-4 text-base md:text-lg'>
          {options.description}
        </p>

        {/* author */}
        {options.author && (
          <div className='flex items-center mt-4'>
            <UserCircleIcon className='h-6 w-6 text-white' />
            <p className='text-white ml-2'>{options.author}</p>
          </div>
        )}
      </article>

      <article className='row-start-1 md:row-start-auto h-full'>
        {options.image && (
          <img
            src={options.image.url}
            alt='preview'
            className='object-cover w-full h-[500px] rounded-t-md md:rounded-t-none md:rounded-r-md'
          />
        )}
      </article>

      {/* Watermark */}
      {options.watermark && (
        <div className='bg-primary p-2 rounded-md text-bgGreen text-sm font-medium w-max absolute bottom-5 right-5'>
          <p>Made with snapit.gg</p>
        </div>
      )}
    </div>
  ),
};

const OpenGraphMaker = ({ proMode }) => {
  const { user } = useAuth();

  const wrapperRef = useRef();

  const [options, setOptions] = useState({
    title: "I'm on my way but where am I heading?",
    description: 'The quick brown fox jumps over the lazy dog.',
    author: user?.name || 'John Doe',
    date: '',

    image: null,

    layout: 'card',
    watermark: !proMode,
  });

  useEffect(() => {
    setOptions({ ...options, watermark: !proMode });
  }, [proMode]);

  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;

    setOptions({ ...options, [name]: value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setOptions({
        ...options,
        image: {
          url: reader.result,
          name: file.name,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  const getMetadataFromURL = async () => {
    if (!proMode) {
      toast.error('You need to be a pro member to use this feature');
      return;
    }

    // valid url with http or https
    if (!websiteUrl.match(/^(http|https):\/\//)) {
      toast.error('Please enter a valid url (https://example.com).');
      return;
    }

    let toastId = toast.loading('Getting website metadata...');

    const res = await fetch(`/api/getMetadata?url=${websiteUrl}`);
    const { metadata, error } = await res.json();

    if (error) {
      toast.error(error, { id: toastId });
      return;
    }

    const httpRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const trailSlashRegex =
      /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    let image = null;

    if (metadata['image']) {
      if (httpRegex.test(metadata['image'])) {
        image = {
          url: metadata['image'],
          name: 'image',
        };
      } else {
        image = {
          url: metadata['url'] + metadata['image'],
          name: 'image',
        };
      }
    }

    setOptions({
      title: metadata.title,
      description: metadata.description,
      author: metadata.author || metadata.publisher || '',
      image: image,
      layout: options.layout,
    });

    toast.success('Website metadata added!', { id: toastId });
  };

  const handleCopyCode = async () => {
    const code = document.querySelector('.code').innerText;
    await navigator.clipboard.writeText(code);

    toast.success('Copied to clipboard!');
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
  const saveImage = async e => {
    e.preventDefault();

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
              pirsch('🎉 OpenGraph saved');
            }

            if (user) {
              updateStats(user.id, 'OpenGraph_Saved');
            }
          });
      });
  };

  // copy image to clipboard
  const copyImage = e => {
    e.preventDefault();

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
          toast.success('Image copied to clipboard');

          if (window.pirsch) {
            pirsch('🎉 OpenGraph copied');
          }

          if (user) {
            updateStats(user.id, 'OpenGraph_Copied');
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
                  pirsch('🎉 OpenGraph copied');
                }

                if (user) {
                  updateStats(user.id, 'OpenGraph_Copied');
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

  const renderPreview = () => (
    <article
      ref={el => (wrapperRef.current = el)}
      className='bg-primary bg-opacity-10 border-primary border-opacity-40 border rounded-md'>
      {layouts[options.layout](options)}
    </article>
  );

  const renderOptions = () => (
    <article className='bg-primary bg-opacity-10 border-primary border-opacity-40 w-full border  rounded-md p-4 '>
      {/* fetch from url */}

      <div>
        <input
          type='text'
          className='w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F]'
          placeholder='Fetch from URL'
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              getMetadataFromURL();
            }
          }}
        />

        <button
          onClick={getMetadataFromURL}
          disabled={!websiteUrl}
          className='flex gap-2 items-center bg-darkGreen disabled:cursor-not-allowed w-max mx-auto mt-2 px-12 py-2 rounded-md disabled:opacity-50 text-white shadow-md shadow-[#1C201E]'>
          <svg
            width='12'
            height='16'
            viewBox='0 0 10 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M5.92851 0.0352685C6.07351 0.0849236 6.20017 0.183654 6.29009 0.317101C6.38001 0.450548 6.42849 0.611752 6.42848 0.777269V4.66616H9.28544C9.41609 4.6661 9.54425 4.70506 9.65598 4.7788C9.7677 4.85255 9.85872 4.95825 9.91911 5.08441C9.9795 5.21056 10.007 5.35234 9.9985 5.49431C9.99004 5.63629 9.94598 5.77301 9.87112 5.88961L4.87144 13.6674C4.78442 13.8031 4.6599 13.9051 4.51599 13.9585C4.37208 14.0118 4.21628 14.0138 4.07127 13.9641C3.92626 13.9144 3.7996 13.8156 3.70972 13.6821C3.61984 13.5485 3.57142 13.3873 3.57152 13.2217V9.33283H0.714558C0.583911 9.3329 0.45575 9.29394 0.344023 9.22019C0.232296 9.14645 0.141284 9.04074 0.080891 8.91459C0.0204981 8.78843 -0.00696171 8.64665 0.00149979 8.50468C0.00996128 8.36271 0.05402 8.22598 0.128881 8.10939L5.12856 0.331602C5.21571 0.196103 5.34026 0.0943893 5.48411 0.0412388C5.62797 -0.0119117 5.78364 -0.0137306 5.92851 0.0360463V0.0352685Z'
              fill='#E6B917'></path>
          </svg>{' '}
          Fetch
        </button>
      </div>

      {/* divider */}
      <div className='border-b  border-primary border-opacity-40 my-4'></div>

      {/* form */}
      <form className='space-y-2'>
        {/* title */}
        <input
          type='text'
          className='w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F]'
          placeholder='Title'
          value={options.title}
          name='title'
          onChange={handleChange}
        />
        <input
          type='text'
          className='w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F]'
          placeholder='Excerpt'
          value={options.description}
          name='description'
          onChange={handleChange}
        />
        <input
          type='text'
          className='w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F]'
          placeholder='Author'
          value={options.author}
          name='author'
          onChange={handleChange}
        />

        <input
          type='date'
          className='w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F]'
          placeholder='Publish Date'
          value={options.date}
          name='date'
          onChange={handleChange}
        />

        {/* upload image */}

        <div>
          <input
            type='file'
            id='image'
            accept='image/png,image/jpg'
            className='hidden'
            onChange={handleImageChange}
          />

          <label
            htmlFor='image'
            className='block w-full p-2 text-white text-sm md:text-base bg-darkGreen rounded-md border border-[#2B2C2F] cursor-pointer'>
            {options.image ? options.image.name : 'Image'}
          </label>

          {options.image && (
            <button
              onClick={() => setOptions({ ...options, image: null })}
              className='text-green-400 text-sm p-2'>
              Remove
            </button>
          )}
        </div>

        <div className='flex justify-center items-center space-x-4 !mt-8'>
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
      </form>
    </article>
  );

  const renderCode = () => (
    <article className='bg-primary bg-opacity-10 border-primary border-opacity-40 rounded-md border  w-full p-4'>
      <div className='flex justify-end mb-2'>
        <button
          onClick={handleCopyCode}
          className='bg-primary hover:bg-green-500 px-3 py-2 rounded-md text-darkGreen font-medium'>
          Copy meta tags
        </button>
      </div>

      <div className='space-y-4 font-mono code'>
        {/* Primary tags */}
        <div className='text-gray-400'>
          <p>{`<!- Primary Tags ->`}</p>
          {/* title */}
          <p>{`<title>${options.title}</title>`}</p>
          <p>{`<meta property="title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="description" content="${options.description}" />`}</p>
        </div>

        {/* Twitter */}
        <div className='text-gray-400'>
          <p>{`<!- Twitter ->`}</p>
          {/* title */}
          <p>{`<meta property="twitter:title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="twitter:description" content="${options.description}" />`}</p>
          <p>{`<meta property="twitter:url" content="" />`}</p>
        </div>

        {/* Facebook */}
        <div className='text-gray-400'>
          <p>{`<!- Facebook ->`}</p>
          {/* title */}
          <p>{`<meta property="og:title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="og:description" content="${options.description}" />`}</p>
        </div>
      </div>
    </article>
  );

  return (
    <section className='min-h-screen my-12'>
      {/* layout changer */}
      <div className='flex items-center justify-end mb-4 space-x-4 font-medium'>
        <p className='text-white'>Layouts:</p>
        <button
          onClick={() => setOptions({ ...options, layout: 'stack' })}
          className={`px-4 py-2 rounded-md ${
            options.layout === 'stack'
              ? 'bg-primary text-darkGreen hover:bg-green-500'
              : 'bg-darkGreen text-white'
          }`}>
          Stack
        </button>

        <button
          onClick={() => setOptions({ ...options, layout: 'card' })}
          className={`px-4 py-2 rounded-md  ${
            options.layout === 'card'
              ? 'bg-primary text-darkGreen hover:bg-green-500'
              : 'bg-darkGreen text-white'
          }`}>
          Card
        </button>

        <button
          onClick={() => setOptions({ ...options, layout: 'grid' })}
          className={`px-4 py-2 rounded-md ${
            options.layout === 'grid'
              ? 'bg-primary text-darkGreen hover:bg-green-500'
              : 'bg-darkGreen text-white'
          }`}>
          Grid
        </button>
      </div>

      {renderPreview()}

      <section className='grid grid-cols-1 md:grid-cols-[30%,1fr] gap-10 my-12'>
        {renderOptions()} {renderCode()}
      </section>
    </section>
  );
};

export default OpenGraphMaker;
