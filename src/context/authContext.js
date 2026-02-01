import { createContext, useState, useEffect } from "react";

import { supabase } from "lib/supabase";
import { useRouter } from "next/router";

const initial = {
  user: null,
  setUser: () => { },

  loading: true,
  setLoading: () => { },

  showBuyPro: false,
  setShowBuyPro: () => { },
};

export const AuthContext = createContext(initial);

export default function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showBuyPro, setShowBuyPro] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          await getUser();
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
        }

        if (event === "PASSWORD_RECOVERY") {
          router.push("/update-password");
          setLoading(false);
        }

        if (!session) {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    console.log('[Auth] Getting user...');
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('[Auth] Error getting auth user:', error);
      setUser(null);
      setLoading(false);
      return;
    }

    if (user) {
      console.log('[Auth] Auth user found:', user.id, user.email);

      // get user data from supabase
      const {
        data: userRow,
        error: userRowError,
      } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userRowError) {
        console.error('[Auth] Error fetching user row:', userRowError);
        // Continue anyway with minimal user data
      }

      console.log('[Auth] User row data:', userRow);

      const { subscription_id, avatar_url, presets, twitter_handle, filestreams_account_id, filestreams_username, filestreams_status } = userRow || {};

      const data = {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        avatar_url,
        isPro: false,
        endPro: null,
        presets,
        twitter_handle,
        filestreams_account_id,
        filestreams_username,
        filestreams_status,
      };

      if (subscription_id) {
        if (subscription_id == 'lifetime' || subscription_id == null) {
          data.isPro = true;
        } else {
          // Determine verification source & payload
          let source = 'stripe';
          let token = null;
          let productId = null;

          const purchaseToken = userRow.purchase_token;
          // 'purchase_type' likely holds the SKU/Product ID (e.g. "monthly")
          const purchaseType = userRow.purchase_type;

          if (subscription_id.startsWith('sub_')) {
            source = 'stripe';
          }
          else if (subscription_id.startsWith('GPA')) {
            source = 'google';
            token = purchaseToken;
            productId = purchaseType;
          }
          else {
            // Fallback to Apple if not Stripe/Google
            source = 'apple';
            token = purchaseToken;
          }

          // Verify subscription
          try {
            const { active, end, message } = await fetch('/api/verifySubscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscription_id,
                source,
                token,
                product_id: productId
              })
            }).then((res) => res.json());

            if (active) {
              data.isPro = true;
              data.endPro = end;
            } else if (message) {
              console.warn(`[Auth] Verification failed for ${source}:`, message);
            }
          } catch (err) {
            console.error('[Auth] Verification error:', err);
          }
        }
      }

      setUser(user ? data : null);
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    getUser,
    showBuyPro,
    setShowBuyPro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
