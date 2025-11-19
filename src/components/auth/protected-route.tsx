// src/components/auth/protected-route.tsx
import { Outlet } from "react-router-dom"; // Removed Navigate
import { useAuth } from "@/providers/auth-provider";

interface ProtectedRouteProps {
  role?: string;
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, hasRole, login } = useAuth();

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    // AUTOMATICALLY REDIRECT TO KEYCLOAK
    login();
    return null;
  }

  if (role && !hasRole(role)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-white">
        <h1 className="text-4xl font-bold text-red-500">403</h1>
        <p className="text-xl">Access Denied</p>
      </div>
    );
  }

  return <Outlet />;
}
