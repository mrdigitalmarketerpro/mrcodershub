import { Search, Zap, Medal, ChevronDown, Flame, Menu } from "lucide-react";
import { currentUser } from "@/lib/mockData";
import { motion } from "framer-motion";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm hover:border-primary/30 transition-colors w-40 md:w-64">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded font-mono hidden sm:inline">⌘K</kbd>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 text-neon-orange text-sm font-semibold">
          <Flame className="w-4 h-4" />
          <span>{currentUser.streak}</span>
        </div>

        {/* XP */}
        <motion.div
          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20"
          whileHover={{ scale: 1.02 }}
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs md:text-sm font-bold text-primary">{currentUser.xp.toLocaleString()}</span>
        </motion.div>

        {/* Rank */}
        <div className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
          <Medal className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs md:text-sm font-bold text-neon-cyan">#{currentUser.rank}</span>
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 hover:bg-muted/50 px-2 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center text-xs font-bold text-primary-foreground">
            {currentUser.name.charAt(0)}
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
}