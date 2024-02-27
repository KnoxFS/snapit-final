import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

export default async function handler(req, res) {
  const { subscription_id } = req.query;

  const subscription = await stripe.subscriptions.retrieve(subscription_id);

  console.log(subscription_id.includes("GPA"));

  if (subscription.status === "active") {
    res
      .status(200)
      .json({ active: true, end: subscription.current_period_end });
    return;
  }

  res
    .status(200)
    .json({ active: false, message: "Subscription is not active." });
}
