import Link from 'next/link';
import { InstagramIcon } from 'ui/icons';
import { TwitterIcon } from 'ui/icons';
import { LinkedInIcon } from 'ui/icons';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { FaFacebook } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className='mt-8 flex flex-col items-center justify-evenly bg-primary bg-opacity-20 p-8 text-sm text-darkGreen text-opacity-70 dark:bg-opacity-10 dark:text-white md:flex-row md:text-base'
      style={{ justifyContent: 'space-evenly' }}>
      <p>Screenshots4all - All rights reserved (c) 2023.</p>

      <ul className='my-4 space-x-4 md:my-0 md:space-x-6 hover:[&>*]:underline'>
        <Link href='/aboutus'>
          <a>About Us</a>
        </Link>
        <Link href='/termsofservice'>
          <a>Terms of Service</a>
        </Link>
        <Link href='/privacypolicy'>
          <a>Privacy Policy</a>
        </Link>
        <Link href='/#tutorial'>
          <a>How to use</a>
        </Link>
        <Link href='/#faq'>
          <a>FAQ</a>
        </Link>
        <Link href='/#features'>
          <a>Features</a>
        </Link>
        <Link href='https://app.loopedin.io/snapit#/roadmap' target='_blank'>
          <a>Roadmap</a>
        </Link>
      </ul>

      <p>
        <ul
          className='my-4 space-x-4 md:my-0 md:space-x-6 hover:[&>*]:underline'
          style={{ display: 'flex' }}>
          <li>
            <a href='mailto:support@screenshots4all.com'>
              <EnvelopeIcon className='h-6 w-6 text-darkGreen dark:text-white' />{' '}
            </a>
          </li>
          <li>
            <a
              href='https://twitter.com/snapit_gg'
              target='_blank'
              rel='noreferrer'>
              <TwitterIcon className='h-6 w-6 text-darkGreen dark:text-white' />
            </a>
          </li>
          <li>
            <a
              href='https://www.instagram.com/snapit_gg/'
              target='_blank'
              rel='noreferrer'>
              <InstagramIcon className='h-6 w-6 text-darkGreen dark:text-white' />
            </a>
          </li>
          <li>
            <a
              href='https://www.linkedin.com/company/snapitgg'
              target='_blank'
              rel='noreferrer'>
              <LinkedInIcon className='h-6 w-6 text-darkGreen dark:text-white' />
            </a>
          </li>
          <li>
            <a
              href='https://www.youtube.com/watch?v=sQUBlJvv-zQ'
              target='_blank'
              rel='noreferrer'>
              <FaYoutube className='h-6 w-6 text-darkGreen dark:text-white' />{' '}
            </a>
          </li>
          <li>
            <a
              href='https://www.facebook.com/groups/910618990057673'
              target='_blank'
              rel='noreferrer'>
              <FaFacebook className='h-6 w-6 text-darkGreen dark:text-white' />{' '}
            </a>
          </li>
        </ul>
      </p>
    </footer>
  );
};

export default Footer;
