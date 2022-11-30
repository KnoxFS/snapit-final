import { Disclosure } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const faq = [
  {
    question: "What is Snapit?",
    answer:
      "Snapit is a web app that helps you design beautiful screenshots and website mockups instantly and easily. It's simple to use, perfect for any level of experience, and provides a wide range of customization options.",
  },
  {
    question: "Is Snapit free?",
    answer:
      "Yes, Snapit is completely free to use. There are some cool features which are available with a paid subscription.",
  },
  {
    question: "Does Snapit save my images on server?",
    answer:
      "Images are never stored on a server or sent to anyone, and all of the processing happens locally and in your browser. This means that your image is always private and confidential.",
  },
  {
    question: "What is Snapit Pro?",
    answer:
      "When you subscribe to Snapit Pro, you'll be able to use some amazing features like tilt, custom text and watermarking (indicated by ⚡️).",
  },
  {
    question: "Why should I enhance my screenshots?",
    answer:
      "Once you start using Snapit, you'll see how easy it is to create beautiful and engaging screenshots. You can use Snapit to add personality and life to your screenshots before you can share them with your audience. Perfect for creators, life coaches, bloggers etc. Just look around you, you'll see enhanced screenshots everywhere around you.",
  },
  {
    question: "Do I need an account to use Snapit?",
    answer:
      "No, only if you choose to take advantage of our paid features, you will need to create an account.",
  },
];

const FAQ = () => {
  return (
    <section className="w-[90%] md:w-[80%] mx-auto mt-12" id="faq">
      <header className="text-center text-gray-500 pb-12">
        <h3 className="text-3xl">FAQ</h3>
      </header>

      <article className="space-y-4">
        {faq.map((item, i) => (
          <Disclosure as="article" key={i}>
            <Disclosure.Button className="bg-[#282828] flex items-center justify-between w-full py-6 px-6 md:px-10 rounded-md text-gray-500 shadow-md">
              <p className="text-left w-[80%]">{item.question}</p>

              <PlusCircleIcon className="h-5 w-5" />
            </Disclosure.Button>

            <Disclosure.Panel className="p-4">
              <p className="text-gray-500">{item.answer}</p>
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </article>
    </section>
  );
};

export default FAQ;
