import { Stripe } from "stripe";

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

export default async function handler(req, res) {
  const { plan, user_id } = req.query;

  console.log(`[API/Pro] Request received: ${req.method} ${req.url}`);
  // Support both correct and typo'd variable names from Vercel
  const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECREY_KEY;

  console.log(`[API/Pro] Stripe key present: ${!!stripeKey}`);

  if (!stripeKey) {
    console.error("[API/Pro] Missing STRIPE_SECRET_KEY (or legacy STRIPE_SECREY_KEY) in environment variables.");
    return res.status(500).json({ error: "Server configuration error: Missing payment provider key." });
  }

  const stripe = new Stripe(stripeKey);

  if (plan.toLowerCase() == "lifetime") {
    const lifetime = "price_1MQ91dFt34MDQES9lN7iLH6t";

    if (req.method === "POST") {
      try {
        const session = await stripe.checkout.sessions.create({
          billing_address_collection: "auto",
          line_items: [
            {
              price: lifetime,
              quantity: 1,
            },
          ],
          mode: "payment",
          allow_promotion_codes: true,
          success_url: `${YOUR_DOMAIN}/api/onetime?success=true&session_id={CHECKOUT_SESSION_ID}&user_id=${user_id}`,
          cancel_url: `${YOUR_DOMAIN}/`,
        });

        res.json({ session_url: session.url, session_id: session.id });
      } catch (err) {
        console.error("[API/Pro] Stripe session creation failed:", err);
        res.status(500).json({ error: err.message });
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }

  } else {
    const price_id =
      plan.toLowerCase() === "monthly"
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_YEARLY_PRICE_ID;

    if (req.method === "POST") {
      try {
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
      } catch (err) {
        console.error("[API/Pro] Stripe session creation failed:", err);
        res.status(500).json({ error: err.message });
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  }
}
