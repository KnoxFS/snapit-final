import useAuth from 'hooks/useAuth';

const features = [
  {
    icon: <img src='/feat-cards/frames.svg' className='w-36 md:w-56' />,
    title: 'Add browser frames',
    description:
      'Our quick and easy-to-use tool lets you add Windows, Safari and more browser frames to any screenshot you take, making it easy to create beautiful screenshots.',
    id: 1,
  },
  {
    icon: <img src='/feat-cards/backgrounds.svg' className='w-36 md:w-56' />,
    title: 'Apply beautiful backgrounds',
    description:
      'Screenshots4all offers an extensive range of gradient backgrounds and image backgrounds to perfectly fit your browser mockups.',
    id: 2,
  },
  {
    icon: <img src='/feat-cards/media.svg' className='w-36 md:w-56' />,
    title: 'Social media ready sizes',
    description:
      "With Screenshots4all, you'll be able to export your image in a variety of sizes that are perfect for your social media content be it your twitter posts or instagram stories, we've got your back!",
    id: 3,
  },
  {
    icon: <img src='/feat-cards/screenshot.svg' className='w-36 md:w-56' />,
    title: 'Capture screenshot from URL',
    description:
      'Capture screenshots from any website URL and load them onto the canvas blazingly fast.',
    id: 4,
  },
  {
    icon: <img src='/feat-cards/watermark.svg' className='w-36 md:w-56' />,
    title: 'Add custom text and watermark',
    description:
      'You can add a custom title, subtitle text, and/or watermark to your content with just a few clicks. You can use this space to promote your website, your Twitter handle, or simply some simple text.',
    id: 5,
  },
  {
    icon: <img src='/feat-cards/instant.svg' className='w-36 md:w-56' />,
    title: 'Instant customization and exports',
    description:
      "Screenshots4all lets you automatically apply customizations you've made in the past, which saves you time. In addition, Screenshots4all gives you shortcuts to export images instantly.",
    id: 6,
  },
];

const uses = [
  'Landing page assets',
  'Tweet images',
  'Changelog screenshots',
  'Product Hunt images',
  'Dribbble shots',
  'Blog assets',
  'App Store images',
  'Instagram posts',
  'Email newsletter',
  'Code snippets',
  'Open Graph images',
];

const Features = () => {
  const { user, setShowBuyPro } = useAuth();

  return (
    <section
      className='mx-auto mt-[80px] sm:w-[90%] md:mt-[140px] md:max-w-[1280px]'
      id='features'>
      <header className='text-center text-darkGreen dark:text-white'>
        <h3 className='mb-4 text-3xl font-semibold md:text-5xl'>Features</h3>
      </header>

      {/* grid */}
      <article className='grid grid-cols-1 gap-10 mx-6 mt-6 md:grid-cols-3'>
        {/* card */}
        {features.map(feature => (
          <div key={feature.id}>
            <header className='flex items-center justify-center w-full h-64'>
              {feature.icon}
            </header>

            <footer className='md:mt-3'>
              <h4 className='mb-3 text-xl font-bold text-darkGreen dark:text-white'>
                {feature.title}
              </h4>
              <p className='text-gray-400'>{feature.description}</p>
            </footer>
          </div>
        ))}
      </article>

      <article className='min-h-72 mt-[80px] grid items-center justify-center gap-32 md:mt-[140px]'>
        <div className='h-full p-6 text-center rounded-md text-darkGreen dark:text-white'>
          <h3 className='mb-4 text-3xl font-semibold md:text-5xl'>
            Tons of use cases
          </h3>

          <div className='flex justify-center w-full'>
            <ul className='flex flex-wrap items-center justify-center pt-3 md:w-6/12'>
              {uses.map(use => (
                <li
                  className='px-3 py-1 my-2 mr-3 text-sm transition border rounded-full select-none xs: border-primary text-primary hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-lg dark:shadow-md'
                  key={use}>
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
