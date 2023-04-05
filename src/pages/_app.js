import InfoBanner from "components/InfoBanner";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

import "styles/globals.css";

import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

import AuthProvider from "context/authContext";
import Script from "next/script";

const singleUrls = ["/confirm-email"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Removing the navbar from the sign in and sign up pages
  if (singleUrls.includes(router.pathname)) {
    return (
      <main className="bg-dark min-h-screen">
        <AuthProvider>
          <InfoBanner />

          <Component {...pageProps} />
        </AuthProvider>

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#212121",
              color: "#fff",
              textAlign: "center",
            },
          }}
        />
        {/* Pirsch analytics */}
        <Script
          defer
          type="text/javascript"
          src="https://api.pirsch.io/pirsch.js"
          id="pirschjs"
          data-code="siNM6FvgNGUmo3KEcHi1EVgPYXqCj5ve"
        />

        {/* Pirsch events */}
        <Script
          defer
          type="text/javascript"
          src="https://api.pirsch.io/pirsch-events.js"
          id="pirscheventsjs"
          data-code="siNM6FvgNGUmo3KEcHi1EVgPYXqCj5ve"
        />

        {/* Crisp */}
        <Script defer id="crisp">
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="f6280561-7f66-4544-a427-d495cc233d1e";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
        </Script>

        {/* Gtag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-247227689-1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-247227689-1');
        `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-247227689-2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-247227689-2');
        `}
        </Script>
      </main>
    );
  }

  return (
    <main className="bg-dark min-h-screen">
      <AuthProvider>
        <InfoBanner />

        <Navbar />

        <Component {...pageProps} />

        <Footer />
      </AuthProvider>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#212121",
            color: "#fff",
            textAlign: "center",
          },
        }}
      />
<Script
      defer
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid="08d34754-d627-4308-81ed-0b6be79c0888"
      data-blockingmode="auto"
      type="text/javascript" 
      />

      {/* Pirsch analytics */}
      <Script
        defer
        type="text/javascript"
        src="https://api.pirsch.io/pirsch.js"
        id="pirschjs"
        data-code="siNM6FvgNGUmo3KEcHi1EVgPYXqCj5ve"
      />

      {/* Pirsch events */}
      <Script
        defer
        type="text/javascript"
        src="https://api.pirsch.io/pirsch-events.js"
        id="pirscheventsjs"
        data-code="siNM6FvgNGUmo3KEcHi1EVgPYXqCj5ve"
      />
      

      {/* Crisp */}
      <Script defer id="crisp">
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="f6280561-7f66-4544-a427-d495cc233d1e";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>

      {/* Gtag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-247227689-1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-247227689-1');
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-247227689-2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-247227689-2');
        `}
      </Script>
    </main>
  );
}

export default MyApp;
