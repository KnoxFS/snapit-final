import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

export default async function handler(req, res) {
  const { subscription_id } = req.query;

  var splitVal = subscription_id.split('.');
  if (splitVal.length == 0) {
    splitVal = subscription_id.split('_');
  }

  if (splitVal[0] == 'GPA') {
    res
        .status(200)
        .json({ active: 'checking'});
      return;
  } else {

    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    if (subscription.status === "active") {
      res
        .status(200)
        .json({ active: true, end: subscription.current_period_end });
      return;
    }

    res
      .status(200)
      .json({ active: false, message: "Subscription is not active." });
      return;
  }
}
