import { Stripe } from "stripe";
import { supabase } from "lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

export default async function handler(req, res) {
  const { session_id, user_id } = req.query;

  const session = await stripe.checkout.sessions.retrieve(session_id);

  // Save the subscription to your database.
  await supabase
    .from("users")
    .update({subscription_id: 'lifetime', session_id: session.id })
    .eq("user_id", user_id);

  res.redirect(307, "/?successPro=true");
}
 