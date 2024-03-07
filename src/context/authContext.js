import { createContext, useState, useEffect } from "react";

import { supabase } from "lib/supabase";
import { useRouter } from "next/router";

const initial = {
  user: null,
  setUser: () => {},

  loading: true,
  setLoading: () => {},

  showBuyPro: false,
  setShowBuyPro: () => {},
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
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      setUser(null);
      setLoading(false);
    }

    if (user) {
      // get user data from supabase
      const {
        data: { subscription_id, avatar_url, presets },
      } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const data = {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        avatar_url,
        isPro: false,
        endPro: null,
        presets,
      };

      if (subscription_id) {
        if (subscription_id == 'lifetime' || subscription_id == null) {
          data.isPro = true;
        } else {
          //  verify subscription in stripe
          const { active, end } = await fetch(
            `/api/verifySubscription?subscription_id=${subscription_id}`
          ).then((res) => res.json());

          if (active == 'google') {
            const { callbackData } = await fetch(
              'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=607904390113-7ldijsov15clj744qtvao177gemovcvd.apps.googleusercontent.com&redirect_uri=http://screenshots4all.com/callback&access_type=offline&scope=https://www.googleapis.com/auth/androidpublisher'
            ).then(response => {
              console.log(response);
            })
          }else {
            data.isPro = true;
            data.endPro = end;
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
  