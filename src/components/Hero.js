import Link from 'next/link';
import ToggleTheme from './ToggleTheme';

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
    <section className='mx-auto mt-12 grid grid-cols-1 place-items-center gap-12 text-center sm:w-[90%] md:max-w-[1280px] md:grid-cols-1'>
      <article className='relative grid place-items-center'>
        <h1 className='text-3xl font-semibold text-darkGreen dark:text-white md:text-6xl'>
          Creating beautiful screenshots
          <br />
          has
          <span className='relative z-[1]'>
            {' '}
            never been so easy
            <span className='absolute right-0 bottom-2 -z-[1] hidden h-4 w-[220px] bg-primary lg:block'></span>
          </span>
        </h1>

        <p className='mx-4 mt-4 w-[60%] text-lg text-darkGreen text-opacity-70 dark:text-white'>
          Capture, annotate, and share screenshots with just few buttons. Take a
          screenshot of anything on your screen and we’ll make it look amazing
          in seconds.
        </p>

        {/* sponsor */}

        <div className='mt-6'>
          <p className='text-sm text-darkGreen dark:text-white'>
            Used daily by members of
          </p>

          <ul className='grid place-items-center'>
            <div className='flex items-center mt-4 space-x-4'>
              {brands.map(brand => (
                <li
                  key={brand.name}
                  className='flex items-center space-x-2 text-sm'>
                  <img src={brand.image} alt={brand.name} className='w-6' />
                </li>
              ))}
            </div>
          </ul>
         
        </div>
      </article>
    </section>
  );
};

export default Hero;
