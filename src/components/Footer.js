import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#232323] p-8 mt-12 text-gray-500 flex flex-col md:flex-row justify-between items-center text-sm md:text-base">
      <p>Snapit - All rights reserved (c) 2023.</p>

      <ul className="space-x-4 md:space-x-6 hover:[&>*]:underline my-4 md:my-0">
        <Link href="">
          <a>About Us</a>
        </Link>
        <Link href="">
          <a>Terms of Service</a>
        </Link>
        <Link href="">
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
      
    </footer>
  );
};

export default Footer;
