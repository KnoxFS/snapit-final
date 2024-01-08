import { useEffect, useState } from 'react';

import ScreenshotMaker from 'components/ScreenshotMaker';
import Hero from 'components/Hero';
import Tutorial from 'components/Tutorial';
import FAQ from 'components/FAQ';
import Features from 'components/Features';
import Community from 'components/Community';
import Head from 'components/Head';
import HeadOG from 'components/HeadOG';

import BuyPro from 'components/BuyPro';

import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/router';
import DoMore from 'components/DoMore';

const ProBanner = ({ setShowProBanner }) => {
  useEffect(() => {
    setTimeout(() => {
      setShowProBanner(false);
    }, 1000 * 30);
  }, []);

  return (
    <article className='fixed bottom-0 z-50 w-full py-3 text-center bg-primary bg-opacity-10 text-darkGreen dark:bg-darkGreen dark:bg-opacity-100 dark:text-white'>
      <p className='text-sm'>
        You have successfully upgraded to Pro. Enjoy the benefits!
      </p>
    </article>
  );
};

const Index = () => {
  const { user, showBuyPro, setShowBuyPro } = useAuth();
  const [showProBanner, setShowProBanner] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { successPro } = router.query;
    if (Boolean(successPro)) setShowProBanner(true);
  }, []);

  return (
    <>
      <Head>
        <title>
          Screenshots4all - Free Screenshot Mockup Tool to create beautiful images.
        </title>
        <meta
          name='description'
          content='Creating beautiful screenshots and mockups has never been so easy. Capture from a URL, annotate, and share screenshots with just a few buttons.'
        />

        <meta
          name='keywords'
          content='Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images'
        />
      </Head>

      <HeadOG
        title='Screenshots4all - Free Screenshot Mockup Tool to create beautiful images.'
        description='Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images'
        url='https://www.Screenshots4all.com/'
      />

      <Hero />

      {showProBanner && <ProBanner setShowProBanner={setShowProBanner} />}

      {/* Screenshot tool placeholder */}
      {/* <div className="h-[600px] bg-zinc-800 w-[80%] mx-auto my-24"></div> */}
      <section className='mx-auto  sm:w-[90%]'>
        <ScreenshotMaker proMode={user?.isPro} />
      </section>

      <Tutorial />
      <FAQ />
      <Features />
      <Community />
      <DoMore />
      <BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    </>
  );
};

export default Index;
