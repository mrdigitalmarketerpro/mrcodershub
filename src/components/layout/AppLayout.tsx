import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-r border-border">
            <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} embedded />
          </SheetContent>
        </Sheet>
        <div className="flex flex-col min-h-screen">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col min-h-screen"
      >
        <TopBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </motion.div>
    </div>
  );
}