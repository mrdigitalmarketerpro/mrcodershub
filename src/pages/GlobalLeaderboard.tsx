import { GlassCard } from "@/components/GlassCard";
import { useLeaderboard } from "@/hooks/usePlatformData";
import { useAuthStore } from "@/stores/authStore";
import { Globe, ArrowUp, ArrowDown, Minus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalLeaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const users = (leaderboard || []).filter((u: any) => u.platforms_linked > 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Globe className="w-6 h-6 text-neon-cyan" />
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm">Rankings based on real coding platform data</p>
      </div>

      {users.length === 0 ? (
        <GlassCard>
          <p className="text-center text-muted-foreground py-8">No ranked users yet. Be the first to sync your data!</p>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="divide-y divide-border">
            {users.map((entry: any, i: number) => {
              const isCurrentUser = entry.user_id === user?.id;
              const rank = entry.global_rank || i + 1;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 py-3 px-2 rounded-lg ${isCurrentUser ? "bg-primary/5 border border-primary/20" : ""}`}
                >
                  <span className={`w-8 text-center text-sm font-mono ${rank <= 3 ? "text-neon-orange font-bold" : "text-muted-foreground"}`}>
                    {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrentUser ? "bg-gradient-to-br from-primary to-neon-cyan text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {(entry.profile?.display_name || "?").charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {entry.profile?.display_name || "User"} {isCurrentUser && <span className="text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.platforms_linked} platform(s)</p>
                  </div>
                  <span className="text-sm font-bold text-foreground w-20 text-right">{Math.round(entry.weighted_score)}</span>
                  <div className="w-12 flex justify-end">
                    {entry.rank_change > 0 ? (
                      <span className="text-xs text-neon-green flex items-center"><ArrowUp className="w-3 h-3" />{entry.rank_change}</span>
                    ) : entry.rank_change < 0 ? (
                      <span className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3" />{Math.abs(entry.rank_change)}</span>
                    ) : (
                      <Minus className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
