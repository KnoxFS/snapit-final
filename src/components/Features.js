import useAuth from "hooks/useAuth";

const features = [
  {
    icon: <img src="/feat-cards/frames.svg" className="md:w-56 w-36" />,
    title: "Add browser frames",
    description:
      "Our quick and easy-to-use tool lets you add Windows, Safari and more browser frames to any screenshot you take, making it easy to create beautiful screenshots.",
    id: 1,
  },
  {
    icon: <img src="/feat-cards/backgrounds.svg" className="md:w-56 w-36" />,
    title: "Apply beautiful backgrounds",
    description:
      "Snapit offers an extensive range of gradient backgrounds and image backgrounds to perfectly fit your browser mockups.",
    id: 2,
  },
  {
    icon: <img src="/feat-cards/media.svg" className="md:w-56 w-36" />,
    title: "Social media ready sizes",
    description:
      "With Snapit, you'll be able to export your image in a variety of sizes that are perfect for your social media content be it your twitter posts or instagram stories, we've got your back!",
    id: 3,
  },
  {
    icon: <img src="/feat-cards/screenshot.svg" className="md:w-56 w-36" />,
    title: "Capture screenshot from URL",
    description:
      "Capture screenshots from any website URL and load them onto the canvas blazingly fast.",
    id: 4,
  },
  {
    icon: <img src="/feat-cards/watermark.svg" className="md:w-56 w-36" />,
    title: "Add custom text and watermark",
    description:
      "You can add a custom title, subtitle text, and/or watermark to your content with just a few clicks. You can use this space to promote your website, your Twitter handle, or simply some simple text.",
    id: 5,
  },
  {
    icon: <img src="/feat-cards/instant.svg" className="md:w-56 w-36" />,
    title: "Instant customization and exports",
    description:
      "Snapit lets you automatically apply customizations you've made in the past, which saves you time. In addition, Snapit gives you shortcuts to export images instantly.",
    id: 6,
  },
];

const uses = [
  "Landing page assets",
  "Tweet images",
  "Changelog screenshots",
  "Product Hunt images",
  "Dribbble shots",
  "Blog assets",
  "App Store images",
  "Instagram posts",
  "Email newsletter",
  "Code snippets",
  "Open Graph images",
];

const Features = () => {
  const { user, setShowBuyPro } = useAuth();

  return (
    <section className="sm:w-[90%] md:max-w-[1280px] mx-auto md:mt-[140px] mt-[80px]" id="features">
      <header className="text-center text-white">
        <h3 className="md:text-5xl text-3xl font-semibold mb-4">Features</h3>
      </header>

      {/* grid */}
      <article className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-10 mx-6">
        {/* card */}
        {features.map((feature) => (
          <div key={feature.id}>
            <header className="flex justify-center items-center w-full h-64">
              {feature.icon}
            </header>

            <footer className="md:mt-3">
              <h4 className="text-xl text-white mb-3 font-bold">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </footer>
          </div>
        ))}
      </article>

      <article className="grid justify-center items-center gap-32 md:mt-[140px] min-h-72 mt-[80px]">
        <div className="rounded-md p-6 text-white h-full text-center">
          <h3 className="md:text-5xl text-3xl font-semibold mb-4">Tons of use cases</h3>

          <div className="w-full flex justify-center">
            <ul className="flex flex-wrap pt-3 justify-center items-center md:w-6/12">
              {uses.map((use) => (
                <li
                  className="my-2 mr-3 rounded-full border border-primary px-3 text-primary py-1 text-sm shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-green-400 hover:text-white select-none transition xs:"
                  key={use}
                >
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Features;
