import Link from 'next/link';

const InfoBanner = () => {
  return (
    <div className='text-center text-white font-bold p-2 bg-gradient-to-r from-black via-primary to-back'>
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
