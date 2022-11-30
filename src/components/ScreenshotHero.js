import Link from "next/link";
import ScreenshotMaker from "./ScreenshotMaker";

import useAuth from "hooks/useAuth";

const ScreenshotHero = () => {
  const { user } = useAuth();

  return (
    <section className="w-[80%] mx-auto my-12">
      <h2 className="text-gray-500 mb-6 font-semibold">Screenshot Maker</h2>

      <header>
        <h1 className="text-white font-bold text-2xl">
          Creating beautiful screenshots <br /> have never been so easy
        </h1>

        <p className="text-gray-500 mt-4 w-[40%]">
          Capture, annotate, and share screenshots with just few buttons. Take a
          screenshot of anything on your screen and we’ll make it look amazing
          in seconds.
        </p>

        <Link href="/screenshot#screenshots">
          <a className="inline-block bg-green-400 mt-6 px-6 py-2 rounded-md text-white font-semibold hover:bg-green-500 transition">
            Try for free
          </a>
        </Link>
      </header>

      <ScreenshotMaker proMode={user?.isPro} />
    </section>
  );
};

export default ScreenshotHero;
