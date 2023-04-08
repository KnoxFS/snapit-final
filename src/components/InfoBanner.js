import Link from "next/link";

const InfoBanner = () => {
  return (
    <div className="text-center text-white font-bold p-2 bg-gradient-to-r from-black via-green-400 to-back">
      <Link href="https://kcaps.app/" target="_blank" rel="noreferrer">
        <a className="text-xs md:text-sm">
          Snapit has acquired KeyCaps. A tool to shortcut keys for your project! Try now for free.
        </a>
      </Link>
    </div>
  );
};

export default InfoBanner;
