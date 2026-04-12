import { GlassCard } from "@/components/GlassCard";
import { useLeaderboard } from "@/hooks/usePlatformData";
import { useAuthStore } from "@/stores/authStore";
import { Trophy, ArrowUp, ArrowDown, Minus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CollegeLeaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const college = profile?.college || "Galgotias University";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Filter by college
  const users = (leaderboard || [])
    .filter((u: any) => u.platforms_linked > 0 && u.profile?.college === college)
    .sort((a: any, b: any) => (b.weighted_score || 0) - (a.weighted_score || 0));

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">College Leaderboard</h1>
        <p className="text-muted-foreground text-sm">{college} Rankings</p>
      </div>

      {users.length === 0 ? (
        <GlassCard>
          <p className="text-center text-muted-foreground py-8">No ranked users from {college} yet</p>
        </GlassCard>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry: any, i: number) => {
                const order = [2, 1, 3][i];
                const colors = ["", "from-yellow-500 to-amber-600", "from-gray-400 to-gray-500", "from-amber-700 to-amber-800"];
                return (
                  <GlassCard key={entry.user_id} glow={order === 1 ? "purple" : "none"} delay={i * 0.1} className={`text-center ${order === 1 ? "md:-mt-4" : ""}`}>
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${colors[order]} flex items-center justify-center text-lg font-bold text-primary-foreground mb-2`}>
                      {order === 1 ? "👑" : `#${order}`}
                    </div>
                    <p className="font-semibold text-foreground text-sm">{entry.profile?.display_name || "User"}</p>
                    <p className="text-lg font-bold text-primary mt-2">{Math.round(entry.weighted_score)}</p>
                    <p className="text-xs text-muted-foreground">{entry.total_problems_solved} solved</p>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {rest.length > 0 && (
            <GlassCard delay={0.3}>
              <div className="divide-y divide-border">
                {rest.map((entry: any, i: number) => {
                  const isCurrentUser = entry.user_id === user?.id;
                  const rank = i + 4;
                  return (
                    <motion.div key={entry.user_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
                      className={`flex items-center gap-4 py-3 px-2 rounded-lg ${isCurrentUser ? "bg-primary/5 border border-primary/20" : ""}`}>
                      <span className="w-8 text-center text-sm font-mono text-muted-foreground">#{rank}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrentUser ? "bg-gradient-to-br from-primary to-neon-cyan text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {(entry.profile?.display_name || "?").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                          {entry.profile?.display_name || "User"} {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{Math.round(entry.weighted_score)}</span>
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
        </>
      )}
    </div>
  );
}
