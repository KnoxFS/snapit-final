import Link from 'next/link';

const brands = [
  {
    name: 'Google',
    image: '/brands/google.svg',
  },
  {
    name: 'Slack',
    image: '/brands/slack.svg',
  },
  {
    name: 'Atlassian',
    image: '/brands/atlassian.svg',
  },
  {
    name: 'Dropbox',
    image: '/brands/dropbox.svg',
  },
];

const Hero = () => {
  return (
    <section className='sm:w-[90%] md:max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-1 gap-12 mt-12 place-items-center text-center'>
      <article className='grid place-items-center'>
        <h1 className='md:text-6xl text-3xl text-white font-semibold'>
          Creating beautiful screenshots
          <br />
          has
          <span className='relative z-[1]'>
            {' '}
            never been so easy
            <span className='bg-primary w-[220px] h-4 lg:block absolute right-0 bottom-2 -z-[1] hidden'></span>
          </span>
        </h1>

        <p className='text-lg text-white text-opacity-70 mt-4 mx-4 w-[60%]'>
          Capture, annotate, and share screenshots with just few buttons. Take a
          screenshot of anything on your screen and we’ll make it look amazing
          in seconds.
        </p>

        {/* sponsor */}

        <div className='mt-6'>
          <p className='text-sm text-white'>Used daily by members of</p>

          <ul className='grid place-items-center'>
            <div className='flex items-center space-x-4 mt-4'>
              {brands.map(brand => (
                <li
                  key={brand.name}
                  className='flex items-center space-x-2 text-sm'>
                  <img src={brand.image} alt={brand.name} className='w-6' />
                </li>
              ))}
            </div>
          </ul>
          <a
            href='https://www.producthunt.com/posts/snapit-927d6feb-16f6-42c2-9aa5-98de91904faf?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-snapit&#0045;927d6feb&#0045;16f6&#0045;42c2&#0045;9aa5&#0045;98de91904faf'
            target='_blank'
            rel='noreferrer'>
            <img
              src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=376208&theme=dark'
              alt='Snapit - Creating&#0032;beautiful&#0032;screenshots&#0032;has&#0032;never&#0032;been&#0032;so&#0032;easy | Product Hunt'
              className=' mt-4 mr-3 width: 250px; height: 54px;'
              width='250'
              height='54'
            />
          </a>
        </div>
      </article>
    </section>
  );
};

export default Hero;
