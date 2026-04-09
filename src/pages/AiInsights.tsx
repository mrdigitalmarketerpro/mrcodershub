import { GlassCard } from "@/components/GlassCard";
import { aiInsights, problemCategories } from "@/lib/mockData";
import { Brain, AlertTriangle, Lightbulb, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  weakness: AlertTriangle,
  suggestion: Lightbulb,
  alert: AlertTriangle,
  strength: Shield,
};

const colorMap = {
  weakness: "text-destructive bg-destructive/10",
  suggestion: "text-neon-blue bg-neon-blue/10",
  alert: "text-neon-orange bg-neon-orange/10",
  strength: "text-neon-green bg-neon-green/10",
};

export default function AiInsights() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-neon-purple" />
          AI Insights
        </h1>
        <p className="text-muted-foreground text-sm">Personalized recommendations powered by AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights.map((insight, i) => {
          const Icon = iconMap[insight.type];
          const color = colorMap[insight.type];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
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

      <GlassCard delay={0.4}>
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          Problem Category Breakdown
        </h3>
        <div className="space-y-3">
          {problemCategories.map((cat, i) => {
            const pct = (cat.solved / cat.total) * 100;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground font-mono">{cat.solved}/{cat.total}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      pct > 70 ? "bg-neon-green" : pct > 40 ? "bg-primary" : "bg-destructive"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
