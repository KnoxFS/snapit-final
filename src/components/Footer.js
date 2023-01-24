import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#232323] p-8 mt-12 text-gray-500 flex flex-col md:flex-row justify-between items-center text-sm md:text-base">
      <p>Snapit - All rights reserved (c) 2022.</p>

      <ul className="space-x-4 md:space-x-6 hover:[&>*]:underline my-4 md:my-0">
        <Link href="/#tutorial">
          <a>How to use</a>
        </Link>
        <Link href="/#faq">
          <a>FAQ</a>
        </Link>
        <Link href="/#features">
          <a>Features</a>
        </Link>
        <Link href="/#community">
          <a>Community</a>
        </Link>
        <a href="https://www.producthunt.com/posts/snapit-927d6feb-16f6-42c2-9aa5-98de91904faf?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-snapit&#0045;927d6feb&#0045;16f6&#0045;42c2&#0045;9aa5&#0045;98de91904faf"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=376208&theme=dark" alt="Snapit - Creating&#0032;beautiful&#0032;screenshots&#0032;has&#0032;never&#0032;been&#0032;so&#0032;easy | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
      </ul>
      
      <p>Made with ❤️ in San Francisco.</p>
    </footer>
  );
};

export default Footer;
