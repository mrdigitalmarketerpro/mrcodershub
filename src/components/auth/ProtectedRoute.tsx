import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Zap } from "lucide-react";

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
