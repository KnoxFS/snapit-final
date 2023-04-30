const steps = [
  {
    id: 1,
    title: "Add your screenshot",
    description:
      "You can either upload a screenshot, copy and paste (Ctrl C+V) a screenshot, or even capture it directly from a website blazingly fast.",
  },
  {
    id: 2,
    title: "Enhance your screenshot",
    description:
      "With the wide range of customization options, you can make your screenshot look exactly the way you want it to. Customize background gradient colors, add browser frames, shadows, text and much more.",
  },
  {
    id: 3,
    title: "Export your beautiful screenshot",
    description:
      "It's time to start using your beautiful screenshot! You can either copy and paste it (Ctrl C+V), or even just download it directly.",
  },
];

const Tutorial = () => {
  return (
    <section className="sm:w-[90%] md:max-w-[1280px] mx-auto md:mt-[140px] mt-[80px]" id="tutorial">
      <header className="text-center text-white">
        <h3 className="md:text-5xl text-3xl font-semibold mb-4">
          How to design screenshots using Snapit?
        </h3>
      </header>

      <article className="grid grid-cols-1 sm:w-full  md:w-8/12 lg:w-full md:mx-auto lg:grid-cols-3 gap-10 mt-6 mx-6">
        {steps.map((step) => (
          <div
            className="bg-primary bg-opacity-10 rounded-md relative mt-12 shadow-lg shadow-black/10"
            key={step.id}
          >
            <div className="absolute left-12 -top-6 transform -translate-x-1/2 bg-primary text-xl h-12 w-12 rounded-full flex justify-center items-center text-white font-bold border border-dashed border-gray-500">
              {step.id}
            </div>
            <div className="text-white rounded-sm">
              <h4 className=" px-6 pt-10 font-semibold">{step.title}</h4>
              <p className="p-6 font-light">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </article>
    </section >
  );
};

export default Tutorial;
