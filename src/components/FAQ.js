import { Disclosure } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const faq = [
  {
    question: 'What is Screenshots4all?',
    answer:
      "Screenshots4all is a software solution that helps you design beautiful screenshots and website mockups instantly and easily. It's simple to use, perfect for any level of experience, and provides a wide range of customization options.",
  },
  {
    question: 'Is Screenshots4all free?',
    answer:
      'Yes, Screenshots4all is completely free to use. There are some cool features which are available with a paid subscription.',
  },
  {
    question: 'Does Screenshots4all save my images on server?',
    answer:
      'Images are never stored on a server or sent to anyone, and all of the processing happens locally and in your browser. This means that your image is always private and confidential.',
  },
  {
    question: 'What is Screenshots4all Pro?',
    answer:
      "When you subscribe to Screenshots4all Pro, you'll be able to use some amazing features like tilt, custom text and watermarking (indicated by ⚡️).",
  },
  {
    question: 'Why should I enhance my screenshots?',
    answer:
      "Once you start using Screenshots4all, you'll see how easy it is to create beautiful and engaging screenshots. You can use Screenshots4all to add personality and life to your screenshots before you can share them with your audience. Perfect for creators, life coaches, bloggers etc. Just look around you, you'll see enhanced screenshots everywhere around you.",
  },
  {
    question: 'Do I need an account to use Screenshots4all?',
    answer:
      'No, only if you choose to take advantage of our paid features, you will need to create an account.',
  },
];

const FAQ = () => {
  return (
    <section
      className='mx-auto mt-[80px] sm:w-[90%] md:mt-[140px] md:max-w-[1280px]'
      id='faq'>
      <header className='pb-12 text-center text-darkGreen dark:text-white'>
        <h3 className='mb-4 text-3xl font-semibold md:text-5xl'>FAQs</h3>
      </header>

      <article className='space-y-4'>
        {faq.map((item, i) => (
          <Disclosure as='article' key={i}>
            <Disclosure.Button className='mx-auto flex w-[93%] items-center justify-between rounded-md bg-primary bg-opacity-30 py-6 px-6 text-darkGreen shadow-md dark:bg-opacity-10 dark:text-white md:w-full md:px-10 '>
              <p className='w-[80%] text-left text-lg font-bold'>
                {item.question}
              </p>

              <ChevronDownIcon className='h-8 w-8' />
            </Disclosure.Button>

            <Disclosure.Panel className='p-4'>
              <p className='text-darkGreen dark:text-white'>{item.answer}</p>
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </article>
    </section>
  );
};

export default FAQ;
