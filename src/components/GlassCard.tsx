import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "purple" | "blue" | "cyan" | "none";
  delay?: number;
}

export function GlassCard({ children, className, glow = "none", delay = 0 }: GlassCardProps) {
  const glowClass = {
    purple: "neon-glow-purple",
    blue: "neon-glow-blue",
    cyan: "neon-glow-cyan",
    none: "",
  }[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn("glass p-5", glowClass, className)}
    >
      {children}
    </motion.div>
  );
}
