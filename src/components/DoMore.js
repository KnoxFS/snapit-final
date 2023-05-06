import useAuth from 'hooks/useAuth';

const DoMore = () => {
  const { user, setShowBuyPro } = useAuth();

  return (
    <section className='mx-auto mt-[140px] w-full' id='features'>
      <div className="bg-[url('/bg-gradient.png')] shadow-md p-6 text-white bg-no-repeat bg-cover bg-center h-[440px] flex flex-col justify-center items-center">
        <div>
          <h3 className='text-5xl font-semibold mb-4'>
            Do more with Snapit Pro!
          </h3>
          <p className='mt-6 mb-10 text-base w-8/12'>
            With Snapit Pro, you can do more and even quicker with custom
            backgrounds & colors, images, better cropping and custom watermarks
            and presets make it easy to get started.
          </p>
          {user?.isPro ? (
            <p className='inline-block bg-primary py-1 px-6 rounded-full text-white'>
              You're already pro!
            </p>
          ) : (
            <button
              onClick={() => setShowBuyPro(true)}
              className='inline-block bg-white hover:bg-white/80 transition py-2 px-8 rounded-sm font-semibold text-darkGreen w-max justify-self-start'>
              Get Snapit Pro
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoMore;
