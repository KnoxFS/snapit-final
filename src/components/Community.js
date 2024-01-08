import { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// css
import 'swiper/css';

const feeds = [
  {
    id: 1,
    author: '@ste_grider',
    avatar: '/people/1.png',
    content:
      '“This is a really cool tool to help you professionally display beautiful screenshots.”',
  },
  {
    id: 2,
    author: '@Goodeye',
    avatar: '/people/2.png',
    content:
      '“And thanks to Screenshots4all, I was able to take snazzy screenshots in no time!”',
  },
  {
    id: 3,
    author: '@drclairekaye',
    avatar: '/people/3.png',
    content:
      '“Kudos team! I love using Screenshots4all to add beautiful screenshots to my newsletters.”',
  },
  {
    id: 4,
    author: '@meneverse',
    avatar: '/people/4.png',
    content:
      '“Screenshots4all is such a useful tool for me as an advertising guy  -  I can easily modify screenshots to get the desired result.',
  },
];

const Community = () => {
  return (
    <section
      className='mx-auto mt-[80px] overflow-hidden sm:w-[90%] md:mt-[140px] md:max-w-[1280px]'
      id='community'>
      <header className='pb-16 text-center text-darkGreen dark:text-white'>
        <h3 className='mb-4 text-3xl font-semibold md:text-5xl'>
          Join the community
        </h3>
      </header>

      {/* grid - 4 */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'swiper-button-disabled',
        }}
        spaceBetween={10}
        slidesPerView={3.5}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          420: {
            slidesPerView: 1.2,
            spaceBetween: 5,
          },
          640: {
            slidesPerView: 1.2,
            spaceBetween: 5,
          },
          768: {
            slidesPerView: 2.4,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 40,
          },
        }}
        autoplay={{
          delay: 3000,
        }}
        loop
        className='relative h-full'>
        {/* card */}
        {feeds.map(feed => (
          <SwiperSlide key={feed.id} className='cursor-move'>
            <div className='mx-2 min-h-[200px] rounded-md bg-primary bg-opacity-10 p-4 md:mx-auto lg:min-w-[350px]'>
              <header className='flex items-center mb-4 space-x-2'>
                <img
                  className='object-cover w-12 h-12 rounded-full'
                  src={feed.avatar}
                />
                <h3 className='font-bold tracking-wide text-darkGreen dark:text-white '>
                  {feed.author}
                </h3>
              </header>

              <p className='text-[18px] text-darkGreen dark:text-white'>
                {feed.content}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Community;
