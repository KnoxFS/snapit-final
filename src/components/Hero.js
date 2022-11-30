import Link from "next/link";

const brands = [
  {
    name: "Google",
    image: "/brands/google.png",
  },
  {
    name: "Slack",
    image: "/brands/slack.png",
  },
  {
    name: "Atlassian",
    image: "/brands/atlassian.png",
  },
  {
    name: "Dropbox",
    image: "/brands/dropbox.png",
  },
];

const Hero = () => {
  return (
    <section className="bg-dark w-[90%] md:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-24 justify-center items-center">
      <article>
        <h1 className="text-2xl md:text-4xl text-white font-bold">
          Creating beautiful <br /> screenshots has
          <br />
          <span className="text-green-400">never been so easy</span>
        </h1>

        <p className="text-md text-gray-300 mt-4">
          Capture, annotate, and share screenshots with just few buttons. Take a
          screenshot of anything on your screen and we’ll make it look amazing
          in seconds.
        </p>

        <Link href="#screenshots">
          <a className="inline-block mt-4 bg-green-400 py-2 px-6 rounded-md text-white hover:bg-green-500 transition">
            Try for free
          </a>
        </Link>

        {/* sponsor */}

        <div className="mt-6">
          <p className="text-sm text-gray-500">Used daily by members of</p>

          <ul className="text-lg text-gray-300 font-bold">
            <div className="flex items-center space-x-4 mt-6">
              {brands.map((brand) => (
                <li key={brand.name} className="flex items-center space-x-2 text-sm">
                  <img src={brand.image} alt={brand.name} className="w-6 grayscale" />

                  <p>{brand.name}</p>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </article>

      <article className="flex justify-end items-center">
        <div className="w-[540px] h-full bg-zinc-800 rounded-md border border-gray-500">
          <img
            src="/SnapitHeroGIF.gif"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </article>
    </section>
  );
};

export default Hero;
