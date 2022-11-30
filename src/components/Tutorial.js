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
    <section className="w-[90%] md:w-[80%] mx-auto" id="tutorial">
      <header className="text-center text-gray-500">
        <h3 className="text-3xl mb-4">
          How to design screenshots using Snapit?
        </h3>
        <p>Here are some of things you can do with Snapit!</p>
      </header>

      <article className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
        {steps.map((step) => (
          <div
            className="bg-[#282828] rounded-md relative mt-12 shadow-lg shadow-black/10"
            key={step.id}
          >
            <header className="bg-[#232323] rounded-t-md">
              <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 bg-[#282828] h-12 w-12 rounded-full flex justify-center items-center text-white font-bold border border-dashed border-gray-500">
                {step.id}
              </div>

              <h4 className="text-white text-center px-6 py-8">{step.title}</h4>
            </header>
            <div className="bg-[#282828] rounded-b-md">
              <p className="text-[#A0A0A0] p-6 text-center">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};

export default Tutorial;
