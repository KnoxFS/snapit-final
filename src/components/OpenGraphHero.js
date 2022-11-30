import Link from "next/link";
import useAuth from "hooks/useAuth";

import OpenGraphMaker from "./OpenGraphMaker";

const OpenGraphHero = () => {
  const { user } = useAuth();

  return (
    <section className="w-[90%] md:w-[80%] mx-auto my-12">
      <h2 className="text-gray-500 mb-6 font-semibold">Open Graph</h2>

      <header>
        <h1 className="text-white font-bold text-2xl">
          Design Open Graph images <br /> (without the hassle)
        </h1>

        <p className="text-gray-500 mt-4 md:w-[50%]">
          Your Open Graph Image is the graphical representation of your
          website's content and should be designed to encourage users to click
          on it and view more of your website's content. It is the most valuable
          graphic content you can create.
        </p>

        <Link href="/opengraph#maker">
          <a className="inline-block bg-green-400 mt-6 px-6 py-2 rounded-md text-white font-semibold hover:bg-green-500 transition">
            Try for free
          </a>
        </Link>
      </header>

      <OpenGraphMaker proMode={user?.isPro} />
    </section>
  );
};

export default OpenGraphHero;
