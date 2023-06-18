import { useState, Fragment } from 'react';
import { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Dialog, Transition } from '@headlessui/react';

// css
import 'swiper/css';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const applications = [
  {
    id: 1,
    title: 'Add tilt effect and create perspective.',
    image: '/features/IMAGE-0.png',
  },
  {
    id: 3,
    title: 'Use custom background images or gradient colors.',
    image: '/features/IMAGE-2.png',
  },
  {
    id: 4,
    title: 'Add custom text to your screenshots.',
    image: '/features/IMAGE-3.png',
  },
  {
    id: 5,
    title: 'Use beautifully crafted patterns for your screenshots.',
    image: '/features/IMAGE-4.png',
  },
  {
    id: 6,
    title: 'Add custom watermark text or social media links.',
    image: '/features/IMAGE-5.png',
  },
  {
    id: 7,
    title: 'Save mulitple presets to apply settings quickly.',
    image: '/features/IMAGE-6.png',
  },
  {
    id: 8,
    title: 'Add your desired choice of browser frames.',
    image: '/features/IMAGE-7.png',
  },
  {
    id: 9,
    title: 'Capture and load screenshots from URL',
    image: '/features/IMAGE-8.png',
  },
  {
    id: 10,
    title: 'Add noise to create depths for your screenshots.',
    image: '/features/IMAGE-9.png',
  },
];

const Applications = () => {
  const [showAll, setShowAll] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);

  const handleShowImage = img => {
    setImage(img);
    setShowModal(true);
  };

  return (
    <section className='mx-auto w-[90%] md:w-[80%]'>
      <header className='my-12'>
        <h2 className='text-xl text-darkGreen dark:text-white'>
          Here's what extra you can do with Snapit Pro:
        </h2>
      </header>

      {showAll && (
        <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4'>
          {applications.map(app => (
            <article
              key={app.id}
              className='text-center sm:text-left'
              onClick={() => handleShowImage(app)}>
              <img
                src={app.image}
                alt={app.title}
                className='mx-auto my-4 sm:mx-0'
              />
              <h3 className='text-lg text-white'>{app.title}</h3>
            </article>
          ))}

          <button
            onClick={() => setShowAll(false)}
            className='mx-auto text-lg text-green-400 w-max hover:underline sm:col-span-2 md:col-span-4'>
            Show less
          </button>
        </div>
      )}

      {!showAll && (
        <article className='grid grid-cols-1 gap-10 md:grid-cols-2'>
          {/* get first item to show */}
          {applications.slice(currentIndex, currentIndex + 1).map(app => (
            <div key={app.id}>
              <img
                src={app.image}
                className='object-cover w-full rounded-md'
                alt={app.title}
              />
              <p className='mt-6 text-3xl text-darkGreen dark:text-white'>
                {app.title}
              </p>
            </div>
          ))}

          <div>
            <button
              onClick={() => setShowAll(true)}
              className='block mb-4 ml-auto mr-4 text-right text-green-400 w-max underline-offset-2 hover:underline'>
              See all
            </button>

            {/* get rest of the items with a slider */}
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                disabledClass: 'swiper-button-disabled',
              }}
              spaceBetween={50}
              slidesPerView={2}
              autoplay={{
                delay: 3000,
              }}
              onSlideChange={swiper => {
                setCurrentIndex(swiper.realIndex);
              }}
              loop
              height='300px'
              className='relative h-full'>
              {applications.slice(1).map(app => (
                <SwiperSlide key={app.id}>
                  <div className='flex flex-col items-center justify-center'>
                    <img
                      src={app.image}
                      className='rounded-md'
                      alt={app.title}
                    />
                    <p className='mt-2 text-darkGreen dark:text-white'>
                      {app.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}

              {/* Add Arrows */}
              <div className='absolute bottom-0 top-auto z-10 flex justify-between w-full text-green-400 cursor-pointer md:bottom-20'>
                <div className='swiper-button-prev'>
                  <ChevronLeftIcon className='w-8 h-8' />
                </div>
                <div className='swiper-button-next'>
                  <ChevronLeftIcon className='w-8 h-8 rotate-180' />
                </div>
              </div>
            </Swiper>
          </div>
        </article>
      )}

      {/* Image modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setShowModal(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='w-[80%] transform overflow-hidden rounded-2xl bg-[#282828] p-6 text-left align-middle shadow-xl transition-all md:w-max'>
                  <img src={image?.image} className='md:max-w-2xl' />

                  <Dialog.Title
                    as='h3'
                    className='mt-4 text-lg font-medium leading-6 text-center text-darkGreen dark:text-white md:text-2xl'>
                    {image?.title}
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default Applications;
