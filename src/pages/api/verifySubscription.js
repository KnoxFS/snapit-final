import { Stripe } from "stripe";
import { google } from "googleapis";
import appleReceiptVerify from "node-apple-receipt-verify";

const stripe = new Stripe(process.env.STRIPE_SECREY_KEY);

// Apple Receipt Verify Config
appleReceiptVerify.config({
  secret: process.env.APPLE_SHARED_SECRET,
  environment: ["production", "sandbox"],
  excludeOldTransactions: true,
});

// Google Play Config
// expects GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in env
const androidPublisher = google.androidpublisher({
  version: "v3",
  auth: new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  }),
});

export default async function handler(req, res) {
  // Allow POST for larger payloads (long tokens)
  const { subscription_id, source, token, product_id } = req.method === 'POST' ? req.body : req.query;

  try {
    // 1. Google Verification
    if (source === 'google' || (subscription_id && subscription_id.startsWith('GPA'))) {
      if (!token || !product_id) {
         return res.status(200).json({ active: false, message: "Missing Google token or product ID" });
      }
      
      try {
        const response = await androidPublisher.purchases.subscriptions.get({
          packageName: process.env.ANDROID_PACKAGE_NAME || 'com.screenshots4all.app',
          subscriptionId: product_id, // This is the SKU (e.g. pro_monthly)
          token: token, // The purchase token
        });

        const purchase = response.data;
        // expiryTimeMillis is string string
        const expiryTime = parseInt(purchase.expiryTimeMillis);
        const isActive = expiryTime > Date.now();

        return res.status(200).json({ 
            active: isActive, 
            end: Math.floor(expiryTime / 1000) 
        });

      } catch (error) {
        console.error("Google verification error:", error);
        return res.status(200).json({ active: false, message: "Google verification failed" });
      }
    }

    // 2. Apple Verification
    if (source === 'apple') {
      if (!token) {
        return res.status(200).json({ active: false, message: "Missing Apple receipt data" });
      }

      try {
        // token is the base64 receipt data
        const products = await appleReceiptVerify.validate({
          receipt: token,
        });
        
        // Products is an array of valid purchases. If any are active, user is Pro.
        // We look for the latest one.
        const activeProduct = products.find(p => p.expirationDate > Date.now());
        
        if (activeProduct) {
             return res.status(200).json({ 
                active: true, 
                end: Math.floor(activeProduct.expirationDate / 1000) 
            });
        }
        
        return res.status(200).json({ active: false });

      } catch (error) {
          console.error("Apple verification error:", error);
          // If error is strictly validation failure
          return res.status(200).json({ active: false, message: "Apple verification failed" });
      }
    }

    // 3. Stripe Verification (Default)
    if (subscription_id && subscription_id.startsWith('sub_')) {
      const subscription = await stripe.subscriptions.retrieve(subscription_id);

      if (subscription.status === "active" || subscription.status === "trialing") {
        return res.status(200).json({ active: true, end: subscription.current_period_end });
      } else {
        return res.status(200).json({ active: false, message: "Subscription is not active." });
      }
    }
    
    // Fallback
    return res.status(200).json({ active: false, message: "Unknown subscription source" });

  } catch (err) {
    console.error("Verification Handler Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
