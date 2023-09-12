import useAuth from 'hooks/useAuth';

const PricingHero = () => {
  const { user, setShowBuyPro } = useAuth();

  return (
    <section className='mx-auto my-12 w-[90%] md:w-[80%]'>
      <h2 className='mb-6 font-semibold text-darkGreen dark:text-white'>
        Pricing
      </h2>

      {/* grid */}
      <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
        <article>
          <h3 className='text-2xl font-bold text-darkGreen dark:text-white'>
            Snapit is absolutely free to use, without any registration required.
            You can start using it right away.
          </h3>

          <div className='my-6 space-y-2 text-sm text-darkGreen dark:text-white md:text-base'>
            <p>
              To make the most of our platform, some additional features are
              only accessible with an account - these are Pro features
              (indicated by{' '}
              <svg
                width='12'
                height='16'
                viewBox='0 0 10 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='inline-block'>
                <path
                  fill-rule='evenodd'
                  clipRule='evenodd'
                  d='M5.92851 0.0352685C6.07351 0.0849236 6.20017 0.183654 6.29009 0.317101C6.38001 0.450548 6.42849 0.611752 6.42848 0.777269V4.66616H9.28544C9.41609 4.6661 9.54425 4.70506 9.65598 4.7788C9.7677 4.85255 9.85872 4.95825 9.91911 5.08441C9.9795 5.21056 10.007 5.35234 9.9985 5.49431C9.99004 5.63629 9.94598 5.77301 9.87112 5.88961L4.87144 13.6674C4.78442 13.8031 4.6599 13.9051 4.51599 13.9585C4.37208 14.0118 4.21628 14.0138 4.07127 13.9641C3.92626 13.9144 3.7996 13.8156 3.70972 13.6821C3.61984 13.5485 3.57142 13.3873 3.57152 13.2217V9.33283H0.714558C0.583911 9.3329 0.45575 9.29394 0.344023 9.22019C0.232296 9.14645 0.141284 9.04074 0.080891 8.91459C0.0204981 8.78843 -0.00696171 8.64665 0.00149979 8.50468C0.00996128 8.36271 0.05402 8.22598 0.128881 8.10939L5.12856 0.331602C5.21571 0.196103 5.34026 0.0943893 5.48411 0.0412388C5.62797 -0.0119117 5.78364 -0.0137306 5.92851 0.0360463V0.0352685Z'
                  fill='#E6B917'></path>
              </svg>{' '}
              ) which requires a monthly or yearly subscription.
            </p>
            <p>
              Snapit Pro is $7,99 a month, $79 annual or $99 for a perpetual
              (lifetime) license.
            </p>

            <p>
              <b>
                Every time you purchase Snapit Pro , you also support our free
                plan - which helps keep Snapit running.
              </b>
            </p>
          </div>
        </article>

        <article className='flex items-center md:justify-center'>
          {user?.isPro ? (
            <p className='animate-bounce rounded-md bg-primary px-4 py-2 text-center'>
              Thanks for being a pro member and supporting this little venture!
            </p>
          ) : (
            <div className='space-y-4 md:text-center'>
              <button
                onClick={() => setShowBuyPro(true)}
                className='inline-flex items-center gap-2 rounded-md bg-primary p-6 text-2xl font-medium text-bgGreen hover:bg-green-500'>
                <svg
                  width='12'
                  height='16'
                  viewBox='0 0 10 14'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fill-rule='evenodd'
                    clipRule='evenodd'
                    d='M5.92851 0.0352685C6.07351 0.0849236 6.20017 0.183654 6.29009 0.317101C6.38001 0.450548 6.42849 0.611752 6.42848 0.777269V4.66616H9.28544C9.41609 4.6661 9.54425 4.70506 9.65598 4.7788C9.7677 4.85255 9.85872 4.95825 9.91911 5.08441C9.9795 5.21056 10.007 5.35234 9.9985 5.49431C9.99004 5.63629 9.94598 5.77301 9.87112 5.88961L4.87144 13.6674C4.78442 13.8031 4.6599 13.9051 4.51599 13.9585C4.37208 14.0118 4.21628 14.0138 4.07127 13.9641C3.92626 13.9144 3.7996 13.8156 3.70972 13.6821C3.61984 13.5485 3.57142 13.3873 3.57152 13.2217V9.33283H0.714558C0.583911 9.3329 0.45575 9.29394 0.344023 9.22019C0.232296 9.14645 0.141284 9.04074 0.080891 8.91459C0.0204981 8.78843 -0.00696171 8.64665 0.00149979 8.50468C0.00996128 8.36271 0.05402 8.22598 0.128881 8.10939L5.12856 0.331602C5.21571 0.196103 5.34026 0.0943893 5.48411 0.0412388C5.62797 -0.0119117 5.78364 -0.0137306 5.92851 0.0360463V0.0352685Z'
                    fill='#E6B917'></path>
                </svg>{' '}
                Want Snapit Pro?
              </button>

              <p className='text-darkGreen dark:text-white'>Just $7,99 a month.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default PricingHero;
