import { GlassCard } from "@/components/GlassCard";
import { topLeaderboard, leaderboardUsers, currentUser } from "@/lib/mockData";
import { Trophy, ArrowUp, ArrowDown, Minus, Medal } from "lucide-react";
import { motion } from "framer-motion";

const allUsers = [...topLeaderboard, ...leaderboardUsers].sort((a, b) => a.rank - b.rank);

export default function CollegeLeaderboard() {
  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">College Leaderboard</h1>
        <p className="text-muted-foreground text-sm">Galgotias University Rankings</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {[top3[1], top3[0], top3[2]].map((user, i) => {
          const order = [2, 1, 3][i];
          const colors = ["", "from-yellow-500 to-amber-600", "from-gray-400 to-gray-500", "from-amber-700 to-amber-800"];
          const sizes = ["", "h-32", "h-24", "h-20"];
          return (
            <GlassCard
              key={user.id}
              glow={order === 1 ? "purple" : "none"}
              delay={i * 0.1}
              className={`text-center ${order === 1 ? "md:-mt-4" : ""}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${colors[order]} flex items-center justify-center text-lg font-bold text-primary-foreground mb-2`}>
                {order === 1 ? "👑" : `#${order}`}
              </div>
              <p className="font-semibold text-foreground text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              <p className="text-lg font-bold text-primary mt-2">{user.xp.toLocaleString()} XP</p>
              <p className="text-xs text-muted-foreground">🔥 {user.streak} day streak</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Rest */}
      <GlassCard delay={0.3}>
        <div className="divide-y divide-border">
          {rest.map((user, i) => {
            const isCurrentUser = user.id === "1";
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`flex items-center gap-4 py-3 px-2 rounded-lg ${isCurrentUser ? "bg-primary/5 border border-primary/20" : ""}`}
              >
                <span className="w-8 text-center text-sm font-mono text-muted-foreground">#{user.rank}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrentUser ? "bg-gradient-to-br from-primary to-neon-cyan text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {user.name} {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
                <span className="text-sm font-bold text-foreground">{user.xp.toLocaleString()} XP</span>
                <div className="w-16 flex justify-end">
                  {user.change > 0 ? (
                    <span className="text-xs text-neon-green flex items-center gap-0.5"><ArrowUp className="w-3 h-3" />{user.change}</span>
                  ) : user.change < 0 ? (
                    <span className="text-xs text-destructive flex items-center gap-0.5"><ArrowDown className="w-3 h-3" />{Math.abs(user.change)}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground"><Minus className="w-3 h-3" /></span>
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
