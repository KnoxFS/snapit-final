import useAuth from "hooks/useAuth";

const PricingHero = () => {
  const { user, setShowBuyPro } = useAuth();

  return (
    <section className="w-[90%] md:w-[80%] mx-auto my-12">
      <h2 className="text-gray-500 mb-6 font-semibold">Pricing</h2>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <article>
          <h3 className="text-2xl text-white font-bold">
            Snapit is absolutely free to use, without any registration required.
            You can start using it right away.
          </h3>

          <div className="space-y-2 my-6 text-gray-500 text-sm md:text-base">
            <p>
              To make the most of our platform, some additional features are
              only accessible with an account - these are Pro features
              (indicated by ⚡️) which requires a monthly or yearly
              subscription.
            </p>
            <p>Snapit Pro is $5 a month , or $99 for a perpetual (lifetime) license.</p>

            <p>
              <b>
                Every time you purchase Snapit Pro , you also support our free
                plan - which helps keep Snapit running.
              </b>
            </p>
          </div>
        </article>

        <article className="flex md:justify-center items-center">
          {user?.isPro ? (
            <p className="bg-green-400 text-center py-2 px-4 rounded-md animate-bounce">
              Thanks for being a pro member and supporting this little venture!
            </p>
          ) : (
            <div className="md:text-center space-y-4">
              <button
                onClick={() => setShowBuyPro(true)}
                className="inline-block bg-green-400 p-6 text-2xl rounded-md text-white"
              >
                ⚡ Want Snapit Pro?
              </button>

              <p className="text-white">Just $5 a month.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default PricingHero;
