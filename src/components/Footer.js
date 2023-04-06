import Link from "next/link";
import { InstagramIcon } from "ui/icons";
import { TwitterIcon } from "ui/icons";
import { LinkedInIcon } from "ui/icons";
import { EnvelopeIcon } from "@heroicons/react/24/solid";


const Footer = () => {
  return (
    <footer className="bg-[#232323] p-8 mt-12 text-gray-500 flex flex-col md:flex-row items-center justify-evenly text-sm md:text-base" style={{justifyContent: "space-evenly"}}>
      <p>Snapit - All rights reserved (c) 2023.</p>

      <ul className="space-x-4 md:space-x-6 hover:[&>*]:underline my-4 md:my-0">
        <Link href="/aboutus">
          <a>About Us</a>
        </Link>
        <Link href="/termsofservice">
          <a>Terms of Service</a>
        </Link>
        <Link href="/privacypolicy">
          <a>Privacy Policy</a>
        </Link>
        <Link href="/#tutorial">
          <a>How to use</a>
        </Link>
        <Link href="/#faq">
          <a>FAQ</a>
        </Link>
        <Link href="/#features">
          <a>Features</a>
        </Link>
        <Link href="https://app.loopedin.io/snapit#/roadmap" target="_blank">
          <a>Roadmap</a>
        </Link>
      </ul>
  
      <p> 
        <ul className="space-x-4 md:space-x-6 hover:[&>*]:underline my-4 md:my-0" style={{display:"flex"}}>
          <li><a href="mailto:support@snapit.gg">
                <EnvelopeIcon className="w-6 h-6 text-white" /> </a>
          </li>
          <li><a href="https://twitter.com/snapit_gg" target="_blank" rel="noreferrer">
            <TwitterIcon className="w-6 h-6 text-white" />
            </a>
          </li>
          <li><a href="https://www.instagram.com/snapit_gg/" target="_blank" rel="noreferrer">
              <InstagramIcon className="w-6 h-6 text-white" />
            </a>
          </li>
          <li><a href="https://www.linkedin.com/company/snapitgg" target="_blank" rel="noreferrer">
              <LinkedInIcon className="w-6 h-6 text-white" />
            </a>
          </li>
        </ul>
        </p>
    </footer>
  );
};

export default Footer;
