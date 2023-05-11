import Link from 'next/link';

const InfoBanner = () => {
  return (
    <div className='text-center text-white font-bold p-2 bg-gradient-to-r from-black via-primary to-back'>
      <Link href='/templates'>
        <a className='text-xs md:text-sm'>
          Introducing Animated Screenshots - Record a website and save as Gif or MP4.
        </a>
      </Link>
    </div>
  );
};

export default InfoBanner;
