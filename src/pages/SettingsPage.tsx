import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { currentUser } from "@/lib/mockData";
import { Settings, Save, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    username: currentUser.username,
    email: currentUser.email,
    leetcode: currentUser.leetcode.handle,
    codeforces: currentUser.codeforces.handle,
    github: currentUser.github.username,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">Manage your profile and platform connections</p>
      </div>

      <GlassCard>
        <h3 className="font-semibold text-foreground mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name" },
            { label: "Username", key: "username" },
            { label: "Email", key: "email" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.1}>
        <h3 className="font-semibold text-foreground mb-4">Platform Connections</h3>
        <div className="space-y-4">
          {[
            { label: "LeetCode Handle", key: "leetcode", color: "border-neon-orange/30" },
            { label: "Codeforces Handle", key: "codeforces", color: "border-neon-blue/30" },
            { label: "GitHub Username", key: "github", color: "border-foreground/20" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg bg-muted/50 border ${f.color} text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors`}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      <motion.button
        onClick={handleSave}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Saved!
            </motion.span>
          ) : (
            <motion.span key="save" className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
