const steps = [
  {
    id: 1,
    title: 'Add your screenshot',
    description:
      'You can either upload a screenshot, copy and paste (Ctrl C+V) a screenshot, or even capture it directly from a website blazingly fast.',
  },
  {
    id: 2,
    title: 'Enhance your screenshot',
    description:
      'With the wide range of customization options, you can make your screenshot look exactly the way you want it to. Customize background gradient colors, add browser frames, shadows, text and much more.',
  },
  {
    id: 3,
    title: 'Export your beautiful screenshot',
    description:
      "It's time to start using your beautiful screenshot! You can either copy and paste it (Ctrl C+V), or even just download it directly.",
  },
];

const Tutorial = () => {
  return (
    <section
      className='mx-auto mt-[80px] sm:w-[90%] md:mt-[140px] md:max-w-[1280px]'
      id='tutorial'>
      <header className='text-center text-darkGreen dark:text-white'>
        <h3 className='mb-4 text-3xl font-semibold md:text-5xl'>
          How to design screenshots using Snapit?
        </h3>
      </header>

      <article className='grid grid-cols-1 gap-10 mx-6 mt-6 sm:w-full md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3'>
        {steps.map(step => (
          <div
            className='relative mt-12 rounded-md bg-primary bg-opacity-10 dark:shadow-lg dark:shadow-black/10'
            key={step.id}>
            <div className='absolute left-12 -top-6 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full border border-dashed border-primary bg-[#349268] text-xl font-bold text-white'>
              {step.id}
            </div>
            <div className='rounded-sm text-darkGreen dark:text-white'>
              <h4 className='px-6 pt-10 font-semibold '>{step.title}</h4>
              <p className='p-6 font-light'>{step.description}</p>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default Tutorial;
