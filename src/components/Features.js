import useAuth from "hooks/useAuth";

import { InstantIcon } from "ui/icons";

const features = [
  {
    icon: <img src="/feat-cards/frames.svg" className="w-56" />,
    title: "Add browser frames",
    description:
      "Our quick and easy-to-use tool lets you add Windows, Safari and more browser frames to any screenshot you take, making it easy to create beautiful screenshots.",
    id: 1,
  },
  {
    icon: <img src="/feat-cards/backgrounds.svg" className="w-56" />,
    title: "Apply beautiful backgrounds",
    description:
      "Snapit offers an extensive range of gradient backgrounds and image backgrounds to perfectly fit your browser mockups.",
    id: 2,
  },
  {
    icon: <img src="/feat-cards/media.svg" className="w-56" />,
    title: "Social media ready sizes",
    description:
      "With Snapit, you'll be able to export your image in a variety of sizes that are perfect for your social media content be it your twitter posts or instagram stories, we've got your back!",
    id: 3,
  },
  {
    icon: <img src="/feat-cards/screenshot.svg" className="w-56" />,
    title: "Capture screenshot from URL",
    description:
      "Capture screenshots from any website URL and load them onto the canvas blazingly fast.",
    id: 4,
  },
  {
    icon: <img src="/feat-cards/watermark.svg" className="w-56" />,
    title: "Add custom text and watermark",
    description:
      "You can add a custom title, subtitle text, and/or watermark to your content with just a few clicks. You can use this space to promote your website, your Twitter handle, or simply some simple text.",
    id: 5,
  },
  {
    icon: InstantIcon,
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
    <section className="w-[90%] md:w-[80%] mx-auto mt-12" id="features">
      <header className="text-center text-gray-500">
        <h3 className="text-3xl mb-4">Features</h3>
        <p>Here are some of things you can do with Snapit!</p>
      </header>

      {/* grid */}
      <article className="grid grid-cols-1 md:grid-cols-3 mt-12 gap-10">
        {/* card */}
        {features.map((feature) => (
          <div key={feature.id}>
            <header className="bg-[#17181A] flex justify-center items-center w-full h-64 rounded-md border border-gray-500/20">
              {feature.icon}
            </header>

            <footer className="my-6">
              <h4 className="text-xl text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </footer>
          </div>
        ))}
      </article>

      <article className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-32 mt-20 min-h-72">
        <div className="bg-[#232323] rounded-md shadow-md p-6 text-gray-500 border-t-8 border-[#232323] h-full">
          <h3 className="text-2xl text-gray-300">Tons of use cases</h3>
          <p className="my-2">
            Snapit users are creating all sorts of amazing imagery with Snapit.
          </p>

          <ul className="flex flex-wrap pt-3">
            {uses.map((use) => (
              <li
                className="my-2 mr-3 bg-[#232323] rounded-full border border-gray-500/20 px-3 py-1 text-sm shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-green-400 hover:text-white select-none transition"
                key={use}
              >
                {use}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#232323] rounded-md shadow-md p-6 text-gray-500 border-t-8 border-green-400 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl text-gray-300">Do more with Snapit Pro!</h3>
            <p className="my-6 text-base">
              With Snapit Pro, you can do more and even quicker with custom
              backgrounds & colors, images, better cropping and custom
              watermarks and presets make it easy to get started.
            </p>
          </div>

          {user?.isPro ? (
            <p className="inline-block bg-green-400 py-1 px-6 rounded-full text-white">
              You're already pro!
            </p>
          ) : (
            <button
              onClick={() => setShowBuyPro(true)}
              className="inline-block bg-green-400 py-1 px-6 rounded-full text-white w-max"
            >
              Get Snapit Pro
            </button>
          )}
        </div>
      </article>
    </section>
  );
};

export default Features;
