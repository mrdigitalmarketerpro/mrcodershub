import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Zap, Trophy, Activity, Brain, Swords, TrendingUp, ArrowRight,
  Eye, BarChart3, Target, Users, Flame, ChevronDown, Sparkles,
  GitBranch, Code2, Shield
} from "lucide-react";

/* ─── Scroll-animated section wrapper ─── */
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Floating glow orb ─── */
function GlowOrb({ className }: { className?: string }) {
  return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />;
}

/* ─── Animated grid background ─── */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ─── Feature card with hover glow ─── */
function FeatureCard({ icon: Icon, title, description, color }: { icon: any; title: string; description: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative glass p-6 md:p-8 cursor-default"
    >
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color}`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace("shadow", "bg").replace(/shadow-.*$/, "")} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─── Pain point card ─── */
function PainCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative p-6 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-destructive" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

/* ─── Mock dashboard floating preview ─── */
function FloatingDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-auto max-w-4xl mt-12 md:mt-16"
      style={{ perspective: "1200px" }}
    >
      <div className="relative glass-strong p-4 md:p-6 neon-glow-purple">
        {/* Top bar mock */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-neon-orange/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
          </div>
          <div className="flex-1 mx-4 h-6 rounded-md bg-muted/40" />
        </div>

        {/* Content mock */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {/* Rank card */}
          <div className="glass p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">#4</div>
            <div className="text-xs text-muted-foreground">College Rank</div>
          </div>
          {/* XP card */}
          <div className="glass p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-neon-cyan" />
            </div>
            <div className="text-2xl font-bold text-foreground">2,450</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          {/* Streak card */}
          <div className="glass p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-neon-orange/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-neon-orange" />
            </div>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>

        {/* Chart mock */}
        <div className="mt-4 glass p-4 h-32 flex items-end gap-1">
          {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80, 95, 70].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.05, ease: "easeOut" }}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-primary/20"
            />
          ))}
        </div>
      </div>

      {/* Glow behind dashboard */}
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10" />
    </motion.div>
  );
}

/* ─── Rival comparison visual ─── */
function RivalVisual() {
  const rivals = [
    { name: "You", xp: 2450, rank: 4, highlight: true },
    { name: "Rahul S.", xp: 2520, rank: 3, highlight: false },
    { name: "Priya K.", xp: 2380, rank: 5, highlight: false },
  ];
  return (
    <div className="space-y-3">
      {rivals.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className={`flex items-center gap-4 p-4 rounded-xl border ${r.highlight ? "border-primary/40 bg-primary/10 neon-glow-purple" : "border-border bg-card/40"}`}
        >
          <div className={`text-lg font-bold w-8 ${r.highlight ? "text-primary" : "text-muted-foreground"}`}>#{r.rank}</div>
          <div className="flex-1">
            <div className={`font-semibold ${r.highlight ? "text-foreground" : "text-muted-foreground"}`}>{r.name}</div>
            <div className="w-full bg-muted/30 rounded-full h-2 mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.xp / 3000) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                className={`h-2 rounded-full ${r.highlight ? "bg-gradient-to-r from-primary to-neon-cyan" : "bg-muted-foreground/30"}`}
              />
            </div>
          </div>
          <div className={`font-mono font-bold text-sm ${r.highlight ? "text-primary" : "text-muted-foreground"}`}>{r.xp.toLocaleString()} XP</div>
        </motion.div>
      ))}
      <p className="text-sm text-center text-muted-foreground mt-2">
        You are <span className="text-neon-orange font-semibold">70 XP</span> behind Rahul
      </p>
    </div>
  );
}

/* ─── Insight card ─── */
function InsightCard({ icon: Icon, title, body, color }: { icon: any; title: string; body: string; color: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass p-6 group cursor-default">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}

/* ───────────────────── MAIN LANDING PAGE ───────────────────── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg">Coders<span className="text-gradient">Hub</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#competition" className="hover:text-foreground transition-colors">Competition</a>
          <a href="#insights" className="hover:text-foreground transition-colors">AI Insights</a>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6">
        <GridBackground />
        <GlowOrb className="w-[600px] h-[600px] bg-primary/8 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <GlowOrb className="w-[400px] h-[400px] bg-neon-cyan/6 bottom-1/4 right-1/4" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Coding Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight"
          >
            Stop Coding Blindly.
            <br />
            <span className="text-gradient">Start Competing.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Track, compare, and dominate your college coding ecosystem.
            Real-time performance analytics powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base flex items-center gap-2 hover:shadow-[0_0_30px_hsl(263_70%_58%/0.3)] transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted/30 transition-colors"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        <FloatingDashboard />

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <RevealSection className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Coding Without <span className="text-gradient">Direction</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Most students code in isolation — no benchmarks, no competition, no clarity on where they stand.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <PainCard icon={Eye} title="No Visibility" description="You can't see how you compare to peers or what to improve." />
          <PainCard icon={Target} title="No Direction" description="Random practice without understanding weak areas leads nowhere." />
          <PainCard icon={TrendingUp} title="No Motivation" description="Without competition and progress tracking, consistency fades away." />
        </div>
      </RevealSection>

      {/* ── SOLUTION ── */}
      <RevealSection className="py-24 md:py-32 px-6 relative">
        <GlowOrb className="w-[500px] h-[500px] bg-primary/5 top-0 right-0" />
        <div className="max-w-5xl mx-auto text-center mb-12 relative z-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">The Solution</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            See Where You Stand. <span className="text-gradient">Improve Faster.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            CodersHub connects to your coding platforms, tracks real performance, and ranks you among peers — all in real time.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { icon: Code2, title: "Connect Platforms", desc: "Link LeetCode, Codeforces & GitHub in seconds." },
            { icon: BarChart3, title: "Track Performance", desc: "Real-time analytics on problems solved, XP, and growth." },
            { icon: Users, title: "Compare & Compete", desc: "See your rank in college and globally. Challenge rivals." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ── FEATURES ── */}
      <RevealSection id="features" className="py-24 md:py-32 px-6 relative">
        <GridBackground />
        <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Everything You Need to <span className="text-gradient">Dominate</span>
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
          <FeatureCard icon={Trophy} title="Real-Time Leaderboard" description="Live rankings within your college and globally. See position changes instantly." color="neon-glow-purple" />
          <FeatureCard icon={Activity} title="Activity Tracking" description="Every problem solved, every commit — tracked and converted to XP automatically." color="neon-glow-cyan" />
          <FeatureCard icon={Brain} title="AI Insights" description="Personalized analysis of your weak areas with actionable improvement suggestions." color="neon-glow-blue" />
          <FeatureCard icon={Swords} title="Rival System" description="Compare head-to-head with students near your rank. Know exactly what it takes to overtake." color="neon-glow-purple" />
        </div>
      </RevealSection>

      {/* ── COMPETITION ── */}
      <RevealSection id="competition" className="py-24 md:py-32 px-6 relative">
        <GlowOrb className="w-[400px] h-[400px] bg-neon-cyan/5 top-1/4 left-0" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Competition</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              You vs. <span className="text-gradient">Everyone</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              See exactly where you stand. Track your rank climb, XP gains, and how close you are to overtaking your rivals.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Your progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span className="text-muted-foreground">Rivals</span>
              </div>
            </div>
          </div>
          <RivalVisual />
        </div>
      </RevealSection>

      {/* ── AI INSIGHTS ── */}
      <RevealSection id="insights" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">AI-Powered</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Not Just Tracking. <span className="text-gradient">Smart Guidance.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes your patterns and gives targeted recommendations.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <InsightCard icon={Target} title="Weakness Detection" body="Identifies topics where you struggle and suggests focused practice." color="bg-destructive/10" />
          <InsightCard icon={TrendingUp} title="Growth Predictions" body="Forecasts your rank trajectory based on current momentum." color="bg-primary/10" />
          <InsightCard icon={Shield} title="Consistency Alerts" body="Notifies you when streaks are at risk or effort is dropping." color="bg-neon-orange/10" />
        </div>
      </RevealSection>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-32 px-6 relative">
        <GlowOrb className="w-[600px] h-[600px] bg-primary/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <RevealSection className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Join the Coding Competition <span className="text-gradient">Revolution.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Stop guessing. Start growing. Your rank awaits.
          </p>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-[0_0_40px_hsl(263_70%_58%/0.35)] transition-all duration-300"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">CodersHub</span>
          </div>
          <p>© 2026 CodersHub. Built for competitive coders.</p>
        </div>
      </footer>
    </div>
  );
}
