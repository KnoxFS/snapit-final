import { Tab } from '@headlessui/react';
import MobileTemplateMaker from 'components/MobileTemplateMaker';
import DesktopTemplateMaker from 'components/DesktopTemplateMaker';
import CodeTemplateMaker from 'components/CodeTemplateMaker';
import TweetTemplateMaker from "components/TweetTemplateMaker";
import AnimatedScreenshotMaker from 'components/AnimatedScreenshotMaker';
import KeyCapsMaker from 'components/KeyCapsMaker';
import { SettingsProvider } from 'hooks/use-settings';
import useAuth from 'hooks/useAuth';
import Head from 'components/Head';
import HeadOG from 'components/HeadOG';

const Templates = () => {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>Screenshots4all - free iphone, desktop, code snippet mockup tool</title>
        <meta
          name='description'
          content='Create beautiful images for your product, website and app screenshots. Templates lets you create iPhone mockups, desktop mockups, code snippet mockups in a breeze.'
        />

        <meta
          name='keywords'
          content='Screenshot tool, screenshot generator, iphone 14 mockup tool, free iphone mockup tool, free iphone 14 mockup tool, free macbook mockup tool, free app store mockup tool, free website mockup tool, screenshot generator.'
        />
      </Head>

      <HeadOG
        title='Screenshots4all - free iphone, desktop, code snippet mockup tool'
        description='Create beautiful images for your product, website and app screenshots. Templates lets you create iPhone mockups, desktop mockups, code snippet mockups in a breeze.'
        url='https://www.screenshots4all.com/templates'
      />

      <Tab.Group>
        <section className='mx-auto my-12 w-[90%] overflow-x-hidden md:w-[80%]'>
          <h2 className='mb-6 font-semibold text-darkGreen dark:text-white'>
          Screenshots4all Templates
          </h2>

          <Tab.List
            as='section'
            className='mt-12 mb-24 grid h-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4'>
            <Tab className='outline-none'>
              <article className='h-full rounded-md bg-primary bg-opacity-20 p-4 ui-selected:bg-primary dark:bg-opacity-10 dark:ui-selected:bg-primary'>
                <img
                  src='/MobileTemplate.png'
                  alt='Mobile Template'
                  className='w-full rounded-md'
                />

                <h3 className='my-4 text-xl font-bold text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Mobile Screenshots Mockup
                </h3>

                <p className='text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Create beautiful mockups for your mobile app screenshots with
                  this customizable template.
                </p>
              </article>
            </Tab>

            <Tab className='outline-none'>
              <article className='h-full rounded-md bg-primary bg-opacity-20 p-4 ui-selected:bg-primary dark:bg-opacity-10 dark:ui-selected:bg-primary'>
                <img
                  src='/DesktopTemplate.png'
                  alt='Mobile Template'
                  className='w-full rounded-md'
                />
                <h3 className='my-4 text-xl font-bold text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Desktop Screenshots Mockup
                </h3>

                <p className='text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Create beautiful mockups for your desktop app or website's
                  screenshots with this customizable template.
                </p>
              </article>
            </Tab>

            <Tab className='outline-none'>
              <article className='h-full rounded-md bg-primary bg-opacity-20 p-4 ui-selected:bg-primary dark:bg-opacity-10 dark:ui-selected:bg-primary'>
                <img
                  src='/CodeTemplate.png'
                  alt='Mobile Template'
                  className='w-full rounded-md'
                />

                <h3 className='my-4 text-xl font-bold text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Code Snippet Mockup
                </h3>

                <p className='text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Create beautiful code snippets for design resources with this
                  customizable template.
                </p>
              </article>
            </Tab>
            <Tab className='outline-none'>
              <article className='h-full rounded-md bg-primary bg-opacity-20 p-4 ui-selected:bg-primary dark:bg-opacity-10 dark:ui-selected:bg-primary'>
                <img
                  src='/DesktopTemplate.png'
                  alt='Screenshot Template'
                  className='w-full rounded-md'
                />
                <h3 className='my-4 text-xl font-bold text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Animated Screenshot Mockup
                </h3>
                <p className='text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Create Animated Screenshot or design resources with this
                  customizable template.
                </p>
              </article>
            </Tab>
            <Tab className='outline-none'>
              <article className='h-full rounded-md bg-primary bg-opacity-20 p-4 ui-selected:bg-primary dark:bg-opacity-10 dark:ui-selected:bg-primary'>
                <img
                  src='/KeyCaps.png'
                  alt='Screenshot Template'
                  className='w-full rounded-md'
                />

                <h3 className='my-4 text-xl font-bold text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Keyboard Shortcut Mockup
                </h3>

                <p className='text-darkGreen ui-selected:text-darkGreen dark:text-white'>
                  Create amazing keyboard shortcut images to share online with
                  anyone.
                </p>
              </article>
            </Tab>
            <Tab className="outline-none">
            <article className='bg-primary bg-opacity-10 p-4 rounded-md ui-selected:bg-primary h-full'>
                <img
                  src="/TweetTemplate.png"
                  alt="Screenshot Template"
                  className="w-full rounded-md"
                />

<h3 className='text-white ui-selected:text-darkGreen text-xl font-bold my-4'>
                  Twitter Screenshots Mockup
                </h3>

                <p className='text-white/90 ui-selected:text-darkGreen'>
                  Create amazing twitter images to share online with
                  anyone.
                </p>
              </article>
            </Tab>
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
          <Tab.Panel>
            <AnimatedScreenshotMaker proMode={true} />
          </Tab.Panel>
          <Tab.Panel>
            <SettingsProvider>
              <KeyCapsMaker proMode={true} />
            </SettingsProvider>
          </Tab.Panel>
          <Tab.Panel>
              <TweetTemplateMaker proMode={true} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Templates;
