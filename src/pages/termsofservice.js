import Head from "components/Head";

import BuyPro from "components/BuyPro";
import useAuth from "hooks/useAuth";
import HeadOG from "components/HeadOG";

const TermsOfService = () => {
  const { showBuyPro, setShowBuyPro } = useAuth();

  return (
    <main className="mx-auto my-12 min-h-screen w-[90%] md:w-[80%]">
      <Head>
        <title>Screenshots4all - Privacy Policy</title>
        <meta
          name="description"
          content="By accessing the website www.screenshots4all.com you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        />
        <meta
          name="keywords"
          content="Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images"
        />
      </Head>

      <HeadOG
        title="Screenshots4all - Create beautiful screenshots and mockups so easily"
        description="By accessing the website www.Screenshots4all.com you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        url="https://www.Screenshots4all.com/termsofservice"
      />

      <div className="my-32">
        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          1. Terms
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          By accessing the website www.Screenshots4all.com you are agreeing to be bound by
          these terms of service, all applicable laws and regulations, and agree
          that you are responsible for compliance with any applicable local
          laws. If you do not agree with any of these terms, you are prohibited
          from using or accessing this site. The materials contained in this
          website are protected by applicable copyright and trademark law.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          2. Use License
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          a. Permission is granted to temporarily download one copy of the
          materials (information or software) on Screenshots4all's website for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title, and under this license you may not:
          i. modify or copy the materials; ii. use the materials for any
          commercial purpose, or for any public display (commercial or
          non-commercial); iii. attempt to decompile or reverse engineer any
          software contained on Screenshots4all's website; iv. remove any copyright or
          other proprietary notations from the materials; or v. transfer the
          materials to another person or "mirror" the materials on any other
          server. b. This license shall automatically terminate if you violate
          any of these restrictions and may be terminated by Screenshots4all at any time.
          Upon terminating your viewing of these materials or upon the
          termination of this license, you must destroy any downloaded materials
          in your possession whether in electronic or printed format. 
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          3. Disclaimer
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          a. The materials on Screenshots4all's website are provided on an 'as is' basis.
          Snapi makes no warranties, expressed or implied, and hereby disclaims
          and negates all other warranties including, without limitation,
          implied warranties or conditions of merchantability, fitness for a
          particular purpose, or non-infringement of intellectual property or
          other violation of rights. b. Further, Screenshots4all does not warrant or make
          any representations concerning the accuracy, likely results, or
          reliability of the use of the materials on its website or otherwise
          relating to such materials or on any sites linked to this site.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          4. Limitations
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          In no event shall Screenshots4all or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on Screenshots4all's website, even if Screenshots4all or a Screenshots4all
          authorized representative has been notified orally or in writing of
          the possibility of such damage. Because some jurisdictions do not
          allow limitations on implied warranties, or limitations of liability
          for consequential or incidental damages, these limitations may not
          apply to you.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          5. Accuracy of materials
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          The materials appearing on Screenshots4all website could include technical,
          typographical, or photographic errors. Screenshots4all does not warrant that
          any of the materials on its website are accurate, complete or current.
          Screenshots4all may make changes to the materials contained on its website at
          any time without notice. However Screenshots4all does not make any commitment
          to update the materials.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          6. Modifications
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
        Screenshots4all may revise these terms of service for its website at any time
          without notice. By using this website you are agreeing to be bound by
          the then current version of these terms of service.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          7. Marketing & Promotion
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          By creating an account on Passdropit.com, users agree and opt-in to
          receive periodic emails from Screenshots4all. Users can at all times, choose to
          unsubscribe from the mailinglist and choose not to receive emails from
          Screenshots4all anymore.
        </p>

        <h1 className="text-lg font-bold text-darkGreen dark:text-white">
          8. Governing Law
        </h1>

        <p className="mt-4 text-sm text-darkGreen dark:text-white md:text-lg">
          These terms and conditions are governed by and construed in accordance
          with the laws of The Netherlands and you irrevocably submit to the
          exclusive jurisdiction of the courts in that State or location.
        </p>
      </div>

      <BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    </main>
  );
};

export default TermsOfService;
