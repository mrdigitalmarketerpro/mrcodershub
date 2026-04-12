import { Search, Zap, Medal, Menu } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUserScore } from "@/hooks/usePlatformData";
import { motion } from "framer-motion";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const profile = useAuthStore((s) => s.profile);
  const { data: score } = useUserScore();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm hover:border-primary/30 transition-colors w-40 md:w-64">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded font-mono hidden sm:inline">⌘K</kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <motion.div className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20" whileHover={{ scale: 1.02 }}>
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs md:text-sm font-bold text-primary">{Math.round(score?.weighted_score || 0).toLocaleString()}</span>
        </motion.div>

        {score?.global_rank && (
          <div className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
            <Medal className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs md:text-sm font-bold text-neon-cyan">#{score.global_rank}</span>
          </div>
        )}

        <button className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center text-xs font-bold text-primary-foreground">
            {(profile?.display_name || "?").charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
}
