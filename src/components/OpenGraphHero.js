import Link from 'next/link';
import useAuth from 'hooks/useAuth';

import OpenGraphMaker from './OpenGraphMaker';

const OpenGraphHero = () => {
  const { user } = useAuth();

  return (
    <section className='mx-auto my-12 w-[90%] md:w-[80%]'>
      <h2 className='mb-6 font-semibold text-bgGreen dark:text-white'>
        Open Graph
      </h2>

      <header>
        <h1 className='text-2xl font-bold text-bgGreen dark:text-white'>
          Design Open Graph images <br /> (without the hassle)
        </h1>

        <p className='mt-4 text-bgGreen dark:text-white md:w-[50%]'>
          Your Open Graph Image is the graphical representation of your
          website's content and should be designed to encourage users to click
          on it and view more of your website's content. It is the most valuable
          graphic content you can create.
        </p>

        <Link href='/opengraph#maker'>
          <a className='inline-block px-6 py-2 mt-6 font-semibold transition rounded-md bg-primary text-darkGreen hover:bg-green-500'>
            Try for free
          </a>
        </Link>
      </header>

      <OpenGraphMaker proMode={user?.isPro} />
    </section>
  );
};

export default OpenGraphHero;
