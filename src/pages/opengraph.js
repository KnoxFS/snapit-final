import OpenGraphHero from "components/OpenGraphHero";

import Head from "components/Head";
import HeadOG from "components/HeadOG";

const OpenGraph = () => {
  return (
    <>
      <Head>
        <title>Screenshots4all - Free Open Graph Image Generator</title>
        <meta
          name="description"
          content="With Free Open Graph Image Generator, you can edit and experiment with your content - then preview how your webpage will look on Google, Facebook, and Twitter. Create Free Open Graph Image today."
        />

        <meta
          name="keywords"
          content="With Free Open Graph Image Generator, you can edit and experiment with your content - then preview how your webpage will look on Google, Facebook, and Twitter. Create Free Open Graph Image today."
        />
      </Head>

      <HeadOG
        title="Screenshots4all - Free Open Graph Image Generator."
        description="Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images"
        url="https://www.screenshots4all.com/opengraph"
      />

      <OpenGraphHero />
    </>
  );
};

export default OpenGraph;
