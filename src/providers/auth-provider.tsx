import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import keycloak from "@/lib/keycloak";
import type Keycloak from "keycloak-js";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | undefined;
  user: Keycloak.KeycloakProfile | undefined;
  login: () => void;
  register: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  logDebugInfo: () => void; // <--- NEW DEBUG HELPER
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Keycloak.KeycloakProfile | undefined>(
    undefined
  );
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
        });

        setIsAuthenticated(authenticated);

        if (authenticated) {
          try {
            const profile = await keycloak.loadUserProfile();
            setUser(profile);
          } catch (profileErr) {
            console.error("Failed to load user profile", profileErr);
          }
        }
      } catch (error) {
        console.error("Keycloak Init Failed", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initKeycloak();

    // Event Listener: Handle Token Expiration
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then((refreshed) => {
          if (refreshed) console.log("Token refreshed automatically");
        })
        .catch(() => {
          console.error("Session expired, logging out...");
          setIsAuthenticated(false);
          setUser(undefined);
          keycloak.clearToken();
        });
    };

    // Interval: Proactive Refresh every 60s
    const interval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(70).catch(() => {
          setIsAuthenticated(false);
          setUser(undefined);
          keycloak.clearToken();
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = () => keycloak.login();
  const register = () => keycloak.register();
  const logout = () => {
    setIsAuthenticated(false);
    setUser(undefined);
    keycloak.logout({ redirectUri: window.location.origin });
  };

  /**
   * Checks both Realm Roles AND Client Roles
   * This fixes the issue where 'admin' was hidden inside 'resource_access'
   */
  const hasRole = (role: string) => {
    if (!keycloak.tokenParsed) return false;

    // 1. Check Realm Roles
    const hasRealmRole = keycloak.realmAccess?.roles.includes(role);

    // 2. Check Client Roles (Dynamic based on env or hardcoded fallback)
    const clientId =
      import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "cselol-frontend";
    const hasClientRole =
      keycloak.resourceAccess?.[clientId]?.roles.includes(role);

    return !!(hasRealmRole || hasClientRole);
  };

  /**
   * Call this from any component to see exactly what Keycloak sees
   */
  const logDebugInfo = () => {
    console.group("🔐 Keycloak Debug Info");
    console.log("Authenticated:", keycloak.authenticated);
    console.log("User Profile:", user);
    console.log("Token (Parsed):", keycloak.tokenParsed); // <--- Matches your JWT dump
    console.log("Realm Roles:", keycloak.realmAccess?.roles);
    console.log("Resource Access:", keycloak.resourceAccess);
    console.log("Has 'admin' role?", hasRole("admin"));
    console.groupEnd();
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Connecting to CSELOL...</span>
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
        logDebugInfo,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
