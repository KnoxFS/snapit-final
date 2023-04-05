import Head from "components/Head";

import BuyPro from "components/BuyPro";
import useAuth from "hooks/useAuth";
import HeadOG from "components/HeadOG";

const AboutUs = () => {
	const { showBuyPro, setShowBuyPro } = useAuth();

	return (
		<main className="w-[90%] md:w-[80%] mx-auto my-12 min-h-screen">
			<Head>
				<title>
          			Snapit - About Us
        		</title>
        		<meta
          			name="description"
          			content="We at Snapit aim to create the go to web app for all your screenshots."
        		/>
        		<meta
          			name="keywords"
          			content="Screenshot tool, screenshot generator, gradient generator, website mockup, screenshot generator, beautiful screenshots, pretty screenshots, screenshot background, screenshots into shareable images"
        		/>
      		</Head>

      		<HeadOG
        		title="Snapit - Create beautiful screenshots and mockups so easily"
        		description="We at Snapit aim to create the go to web app for all your screenshots."
        		url="https://www.snapit.gg/aboutus"
      		/>

      		<div className="text-center my-32">
      			<h1 className="text-lg md:text-6xl font-bold text-white">
            		About Us
          		</h1>

          		<p className="text-sm md:text-lg text-white mt-4">
            		Hello and thank you for visiting Snapit!  Hope you like how easy we have made it to create beautiful screenshots. Snapit has been developed late 2022 by an independent developer in San Francisco. Soon after the launch the website as been acquired by Robin Kuipers, an internet entrepreneur from The Netherlands. He is since managing Snapit with a small team of freelance developers. 
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			We at Snapit aim to create the go to web app for all your screenshots. Snapit does not require technical skills from a user, meaning that anyone can make beautiful screenshots in seconds.
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			We are constantly working on improving Snapit and introducing new features.  In the comings months you can expect some really cool new functionalities, so stay tuned for more info!
          		</p>
          		
          		<p className="text-sm md:text-lg text-white mt-4">
          			If you like to reach out to us, or in need of technical support, you can contact us via support@snapit.gg or through direct chat on the website. We try to respond as quickly as possible.
          		</p>
          	</div>

      		<BuyPro open={showBuyPro} setOpen={setShowBuyPro} />
    	</main>
	)
}

export default AboutUs;
