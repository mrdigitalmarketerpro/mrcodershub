import { useEffect } from "react";
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

  useEffect(() => {
    // 1. Set up listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Defer profile fetch to avoid Supabase deadlock
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

    // 2. Then check existing session
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
