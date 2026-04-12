import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Trophy, Globe, Activity, Brain, User, Settings, ChevronLeft, ChevronRight, Zap
} from "lucide-react";
import { LogoutButton } from "@/pages/LoginPage";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "College Board", icon: Trophy, path: "/college-leaderboard" },
  { label: "Global Board", icon: Globe, path: "/global-leaderboard" },
  { label: "Activity Feed", icon: Activity, path: "/activity" },
  { label: "AI Insights", icon: Brain, path: "/ai-insights" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar({ collapsed, onToggle, embedded }: { collapsed: boolean; onToggle: () => void; embedded?: boolean }) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`h-screen flex flex-col border-r border-border bg-sidebar overflow-hidden ${embedded ? "" : "fixed left-0 top-0 z-40"}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg text-foreground whitespace-nowrap"
            >
              MR<span className="text-gradient">CodersHub</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full"
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout + Collapse toggle */}
      <div className="border-t border-border">
        {!collapsed && (
          <div className="px-3 py-2">
            <LogoutButton />
          </div>
        )}
        <button
          onClick={onToggle}
          className="h-12 w-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
