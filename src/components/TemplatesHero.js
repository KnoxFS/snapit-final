import Link from 'next/link';

const TemplatesHero = () => {
  return (
    <section className='w-[80%] mx-auto my-12'>
      <h2 className='text-gray-500 mb-6 font-semibold'>Screenshots4all Templates </h2>

      <header>
        <h1 className='text-white font-bold md:text-2xl md:w-1/2'>
          Quickly design mockups and images for App Store, Instagram Posts,
          Stories, Tweets and more with customizable templates!
        </h1>

        <Link href='/templates'>
          <a className='inline-block bg-primary mt-6 px-6 py-2 rounded-md text-white font-semibold hover:bg-green-500 transition'>
            Try for free
          </a>
        </Link>
      </header>
    </section>
  );
};

export default TemplatesHero;
