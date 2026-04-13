import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const platforms = [
  { key: "leetcode", label: "LeetCode", color: "border-neon-orange/40 focus:border-neon-orange", icon: "🟠" },
  { key: "gfg", label: "GeeksforGeeks", color: "border-neon-green/40 focus:border-neon-green", icon: "🟢" },
  { key: "hackerrank", label: "HackerRank", color: "border-neon-cyan/40 focus:border-neon-cyan", icon: "🔵" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [handles, setHandles] = useState<Record<string, string>>({ leetcode: "", gfg: "", hackerrank: "" });
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  const [college, setCollege] = useState("Galgotias University");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const linkedCount = Object.values(handles).filter(h => h.trim()).length;

  const handleSaveAndSync = async () => {
    if (step === 0) {
      if (!displayName.trim()) { toast.error("Please enter your display name"); return; }
      setStep(1);
      return;
    }

    if (linkedCount === 0) { toast.error("Link at least one coding platform"); return; }

    setSaving(true);
    setStep(2);

    try {
      // Save profile + link platforms via edge function
      const saveRes = await supabase.functions.invoke("save-profile", {
        body: {
          display_name: displayName.trim(),
          college: college.trim(),
          leetcode_handle: handles.leetcode.trim() || null,
          gfg_handle: handles.gfg.trim() || null,
          hackerrank_handle: handles.hackerrank.trim() || null,
          onboarded: true,
        },
      });
      if (saveRes.error) {
        console.error("save-profile error:", saveRes.error);
        throw new Error(saveRes.data?.error || saveRes.error.message || "Failed to save profile");
      }

      // Trigger sync
      const syncRes = await supabase.functions.invoke("sync-platform", { body: {} });
      if (syncRes.error) console.warn("Sync warning:", syncRes.data?.error || syncRes.error.message);

      // Refresh profile in store
      const { data: freshProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (freshProfile) setProfile(freshProfile);

      toast.success("Welcome to MRCodersHub!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error("Setup failed — you can retry from Settings");
      // Still mark onboarded so they aren't stuck
      await supabase.functions.invoke("save-profile", {
        body: { display_name: displayName.trim(), onboarded: true },
      });
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      if (p) setProfile(p);
      navigate("/dashboard", { replace: true });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-strong p-8 md:p-12 w-full max-w-lg neon-glow-purple"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          Welcome to MR<span className="text-gradient">CodersHub</span>
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          {step === 0 ? "Tell us about yourself" : step === 1 ? "Connect your coding profiles" : "Syncing your data..."}
        </p>

        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">College</label>
                <input value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college"
                  className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <button onClick={handleSaveAndSync} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <ArrowRight className="w-4 h-4" /> Continue
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              {platforms.map(p => (
                <div key={p.key}>
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <span>{p.icon}</span> {p.label} Handle
                  </label>
                  <input value={handles[p.key]} onChange={e => setHandles(prev => ({ ...prev, [p.key]: e.target.value }))}
                    placeholder={`Your ${p.label} username`}
                    className={`w-full px-3 py-2.5 rounded-lg bg-muted/50 border ${p.color} text-sm text-foreground focus:outline-none transition-colors`} />
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center">Link at least one platform to appear in rankings</p>
              <button onClick={handleSaveAndSync} disabled={saving || linkedCount === 0}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Link & Sync ({linkedCount} platform{linkedCount !== 1 ? "s" : ""})
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground font-medium">Fetching your coding data...</p>
              <p className="text-muted-foreground text-sm mt-1">This may take a moment</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
