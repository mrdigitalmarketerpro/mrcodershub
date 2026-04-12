import { GlassCard } from "@/components/GlassCard";
import { useSnapshots } from "@/hooks/usePlatformData";
import { Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ActivityFeed() {
  const { data: snapshots, isLoading } = useSnapshots();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const items = (snapshots || [])
    .sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Activity Feed
        </h1>
        <p className="text-muted-foreground text-sm">Your sync history and progress snapshots</p>
      </div>

      {items.length === 0 ? (
        <GlassCard>
          <p className="text-center text-muted-foreground py-8">No activity yet. Sync your coding profiles to see data here.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                  {item.platform === "leetcode" ? "🟠" : item.platform === "gfg" ? "🟢" : "🔵"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground capitalize">
                    {item.platform === "gfg" ? "GeeksforGeeks" : item.platform} sync — {item.problems_solved} problems
                  </p>
                  <p className="text-xs text-muted-foreground">{format(new Date(item.captured_at), "MMM d, yyyy h:mm a")}</p>
                </div>
                {item.contest_rating > 0 && (
                  <span className="text-sm font-mono font-bold text-primary">Rating: {item.contest_rating}</span>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
