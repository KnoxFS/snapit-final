import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

export default async function handler(req, res) {
  const { plan, user_id } = req.query;

  const price_id =
    plan.toLowerCase() === "Lifetime"
      ? process.env.STRIPE_LIFETIME_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

  if (req.method === "POST") {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: 9900,
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
