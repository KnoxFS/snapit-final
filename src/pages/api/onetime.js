import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECREY_KEY);

// Use service role key to bypass RLS — this runs server-side with no user session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { session_id, user_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log(`[Onetime] Updating user ${user_id} with session_id: ${session.id}`);

    // Save the one-time purchase to your database.
    const { error } = await supabase
      .from("users")
      .update({ subscription_id: "lifetime", session_id: session.id })
      .eq("user_id", user_id);

    if (error) {
      console.error("[Onetime] Failed to update user:", error);
    } else {
      console.log("[Onetime] User updated successfully");
    }

    res.redirect(307, "/?successPro=true");
  } catch (err) {
    console.error("[Onetime] Error:", err);
    res.redirect(307, "/?successPro=false");
  }
}
