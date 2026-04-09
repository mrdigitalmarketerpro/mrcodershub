import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CollegeLeaderboard from "./pages/CollegeLeaderboard";
import GlobalLeaderboard from "./pages/GlobalLeaderboard";
import ActivityFeed from "./pages/ActivityFeed";
import AiInsights from "./pages/AiInsights";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/college-leaderboard" element={<AppLayout><CollegeLeaderboard /></AppLayout>} />
          <Route path="/global-leaderboard" element={<AppLayout><GlobalLeaderboard /></AppLayout>} />
          <Route path="/activity" element={<AppLayout><ActivityFeed /></AppLayout>} />
          <Route path="/ai-insights" element={<AppLayout><AiInsights /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
