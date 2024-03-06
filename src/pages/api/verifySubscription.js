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

    const {callbackdata} = fetch(
      'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=607904390113-7ldijsov15clj744qtvao177gemovcvd.apps.googleusercontent.com&redirect_uri=http://screenshots4all.com/callback&access_type=offline&scope=https://www.googleapis.com/auth/androidpublisher'
      ).then((rescall) => rescall.json());
        res
        .status(200)
        .json({ active: callbackdata, end: false });
        return;


    // const subscription = await stripe.subscriptions.retrieve(subscription_id);

    // if (subscription.status === "active") {
    //   res
    //     .status(200)
    //     .json({ active: true, end: subscription.current_period_end });
    //   return;
    // }
  }
}
