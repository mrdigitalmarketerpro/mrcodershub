import { GlassCard } from "@/components/GlassCard";
import { useAuthStore } from "@/stores/authStore";
import { usePlatformProfiles, useUserScore, useLeaderboard, useSync, useSnapshots } from "@/hooks/usePlatformData";
import { Zap, TrendingUp, Trophy, ArrowUp, ArrowDown, RefreshCw, Loader2, Link as LinkIcon } from "lucide-react";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Dashboard() {
  const profile = useAuthStore((s) => s.profile);
  const { data: platforms, isLoading: platformsLoading } = usePlatformProfiles();
  const { data: score, isLoading: scoreLoading } = useUserScore();
  const { data: leaderboard } = useLeaderboard();
  const { data: snapshots } = useSnapshots();
  const syncMutation = useSync();

  const linkedPlatforms = platforms?.filter(p => p.sync_status === "success") || [];
  const totalSolved = linkedPlatforms.reduce((s, p) => s + (p.problems_solved || 0), 0);
  const hasData = linkedPlatforms.length > 0;

  // Chart data from snapshots
  const chartData = (snapshots || [])
    .reduce((acc: { date: string; score: number }[], snap) => {
      const date = format(new Date(snap.captured_at), "MMM d");
      const existing = acc.find(a => a.date === date);
      if (existing) {
        existing.score += (snap.problems_solved || 0) * 2 + (snap.medium_solved || 0) * 3 + (snap.hard_solved || 0) * 5;
      } else {
        acc.push({ date, score: (snap.problems_solved || 0) * 2 + (snap.medium_solved || 0) * 3 + (snap.hard_solved || 0) * 5 });
      }
      return acc;
    }, [])
    .slice(-7);

  // Rivals: users near current rank
  const myRank = score?.global_rank || 999;
  const rivals = (leaderboard || [])
    .filter((u: any) => u.user_id !== profile?.user_id && Math.abs((u.global_rank || 999) - myRank) <= 3)
    .slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sync button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome, {profile?.display_name || "Coder"}</h2>
          <p className="text-xs text-muted-foreground">
            {hasData
              ? `Last synced: ${linkedPlatforms[0]?.last_synced_at ? format(new Date(linkedPlatforms[0].last_synced_at), "MMM d, h:mm a") : "Never"}`
              : "No data synced yet"}
          </p>
        </div>
        <button
          onClick={() => syncMutation.mutate(undefined)}
          disabled={syncMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {syncMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh Data
        </button>
      </div>

      {!hasData && !platformsLoading && (
        <GlassCard glow="purple">
          <div className="text-center py-6">
            <LinkIcon className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No coding profiles linked</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect your LeetCode, GFG, or HackerRank to see your stats</p>
            <Link to="/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Connect Profiles
            </Link>
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard glow="purple" className="md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-muted-foreground text-sm mb-1">Global Rank</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-5xl font-black text-gradient">
                {scoreLoading ? "—" : score?.global_rank ? `#${score.global_rank}` : "Unranked"}
              </span>
              {score?.rank_change !== undefined && score.rank_change !== 0 && (
                <span className={`text-sm font-medium mb-1 flex items-center ${score.rank_change > 0 ? "text-neon-green" : "text-destructive"}`}>
                  {score.rank_change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(score.rank_change)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{profile?.college || "—"}</p>
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{score?.weighted_score?.toLocaleString() || "0"}</p>
          <p className="text-xs text-muted-foreground mt-1">{score?.platforms_linked || 0} platform(s) linked</p>
        </GlassCard>

        <GlassCard delay={0.1}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span>Problems Solved</span>
          </div>
          <span className="text-3xl font-black text-neon-green">{totalSolved}</span>
          <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
        </GlassCard>
      </div>

      {/* Platform breakdown */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {linkedPlatforms.map((p, i) => (
            <GlassCard key={p.id} delay={0.15 + i * 0.05}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-foreground text-sm capitalize">{p.platform === "gfg" ? "GeeksforGeeks" : p.platform}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.sync_status === "success" ? "bg-neon-green/10 text-neon-green" : "bg-destructive/10 text-destructive"}`}>
                  {p.sync_status === "success" ? "✓ Synced" : p.sync_status}
                </span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Handle</span>
                  <span className="text-foreground font-mono">@{p.handle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solved</span>
                  <span className="text-foreground font-bold">{p.problems_solved}</span>
                </div>
                {p.contest_rating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contest Rating</span>
                    <span className="text-primary font-bold">{p.contest_rating}</span>
                  </div>
                )}
                {p.last_synced_at && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Updated {format(new Date(p.last_synced_at), "MMM d, h:mm a")}
                  </p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Chart + Rivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2" delay={0.2}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            Score History
          </h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(0, 0%, 5%)", border: "1px solid hsl(0, 0%, 15%)", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Sync your data to see trends
            </div>
          )}
        </GlassCard>

        <GlassCard delay={0.25}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-neon-cyan" />
            Nearby Rivals
          </h3>
          {rivals.length > 0 ? (
            <div className="space-y-2">
              {rivals.map((r: any) => (
                <div key={r.user_id} className="flex items-center gap-2 py-1.5">
                  <span className="text-xs font-mono text-muted-foreground w-8">#{r.global_rank || "—"}</span>
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                    {(r.profile?.display_name || "?").charAt(0)}
                  </div>
                  <span className="text-sm text-foreground flex-1 truncate">{r.profile?.display_name || "User"}</span>
                  <span className="text-xs font-mono text-primary">{Math.round(r.weighted_score)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Sync your data to see rivals</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
