import NextHead from "next/head";

const HeadOG = ({ title, description, image, url }) => {
  return (
    <NextHead>
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />

      <meta
        content={image || "https://www.screenshots4all.com/og-image.png"}
        name="twitter:image:src"
      />

      <meta content="website" property="og:type" />
      <meta content={url} property="og:url" />
      <meta content="Screenshots4all" property="og:site_name" />

      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta
        content={image || "https://www.screenshots4all.com/og-image.png"}
        property="og:image"
      />
    </NextHead>
  );
};

export default HeadOG;
