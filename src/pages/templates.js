import { Tab } from "@headlessui/react";
import MobileTemplateMaker from "components/MobileTemplateMaker";
import DesktopTemplateMaker from "components/DesktopTemplateMaker";
import CodeTemplateMaker from "components/CodeTemplateMaker";
import TweetTemplateMaker from "components/TweetTemplateMaker";

import useAuth from "hooks/useAuth";
import Head from "components/Head";
import HeadOG from "components/HeadOG";

const Templates = () => {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Snapit - free iphone, desktop, code snippet mockup tool</title>
        <meta
          name="description"
          content="Create beautiful images for your product, website and app screenshots. Templates lets you create iPhone mockups, desktop mockups, code snippet mockups in a breeze."
        />

        <meta
          name="keywords"
          content="Screenshot tool, screenshot generator, iphone 14 mockup tool, free iphone mockup tool, free iphone 14 mockup tool, free macbook mockup tool, free app store mockup tool, free website mockup tool, screenshot generator."
        />
      </Head>

      <HeadOG
        title="Snapit - free iphone, desktop, code snippet mockup tool"
        description="Create beautiful images for your product, website and app screenshots. Templates lets you create iPhone mockups, desktop mockups, code snippet mockups in a breeze."
        url="https://www.snapit.gg/templates"
      />

      <Tab.Group>
        <section className="w-[90%] md:w-[80%] mx-auto my-12 overflow-x-hidden">
          <h2 className="text-gray-500 mb-6 font-semibold">Snapit Templates</h2>

          <Tab.List
            as="section"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-12 mb-24 gap-5 h-full"
          >
            <Tab className="outline-none">
              <article className="bg-[#232323] p-4 rounded-md ui-selected:bg-green-400 h-full">
                <img
                  src="/MobileTemplate.png"
                  alt="Mobile Template"
                  className="rounded-md w-full"
                />

                <h3 className="text-white text-xl font-bold my-4">
                  Mobile Screenshots Mockup
                </h3>

                <p className="text-gray-500 ui-selected:text-black">
                  Create beautiful mockups for your mobile app screenshots with
                  this customizable template.
                </p>
              </article>
            </Tab>

            <Tab className="outline-none">
              <article className="bg-[#232323] p-4 rounded-md ui-selected:bg-green-400 h-full">
                <img
                  src="/DesktopTemplate.png"
                  alt="Mobile Template"
                  className="rounded-md w-full"
                />

                <h3 className="text-white text-xl font-bold my-4">
                  Desktop Screenshots Mockup
                </h3>

                <p className="text-gray-500 ui-selected:text-black">
                  Create beautiful mockups for your desktop app or website's
                  screenshots with this customizable template.
                </p>
              </article>
            </Tab>

            <Tab className="outline-none">
              <article className="bg-[#232323] p-4 rounded-md ui-selected:bg-green-400 h-full">
                <img
                  src="/CodeTemplate.png"
                  alt="Mobile Template"
                  className="rounded-md w-full"
                />

                <h3 className="text-white text-xl font-bold my-4">
                  Code Snippet Mockup
                </h3>

                <p className="text-gray-500 ui-selected:text-black">
                  Create beautiful code snippets for design resources with this
                  customizable template.
                </p>
              </article>
            </Tab>

            // <Tab className="outline-none">
            //   <article className="bg-[#232323] p-4 rounded-md ui-selected:bg-green-400 h-full">
            //     <img
            //       src="/TweetTemplate.png"
            //       alt="Mobile Template"
            //       className="rounded-md w-full h-52 object-cover"
            //     />

            //     <h3 className="text-white text-xl font-bold my-4">
            //       Tweet Mockup
            //     </h3>

            //     <p className="text-gray-500 ui-selected:text-black">
            //       Create beautiful tweet mockups that are fully customizable for
            //       social media, emails and more.
            //     </p>
            //   </article>
            // </Tab>
          </Tab.List>
        </section>

        <Tab.Panels>
          <Tab.Panel>
            <MobileTemplateMaker proMode={user?.isPro} />
          </Tab.Panel>

          <Tab.Panel>
            <DesktopTemplateMaker proMode={user?.isPro} />
          </Tab.Panel>

          <Tab.Panel>
            <CodeTemplateMaker proMode={user?.isPro} />
          </Tab.Panel>

          // <Tab.Panel>
          //   <TweetTemplateMaker proMode={user?.isPro} />
          // </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Templates;
