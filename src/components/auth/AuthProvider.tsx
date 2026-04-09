import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading, clear } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" && !session) {
          clear();
          navigate("/", { replace: true });
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Defer to avoid Supabase auth deadlock
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setProfile(profile);
            setLoading(false);
          }, 0);
        } else {
          clear();
        }
      }
    );

    // 2. Then hydrate from existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
