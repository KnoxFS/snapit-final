const NotFound = () => {
  return (
    <section className="h-screen md:h-[calc(100vh-246px)] w-full flex flex-col justify-center items-center p-6 text-center md:p-0">
      <h1 className="text-white text-4xl font-bold">Page not found!</h1>
      <p className="text-white text-lg mt-4">
        The page you are looking for does not exist.
      </p>
    </section>
  );
};

export default NotFound;
