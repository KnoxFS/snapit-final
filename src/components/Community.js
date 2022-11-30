import { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// css
import "swiper/css";

const feeds = [
  {
    id: 1,
    author: "@ste_grider",
    avatar: "/people/1.png",
    content:
      "“This is a really cool tool to help you professionally display beautiful screenshots.”",
  },
  {
    id: 2,
    author: "@Goodeye",
    avatar: "/people/2.png",
    content:
      "“And thanks to Snapit, I was able to take snazzy screenshots in no time!”",
  },
  {
    id: 3,
    author: "@drclairekaye",
    avatar: "/people/3.png",
    content:
      "“Kudos team! I love using Snapit to add beautiful screenshots to my newsletters.”",
  },
  {
    id: 4,
    author: "@meneverse",
    avatar: "/people/4.png",
    content:
      "“Snapit is such a useful tool for me as an advertising guy  -  I can easily modify screenshots to get the desired result.",
  },
];

const Community = () => {
  return (
    <section
      className="w-[90%] md:w-[80%] mx-auto overflow-hidden"
      id="community"
    >
      <header className="text-center text-gray-500 py-16">
        <h3 className="text-3xl mb-4">Join the community</h3>
        <p>
          Our users constantly astound us everyday with the beautiful images
          they create with Snapit.
        </p>
      </header>

      {/* grid - 4 */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          disabledClass: "swiper-button-disabled",
        }}
        spaceBetween={50}
        slidesPerView={3}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          420: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        autoplay={{
          delay: 3000,
        }}
        loop
        className="relative h-full"
      >
        {/* card */}
        {feeds.map((feed) => (
          <SwiperSlide key={feed.id} className="cursor-move">
            <div className="bg-[#232323] p-4 rounded-md border min-w-[350px] border-gray-500/20">
              <header className="mb-4 flex items-center space-x-2">
                <img
                  className="h-12 w-12 rounded-full bg-gray-400 object-cover"
                  src={feed.avatar}
                />
                <h3 className="text-gray-500">{feed.author}</h3>
              </header>

              <p className="text-gray-500 text-sm">{feed.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Community;
