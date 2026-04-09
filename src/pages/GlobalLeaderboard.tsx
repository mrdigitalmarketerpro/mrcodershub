import { GlassCard } from "@/components/GlassCard";
import { topLeaderboard, leaderboardUsers } from "@/lib/mockData";
import { Globe, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

const allUsers = [...topLeaderboard, ...leaderboardUsers].sort((a, b) => a.rank - b.rank);

export default function GlobalLeaderboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Globe className="w-6 h-6 text-neon-cyan" />
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm">All CodersHub users worldwide</p>
      </div>

      <GlassCard>
        <div className="divide-y divide-border">
          {allUsers.map((user, i) => {
            const isCurrentUser = user.id === "1";
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 py-3 px-2 rounded-lg ${isCurrentUser ? "bg-primary/5 border border-primary/20" : ""}`}
              >
                <span className={`w-8 text-center text-sm font-mono ${
                  user.rank <= 3 ? "text-neon-orange font-bold" : "text-muted-foreground"
                }`}>
                  {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : `#${user.rank}`}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrentUser ? "bg-gradient-to-br from-primary to-neon-cyan text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {user.name} {isCurrentUser && <span className="text-xs">(You)</span>}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">🔥 {user.streak}</span>
                <span className="text-sm font-bold text-foreground w-20 text-right">{user.xp.toLocaleString()} XP</span>
                <div className="w-12 flex justify-end">
                  {user.change > 0 ? (
                    <span className="text-xs text-neon-green flex items-center"><ArrowUp className="w-3 h-3" />{user.change}</span>
                  ) : user.change < 0 ? (
                    <span className="text-xs text-destructive flex items-center"><ArrowDown className="w-3 h-3" />{Math.abs(user.change)}</span>
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
