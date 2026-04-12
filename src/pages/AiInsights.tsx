import { GlassCard } from "@/components/GlassCard";
import { usePlatformProfiles, useUserScore } from "@/hooks/usePlatformData";
import { Brain, AlertTriangle, Lightbulb, TrendingUp, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Insight {
  id: string;
  type: "weakness" | "suggestion" | "strength" | "alert";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

function generateInsights(platforms: any[], score: any): Insight[] {
  const insights: Insight[] = [];

  if (!platforms || platforms.length === 0) {
    insights.push({
      id: "no-platforms",
      type: "alert",
      title: "No Platforms Linked",
      description: "Connect at least one coding platform to get personalized insights.",
      severity: "high",
    });
    return insights;
  }

  const totalSolved = platforms.reduce((s, p) => s + (p.problems_solved || 0), 0);
  const totalEasy = platforms.reduce((s, p) => s + (p.easy_solved || 0), 0);
  const totalMedium = platforms.reduce((s, p) => s + (p.medium_solved || 0), 0);
  const totalHard = platforms.reduce((s, p) => s + (p.hard_solved || 0), 0);

  if (totalHard < totalSolved * 0.1) {
    insights.push({
      id: "low-hard",
      type: "weakness",
      title: "Low Hard Problem Count",
      description: `Only ${totalHard} hard problems solved (${Math.round((totalHard / Math.max(totalSolved, 1)) * 100)}%). Try more hard problems to improve ranking.`,
      severity: "high",
    });
  }

  if (totalMedium > totalSolved * 0.4) {
    insights.push({
      id: "strong-medium",
      type: "strength",
      title: "Strong Medium Problem Solving",
      description: `${totalMedium} medium problems solved. You're building a solid foundation.`,
      severity: "low",
    });
  }

  const contestPlatforms = platforms.filter(p => p.contest_rating > 0);
  if (contestPlatforms.length === 0) {
    insights.push({
      id: "no-contests",
      type: "suggestion",
      title: "No Contest Participation",
      description: "Participating in contests can significantly boost your score and ranking.",
      severity: "medium",
    });
  } else {
    const maxRating = Math.max(...contestPlatforms.map(p => p.contest_rating));
    if (maxRating > 1500) {
      insights.push({
        id: "good-rating",
        type: "strength",
        title: "Strong Contest Rating",
        description: `Your best contest rating is ${maxRating}. Keep participating to climb higher.`,
        severity: "low",
      });
    }
  }

  const failedPlatforms = platforms.filter(p => p.sync_status === "failed");
  if (failedPlatforms.length > 0) {
    insights.push({
      id: "sync-failed",
      type: "alert",
      title: "Sync Issues Detected",
      description: `${failedPlatforms.map(p => p.platform).join(", ")} failed to sync. Check your handles in Settings.`,
      severity: "high",
    });
  }

  if (totalSolved > 300) {
    insights.push({
      id: "consistency",
      type: "strength",
      title: "Consistent Problem Solver",
      description: `${totalSolved} total problems solved across all platforms. Great consistency!`,
      severity: "low",
    });
  }

  return insights;
}

const iconMap = { weakness: AlertTriangle, suggestion: Lightbulb, alert: AlertTriangle, strength: Shield };
const colorMap = { weakness: "text-destructive bg-destructive/10", suggestion: "text-neon-blue bg-neon-blue/10", alert: "text-neon-orange bg-neon-orange/10", strength: "text-neon-green bg-neon-green/10" };

export default function AiInsights() {
  const { data: platforms, isLoading } = usePlatformProfiles();
  const { data: score } = useUserScore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const insights = generateInsights(platforms || [], score);

  // Category breakdown from real data
  const linkedPlatforms = (platforms || []).filter(p => p.sync_status === "success");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-neon-purple" />
          AI Insights
        </h1>
        <p className="text-muted-foreground text-sm">Personalized analysis based on your real data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.type];
          const color = colorMap[insight.type];
          return (
            <motion.div key={insight.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="h-full">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {linkedPlatforms.length > 0 && (
        <GlassCard delay={0.4}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            Difficulty Breakdown
          </h3>
          <div className="space-y-3">
            {linkedPlatforms.map((p) => {
              const total = (p.easy_solved || 0) + (p.medium_solved || 0) + (p.hard_solved || 0);
              if (total === 0) return null;
              return (
                <div key={p.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground capitalize">{p.platform === "gfg" ? "GeeksforGeeks" : p.platform}</p>
                  {[
                    { label: "Easy", count: p.easy_solved || 0, color: "bg-neon-green" },
                    { label: "Medium", count: p.medium_solved || 0, color: "bg-primary" },
                    { label: "Hard", count: p.hard_solved || 0, color: "bg-destructive" },
                  ].map(d => (
                    <div key={d.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{d.label}</span>
                        <span className="text-foreground font-mono">{d.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${total > 0 ? (d.count / total) * 100 : 0}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${d.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
