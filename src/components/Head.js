import NextHead from "next/head";

const Head = ({ children }) => {
  return (
    <NextHead key="main">
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      {children}
    </NextHead>
  );
};

export default Head;
