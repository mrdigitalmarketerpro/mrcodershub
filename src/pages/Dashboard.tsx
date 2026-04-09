import { GlassCard } from "@/components/GlassCard";
import { currentUser, leaderboardUsers, activityFeed, aiInsights, xpHistory } from "@/lib/mockData";
import { Zap, Flame, TrendingUp, Trophy, ArrowUp, ArrowDown, Brain, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const xpPercent = (currentUser.xp / currentUser.nextLevelXp) * 100;
  const rivals = leaderboardUsers;
  const above = rivals.filter(u => u.rank < currentUser.rank).slice(-3);
  const below = rivals.filter(u => u.rank > currentUser.rank).slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard glow="purple" className="md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-muted-foreground text-sm mb-1">Your Rank</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black text-gradient">#{currentUser.rank}</span>
              <span className="text-sm text-neon-green font-medium mb-1">↑ 2 this week</span>
            </div>
            <p className="text-xs text-muted-foreground">Level {currentUser.level} • {currentUser.college}</p>
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Experience</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-2">{currentUser.xp.toLocaleString()} XP</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-neon-cyan"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{currentUser.nextLevelXp - currentUser.xp} XP to Level {currentUser.level + 1}</p>
        </GlassCard>

        <GlassCard delay={0.1}>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Flame className="w-4 h-4 text-neon-orange" />
            <span>Streak</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-neon-orange">{currentUser.streak}</span>
            <span className="text-sm text-muted-foreground mb-1">days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Best: {currentUser.maxStreak} days</p>
        </GlassCard>
      </div>

      {/* Charts + Rivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2" delay={0.15}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              XP This Week
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={xpHistory}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'hsl(0, 0%, 5%)', border: '1px solid hsl(0, 0%, 15%)', borderRadius: 8, color: '#fff' }}
              />
              <Area type="monotone" dataKey="xp" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#xpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Rival System */}
        <GlassCard delay={0.2}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-neon-cyan" />
            Rivals
          </h3>
          <div className="space-y-2">
            {above.map(u => (
              <RivalRow key={u.id} user={u} direction="above" currentXp={currentUser.xp} />
            ))}
            <div className="border border-primary/30 rounded-lg p-2 bg-primary/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary w-6">#{currentUser.rank}</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground flex-1">You</span>
                <span className="text-xs font-mono text-primary">{currentUser.xp} XP</span>
              </div>
            </div>
            {below.map(u => (
              <RivalRow key={u.id} user={u} direction="below" currentXp={currentUser.xp} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Activity + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Link to="/activity" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activityFeed.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs">
                  {item.type === "solve" ? "✅" : item.type === "streak" ? "🔥" : item.type === "github" ? "🐙" : "🏆"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.message}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <span className="text-xs font-mono text-neon-green">+{item.xp} XP</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-neon-purple" />
              AI Insights
            </h3>
            <Link to="/ai-insights" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {aiInsights.slice(0, 3).map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    insight.severity === "high" ? "bg-destructive" : insight.severity === "medium" ? "bg-neon-orange" : "bg-neon-green"
                  }`} />
                  <span className="text-sm font-medium text-foreground">{insight.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function RivalRow({ user, direction, currentXp }: { user: any; direction: "above" | "below"; currentXp: number }) {
  const diff = Math.abs(user.xp - currentXp);
  return (
    <div className="flex items-center gap-2 py-1.5 group">
      <span className="text-xs font-mono text-muted-foreground w-6">#{user.rank}</span>
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
        {user.name.charAt(0)}
      </div>
      <span className="text-sm text-foreground flex-1 truncate">{user.name}</span>
      <span className={`text-xs font-mono ${direction === "above" ? "text-destructive" : "text-neon-green"}`}>
        {direction === "above" ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />}
        {diff} XP
      </span>
    </div>
  );
}
