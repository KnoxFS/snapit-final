import Head from "components/Head";

const ConfirmEmail = () => {
  return (
    <>
      <Head>
        <title>Snapit - Confirm your email</title>
      </Head>

      <section className="flex h-[calc(100vh-2.5em)] justify-center items-center flex-col text-white text-center">
        <h1 className="font-bold text-2xl md:text-4xl">
          Please check you mail to confirm!
        </h1>
        <p className="text-gray-500 mt-6">
          We sent you a mail to confirm you account.
        </p>
      </section>
    </>
  );
};

export default ConfirmEmail;
