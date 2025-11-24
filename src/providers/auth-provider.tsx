// src/providers/auth-provider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import keycloak from "@/lib/keycloak";
// import type Keycloak from "keycloak-js";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | undefined;
  user: Keycloak.KeycloakProfile | undefined;
  login: () => void;
  register: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Keycloak.KeycloakProfile | undefined>(
    undefined
  );

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso", // Checks if user is logged in without redirecting immediately
          pkceMethod: "S256",
          // silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", // Optional for advanced setups
        });

        setIsAuthenticated(authenticated);

        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error("Keycloak Init Failed", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloak.login();
  const register = () => keycloak.register();
  const logout = () => keycloak.logout();
  const hasRole = (role: string) => !!keycloak.hasRealmRole(role);

  if (!isInitialized) {
    // Loading screen while connecting to Keycloak
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="text-sm text-zinc-400">
            Connecting to CSELOL Services...
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token: keycloak.token,
        user,
        login,
        register,
        logout,
        hasRole,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
