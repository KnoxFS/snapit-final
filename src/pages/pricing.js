import PricingHero from "components/PricingHero";
import Applications from "components/Applications";
import Community from "components/Community";
import FAQ from "components/FAQ";
import Head from "components/Head";

import BuyPro from "components/BuyPro";
import useAuth from "hooks/useAuth";
import HeadOG from "components/HeadOG";

const Pricing = () => {
  const { showBuyPro, setShowBuyPro } = useAuth();

  return (
    <>
      <Head>
        <title>
        Screenshots4all - Create beautiful screenshots and mockups easily and free
        </title>
        <meta
          name="description"
          content="Snapit is absolutely free to use without any registration. Creators, entrepreneurs, programmers and many more use Screenshots4all to turn boring screenshots into a shareable one."
        />
        <meta
          name="keywords"
          content="Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images"
        />
      </Head>

      <HeadOG
        title="Screenshots4all - Create beautiful screenshots and mockups so easily"
        description="Screenshots4all is absolutely free to use without any registration. Creators, entrepreneurs, programmers and many more use Screenshots4all to turn boring screenshots into a shareable one."
        url="https://www.screenshots4all.com/pricing"
      />

      <PricingHero />
      <Applications />
      <Community />
      <FAQ />

      <BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    </>
  );
};

export default Pricing;
