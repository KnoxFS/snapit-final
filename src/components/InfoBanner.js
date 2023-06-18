import Link from 'next/link';

const InfoBanner = () => {
  return (
    <div className='p-2 text-center to-back bg-gradient-to-r from-white via-primary text-darkGreen dark:from-black dark:font-bold dark:text-white'>
      <Link href='/templates'>
        <a className='text-xs md:text-sm'>
          Introducing Code Snippets - A new way to share screenshots of your
          code.
        </a>
      </Link>
    </div>
  );
};

export default InfoBanner;
