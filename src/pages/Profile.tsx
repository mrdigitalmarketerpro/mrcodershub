import { GlassCard } from "@/components/GlassCard";
import { useAuthStore } from "@/stores/authStore";
import { usePlatformProfiles, useUserScore, useSnapshots } from "@/hooks/usePlatformData";
import { User, Code, Award, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";

export default function Profile() {
  const profile = useAuthStore((s) => s.profile);
  const { data: platforms } = usePlatformProfiles();
  const { data: score } = useUserScore();
  const { data: snapshots } = useSnapshots();

  const linkedPlatforms = (platforms || []).filter(p => p.sync_status === "success");
  const totalSolved = linkedPlatforms.reduce((s, p) => s + (p.problems_solved || 0), 0);

  // Growth chart from snapshots
  const chartData = (snapshots || [])
    .reduce((acc: { date: string; solved: number }[], snap) => {
      const date = format(new Date(snap.captured_at), "MMM d");
      const existing = acc.find(a => a.date === date);
      if (existing) existing.solved += snap.problems_solved || 0;
      else acc.push({ date, solved: snap.problems_solved || 0 });
      return acc;
    }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <GlassCard glow="purple" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {(profile?.display_name || "?").charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{profile?.display_name || "User"}</h1>
            <p className="text-muted-foreground text-sm">@{profile?.username || "—"} • {profile?.college || "—"}</p>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Score", value: score?.weighted_score?.toLocaleString() || "0", icon: Zap, color: "text-primary" },
          { label: "Global Rank", value: score?.global_rank ? `#${score.global_rank}` : "—", icon: Award, color: "text-neon-cyan" },
          { label: "Problems Solved", value: totalSolved, icon: Code, color: "text-neon-green" },
          { label: "Platforms", value: linkedPlatforms.length, icon: User, color: "text-neon-orange" },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.05}>
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <stat.icon className="w-3.5 h-3.5" />
              {stat.label}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Platform details */}
      {linkedPlatforms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {linkedPlatforms.map((p, i) => (
            <GlassCard key={p.id} delay={0.2 + i * 0.05}>
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground text-sm capitalize">{p.platform === "gfg" ? "GeeksforGeeks" : p.platform}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Handle</span><span className="text-foreground font-mono">{p.handle}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Solved</span><span className="text-foreground">{p.problems_solved}</span></div>
                {p.contest_rating > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-primary font-bold">{p.contest_rating}</span></div>}
                {p.easy_solved > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Easy/Med/Hard</span><span className="text-foreground">{p.easy_solved}/{p.medium_solved}/{p.hard_solved}</span></div>}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Growth chart */}
      <GlassCard delay={0.35}>
        <h3 className="font-semibold text-foreground mb-4">Progress Over Time</h3>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profileGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="solved" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#profileGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            Sync your data to see progress
          </div>
        )}
      </GlassCard>
    </div>
  );
}
