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
      '“And thanks to Snapit, I was able to take snazzy screenshots in no time!”',
  },
  {
    id: 3,
    author: '@drclairekaye',
    avatar: '/people/3.png',
    content:
      '“Kudos team! I love using Snapit to add beautiful screenshots to my newsletters.”',
  },
  {
    id: 4,
    author: '@meneverse',
    avatar: '/people/4.png',
    content:
      '“Snapit is such a useful tool for me as an advertising guy  -  I can easily modify screenshots to get the desired result.',
  },
];

const Community = () => {
  return (
    <section
      className='sm:w-[90%] md:max-w-[1280px] mx-auto overflow-hidden md:mt-[140px] mt-[80px]'
      id='community'>
      <header className='text-center text-white pb-16'>
        <h3 className='md:text-5xl text-3xl font-semibold mb-4'>
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
            <div className='bg-primary bg-opacity-10 p-4 rounded-md lg:min-w-[350px] min-h-[200px] mx-2 md:mx-auto'>
              <header className='mb-4 flex items-center space-x-2'>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={feed.avatar}
                />
                <h3 className='text-white'>{feed.author}</h3>
              </header>

              <p className='text-white text-[18px]'>{feed.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Community;
