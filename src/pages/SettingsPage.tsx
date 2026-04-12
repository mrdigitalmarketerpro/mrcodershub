import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useAuthStore } from "@/stores/authStore";
import { usePlatformProfiles, useLinkPlatform, useUnlinkPlatform, useSync } from "@/hooks/usePlatformData";
import { updateProfile } from "@/lib/api";
import { Settings, Save, Check, RefreshCw, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const platformConfig = [
  { key: "leetcode", label: "LeetCode", color: "border-neon-orange/30", icon: "🟠" },
  { key: "gfg", label: "GeeksforGeeks", color: "border-neon-green/30", icon: "🟢" },
  { key: "hackerrank", label: "HackerRank", color: "border-neon-cyan/30", icon: "🔵" },
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { data: platforms, isLoading } = usePlatformProfiles();
  const linkPlatformMutation = useLinkPlatform();
  const unlinkPlatformMutation = useUnlinkPlatform();
  const syncMutation = useSync();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    username: "",
    college: "",
  });
  const [handles, setHandles] = useState<Record<string, string>>({ leetcode: "", gfg: "", hackerrank: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        username: profile.username || "",
        college: profile.college || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (platforms) {
      const h: Record<string, string> = { leetcode: "", gfg: "", hackerrank: "" };
      for (const p of platforms) {
        h[p.platform] = p.handle;
      }
      setHandles(h);
    }
  }, [platforms]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, form);
      setProfile(updated);

      // Link/unlink platforms
      for (const [platform, handle] of Object.entries(handles)) {
        const existing = platforms?.find(p => p.platform === platform);
        if (handle.trim() && !existing) {
          await linkPlatform.mutateAsync({ platform, handle: handle.trim() });
        } else if (handle.trim() && existing && existing.handle !== handle.trim()) {
          await linkPlatform.mutateAsync({ platform, handle: handle.trim() });
        } else if (!handle.trim() && existing) {
          await unlinkPlatform.mutateAsync(platform);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error("Failed to save");
    }
    setSaving(false);
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
            { label: "Display Name", key: "display_name" },
            { label: "Username", key: "username" },
            { label: "College", key: "college" },
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Platform Connections</h3>
          <button
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {sync.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Sync All
          </button>
        </div>
        <div className="space-y-4">
          {platformConfig.map(pc => {
            const linked = platforms?.find(p => p.platform === pc.key);
            return (
              <div key={pc.key}>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <span>{pc.icon}</span> {pc.label} Handle
                  {linked && (
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${linked.sync_status === "success" ? "bg-neon-green/10 text-neon-green" : linked.sync_status === "failed" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                      {linked.sync_status === "success" ? "✓ Verified" : linked.sync_status}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    value={handles[pc.key]}
                    onChange={e => setHandles(prev => ({ ...prev, [pc.key]: e.target.value }))}
                    placeholder={`Your ${pc.label} username`}
                    className={`flex-1 px-3 py-2 rounded-lg bg-muted/50 border ${pc.color} text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors`}
                  />
                  {linked && (
                    <button
                      onClick={() => {
                        setHandles(prev => ({ ...prev, [pc.key]: "" }));
                        unlinkPlatform.mutate(pc.key);
                      }}
                      className="px-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {linked?.sync_error && (
                  <p className="text-xs text-destructive mt-1">{linked.sync_error}</p>
                )}
                {linked?.last_synced_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last synced: {new Date(linked.last_synced_at).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <motion.button
        onClick={handleSave}
        disabled={saving}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <AnimatePresence mode="wait">
          {saving ? (
            <motion.span key="saving" className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</motion.span>
          ) : saved ? (
            <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2"><Check className="w-4 h-4" /> Saved!</motion.span>
          ) : (
            <motion.span key="save" className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
