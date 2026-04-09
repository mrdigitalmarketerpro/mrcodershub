import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });
      if (oauthError) {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
      // Browser will redirect to Google — no need to setLoading(false) on success
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative glass-strong p-8 md:p-12 w-full max-w-md text-center neon-glow-purple"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome to Coders<span className="text-gradient">Hub</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Sign in to start competing
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}

export function LogoutButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clear();
    navigate("/", { replace: true });
  };

  return (
    <button onClick={handleLogout} className={`flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ${className}`}>
      <LogOut className="w-4 h-4" />
      <span className="text-sm">Sign out</span>
    </button>
  );
}
