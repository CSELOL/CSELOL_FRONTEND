import { Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  role?: string;
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, hasRole, login } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 1. Not Logged In? Redirect to Keycloak
  if (!isAuthenticated) {
    // You can also use <Navigate to="/" /> here if you prefer not to auto-redirect
    // But for a dashboard, auto-redirecting to login is standard.
    login();
    return null;
  }

  // 2. Logged In but Wrong Role? (e.g. Player trying to access Admin)
  if (role && !hasRole(role)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-950 text-white">
        <ShieldAlert className="h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-zinc-400">
          You need the{" "}
          <span className="font-mono font-bold text-red-400">{role}</span> role
          to view this page.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // 3. Allowed
  return <Outlet />;
}
