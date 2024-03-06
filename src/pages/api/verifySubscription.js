import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

export default async function handler(req, res) {
  const { subscription_id } = req.query;

  if (subscription_id.includes('GPA')) {
    res
        .status(200)
        .json({ active: 'checking'});
      return;
  } else {

    const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "__Host-GAPS=1:uZHWhTUFDGpj-atVWCXZ3g8z_88fnA:hSxh_O5N_bM_zQjz");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=607904390113-7ldijsov15clj744qtvao177gemovcvd.apps.googleusercontent.com&redirect_uri=http://screenshots4all.com/callback&access_type=offline&scope=https://www.googleapis.com/auth/androidpublisher", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    // const subscription = await stripe.subscriptions.retrieve(subscription_id);

    // if (subscription.status === "active") {
    //   res
    //     .status(200)
    //     .json({ active: true, end: subscription.current_period_end });
    //   return;
    // }

    // res
    //   .status(200)
    //   .json({ active: false, message: "Subscription is not active." });
    //   return;
  }
}
