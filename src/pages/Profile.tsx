import { GlassCard } from "@/components/GlassCard";
import { currentUser, monthlyXp } from "@/lib/mockData";
import { User, Github, Code, Award, Share2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Profile() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <GlassCard glow="purple" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
            <p className="text-muted-foreground text-sm">@{currentUser.username} • {currentUser.college}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentUser.badges.map(b => (
                <span key={b} className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary">{b}</span>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: currentUser.xp.toLocaleString(), icon: Zap, color: "text-primary" },
          { label: "College Rank", value: `#${currentUser.rank}`, icon: Award, color: "text-neon-cyan" },
          { label: "Problems Solved", value: currentUser.leetcode.solved + currentUser.codeforces.solved, icon: Code, color: "text-neon-green" },
          { label: "Day Streak", value: currentUser.streak, icon: () => <span className="text-lg">🔥</span>, color: "text-neon-orange" },
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

      {/* Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-neon-orange" />
            <span className="font-semibold text-foreground text-sm">LeetCode</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Handle</span><span className="text-foreground font-mono">{currentUser.leetcode.handle}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Solved</span><span className="text-foreground">{currentUser.leetcode.solved}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-neon-orange font-bold">{currentUser.leetcode.rating}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Contests</span><span className="text-foreground">{currentUser.leetcode.contests}</span></div>
          </div>
        </GlassCard>

        <GlassCard delay={0.25}>
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-neon-blue" />
            <span className="font-semibold text-foreground text-sm">Codeforces</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Handle</span><span className="text-foreground font-mono">{currentUser.codeforces.handle}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Solved</span><span className="text-foreground">{currentUser.codeforces.solved}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="text-neon-blue font-bold">{currentUser.codeforces.rating}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Contests</span><span className="text-foreground">{currentUser.codeforces.contests}</span></div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="flex items-center gap-2 mb-3">
            <Github className="w-5 h-5 text-foreground" />
            <span className="font-semibold text-foreground text-sm">GitHub</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Username</span><span className="text-foreground font-mono">{currentUser.github.username}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Repos</span><span className="text-foreground">{currentUser.github.repos}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Contributions</span><span className="text-neon-green font-bold">{currentUser.github.contributions}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Stars</span><span className="text-foreground">⭐ {currentUser.github.stars}</span></div>
          </div>
        </GlassCard>
      </div>

      {/* XP Growth */}
      <GlassCard delay={0.35}>
        <h3 className="font-semibold text-foreground mb-4">XP Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyXp}>
            <defs>
              <linearGradient id="xpGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0, 0%, 55%)', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'hsl(0, 0%, 5%)', border: '1px solid hsl(0, 0%, 15%)', borderRadius: 8, color: '#fff' }} />
            <Area type="monotone" dataKey="xp" stroke="hsl(263, 70%, 58%)" strokeWidth={2} fill="url(#xpGrowthGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
