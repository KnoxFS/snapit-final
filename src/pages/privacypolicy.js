import Head from "components/Head";

import BuyPro from "components/BuyPro";
import useAuth from "hooks/useAuth";
import HeadOG from "components/HeadOG";

const PrivacyPolicy = () => {
	const { showBuyPro, setShowBuyPro } = useAuth();

	return (
		<main className="w-[90%] md:w-[80%] mx-auto my-12 min-h-screen">
			<Head>
				<title>
          			Snapit - Privacy Policy
        		</title>
        		<meta
          			name="description"
          			content="Your privacy is important to us. It is Snapit's policy to respect your privacy regarding any information we may collect from you across our website"
        		/>
        		<meta
          			name="keywords"
          			content="Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images"
        		/>
      		</Head>

      		<HeadOG
        		title="Snapit - Create beautiful screenshots and mockups so easily"
        		description="Your privacy is important to us. It is Snapit's policy to respect your privacy regarding any information we may collect from you across our website."
        		url="https://www.snapit.gg/privacypolicy"
      		/>

      		<div className="text-center my-32">
      			<h1 className="text-lg md:text-6xl font-bold text-white">
            		Privacy Policy
          		</h1>

          		<p className="text-sm md:text-lg text-white mt-4">
            		Your privacy is important to us. It is Snapit's policy to respect your privacy regarding any information we may collect from you across our website, http://snapit.gg
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			We don’t ask for your personal information unless we truly need it. When we do, we’ll only collect what we need by fair and lawful means and, where appropriate, with your knowledge or consent. We’ll also let you know why we’re collecting it and how it will be used.
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			We don’t share your personal information with third-parties, except where required by law. We will only retain personal information for as long as necessary to provide you with a service.
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			We don’t store your personal information on our servers unless it’s required for providing a service to you. What we store, we’ll protect within commercially acceptable means to protect your personal information from loss or theft, as well as unauthorized access, disclosure, copying, use or modification.
          		</p>

          		<p className="text-sm md:text-lg text-white mt-4">
          			Images created by users on Snapit are never stored on a server or sent to anyone. All the image processing happens locally and in the users browser. All images created by the user are private and confidential.
          		</p>

          		<p className="text-sm md:text-lg text-white mt-4">
          			By creating an account Snapit.gg, users agree and opt-in to receive periodic emails from Snapit. Users can at all times, choose to unsubscribe from the mailinglist and choose not to receive emails from Snapit anymore.
          		</p>
          	</div>

      		<BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    	</main>
	)
}

export default PrivacyPolicy;
