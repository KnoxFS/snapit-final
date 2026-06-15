import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECREY_KEY);

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_HOST_URL;

export default async function handler(req, res) {
  const { session_id, subscription_id } = req.body;

  console.log(`[Billing] Portal request: session_id=${session_id}, subscription_id=${subscription_id}`);

  try {
    let customerId = null;

    // Try to get customer from subscription_id first (most reliable)
    if (subscription_id && subscription_id.startsWith('sub_')) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscription_id);
        customerId = subscription.customer;
        console.log(`[Billing] Got customer from subscription: ${customerId}`);
      } catch (subErr) {
        console.error(`[Billing] Failed to retrieve subscription ${subscription_id}:`, subErr.message);
      }
    }

    // Fallback: try to get customer from checkout session
    if (!customerId && session_id) {
      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        customerId = checkoutSession.customer;
        console.log(`[Billing] Got customer from session: ${customerId}`);
      } catch (sessErr) {
        console.error(`[Billing] Failed to retrieve session ${session_id}:`, sessErr.message);
      }
    }

    if (!customerId) {
      console.error('[Billing] Could not determine Stripe customer ID');
      return res.status(400).json({ error: 'Could not find your Stripe customer. Please contact support.' });
    }

    // Create portal session
    const returnUrl = YOUR_DOMAIN;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    console.log(`[Billing] Portal session created for customer ${customerId}`);
    res.json({ session_url: portalSession.url, session_id: portalSession.id });

  } catch (err) {
    console.error('[Billing] Error creating portal session:', err.message);
    res.status(500).json({ error: 'Failed to create billing portal session.' });
  }
}
