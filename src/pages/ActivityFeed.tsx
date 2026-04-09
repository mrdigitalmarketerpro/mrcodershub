import { GlassCard } from "@/components/GlassCard";
import { activityFeed } from "@/lib/mockData";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityFeed() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Activity Feed
        </h1>
        <p className="text-muted-foreground text-sm">Your recent coding activity</p>
      </div>

      <div className="space-y-3">
        {activityFeed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                {item.type === "solve" ? "✅" : item.type === "streak" ? "🔥" : item.type === "github" ? "🐙" : "🏆"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className="text-sm font-mono font-bold text-neon-green">+{item.xp} XP</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
