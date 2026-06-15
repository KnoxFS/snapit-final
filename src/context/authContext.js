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

  // Guard to prevent concurrent getUser() calls during rapid auth events
  let getUserInFlight = false;

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
    // Prevent concurrent calls during rapid auth state changes
    if (getUserInFlight) {
      console.log('[Auth] getUser already in flight, skipping');
      return;
    }
    getUserInFlight = true;

    try {
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
          console.log(`[Auth] subscription_id found: '${subscription_id}'`);
          if (subscription_id == 'lifetime' || subscription_id == null) {
            data.isPro = true;
            console.log('[Auth] User is lifetime Pro');
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

            console.log(`[Auth] Verifying subscription via ${source}...`);

            // Verify subscription
            try {
              const verifyResponse = await fetch('/api/verifySubscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subscription_id,
                  source,
                  token,
                  product_id: productId
                })
              });

              console.log(`[Auth] Verification response status: ${verifyResponse.status}`);
              const { active, end, message } = await verifyResponse.json();
              console.log(`[Auth] Verification result: active=${active}, end=${end}, message=${message}`);

              if (active) {
                data.isPro = true;
                data.endPro = end;
                console.log('[Auth] User is Pro!');
              } else if (message) {
                console.warn(`[Auth] Verification failed for ${source}:`, message);
              }
            } catch (err) {
              console.error('[Auth] Verification error:', err);
            }
          }
        } else {
          console.log('[Auth] No subscription_id found in user row');
        }

        setUser(data);
        setLoading(false);
      } else {
        // user is null without error — happens during session transitions
        console.log('[Auth] No authenticated user found');
        setUser(null);
        setLoading(false);
      }
    } finally {
      getUserInFlight = false;
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
