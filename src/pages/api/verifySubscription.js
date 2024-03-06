import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

export default async function handler(req, res) {
  const { subscription_id } = req.query;

  if (subscription_id.includes('GPA')) {

    await axios.get('https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=607904390113-7ldijsov15clj744qtvao177gemovcvd.apps.googleusercontent.com&redirect_uri=http://screenshots4all.com/callback&access_type=offline&scope=https://www.googleapis.com/auth/androidpublisher')
      .then(response => {
        // console.log(response);
        res
        .status(200)
        .data(response)
        .json({active: 'reached'});
      return;
      })
      .catch(error => {
        res
        .status(200)
        .json({ active: error});
      });
  } else {


    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    if (subscription.status === "active") {
      res
        .status(200)
        .json({ active: true, end: subscription.current_period_end });
      return;
    } else {

      res
        .status(200)
        .json({ active: false, message: "Subscription is not active." });
        return;
      }
  }
}
