import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

export default async function handler(req, res) {
  const { plan, user_id } = req.query;

  if (plan.toLowerCase() === "lifetime") {
    const price_id = "price_1MQwdxE4EcK5n9JayQITodUS";

    if (req.method === "POST") {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: "payment",
        allow_promotion_codes: true,
        success_url: `${YOUR_DOMAIN}/api/onetime?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
        cancel_url: `${YOUR_DOMAIN}/`,
      });

      res.json({ session_url: session.url, session_id: session.id });
    }

  } else {
    const price_id =
    plan.toLowerCase() === "monthly"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

    if (req.method === "POST") {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: `${YOUR_DOMAIN}/api/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
        cancel_url: `${YOUR_DOMAIN}/`,
      });

      res.json({ session_url: session.url, session_id: session.id });
    }
  }
}
