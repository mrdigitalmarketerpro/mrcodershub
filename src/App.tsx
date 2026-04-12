import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import CollegeLeaderboard from "./pages/CollegeLeaderboard";
import GlobalLeaderboard from "./pages/GlobalLeaderboard";
import ActivityFeed from "./pages/ActivityFeed";
import AiInsights from "./pages/AiInsights";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedApp({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedApp><Dashboard /></ProtectedApp>} />
            <Route path="/college-leaderboard" element={<ProtectedApp><CollegeLeaderboard /></ProtectedApp>} />
            <Route path="/global-leaderboard" element={<ProtectedApp><GlobalLeaderboard /></ProtectedApp>} />
            <Route path="/activity" element={<ProtectedApp><ActivityFeed /></ProtectedApp>} />
            <Route path="/ai-insights" element={<ProtectedApp><AiInsights /></ProtectedApp>} />
            <Route path="/profile" element={<ProtectedApp><Profile /></ProtectedApp>} />
            <Route path="/settings" element={<ProtectedApp><SettingsPage /></ProtectedApp>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
