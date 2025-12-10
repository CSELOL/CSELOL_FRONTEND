import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

// Login Modal Component
import { AuthModal } from "@/components/auth/auth-modal";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | undefined;
  user: User | null;
  userRoles: string[];
  login: () => void;
  register: () => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Fetch user role from users table (users.role column stores system-wide permissions)
  const fetchUserRoles = useCallback(async (userId: string) => {
    console.log("[Auth] Fetching role for supabase_id:", userId);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("supabase_id", userId)
        .single();

      if (error) {
        console.error("[Auth] Failed to fetch user role:", error);
        return [];
      }

      // Return role as array for compatibility with hasRole() checks
      const role = data?.role;
      const roles = role ? [role] : [];
      console.log("[Auth] Fetched roles:", roles);
      return roles;
    } catch (err) {
      console.error("[Auth] Error fetching role:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log("[Auth] Initializing...");
        
        // Create a promise that resolves the session
        const sessionPromise = supabase.auth.getSession();
        
        // Create a timeout promise to prevent hanging indefinitely
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Auth timeout")), 4000)
        );

        // Race them
        const { data } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (mounted) {
          const initialSession = data?.session;
          setSession(initialSession);
          setUser(initialSession?.user || null);

          if (initialSession?.user) {
            // Don't let role fetching block the UI for too long
            fetchUserRoles(initialSession.user.id).then(roles => {
              if (mounted) setUserRoles(roles);
            });
          }
        }
      } catch (error) {
        console.error("[Auth] Init warning:", error);
        // Even if error, we stop loading so user isn't stuck
      } finally {
        if (mounted) setIsInitialized(true);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`[Auth] State change: ${event}`);
        
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            // Fetch roles silently
            fetchUserRoles(newSession.user.id).then(roles => {
               if (mounted) setUserRoles(roles);
            });
          } else {
            setUserRoles([]);
          }

          if (event === "SIGNED_IN") {
            setShowAuthModal(false);
            // NOTE: We do NOT redirect here globally anymore to prevent loops.
            // Relied on the login component to redirect, or user navigation.
          }
          
          if (event === "SIGNED_OUT") {
            setUserRoles([]);
            setSession(null);
            setUser(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const login = useCallback(() => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  }, []);

  const register = useCallback(() => {
    setAuthModalMode("register");
    setShowAuthModal(true);
  }, []);

  const logout = useCallback(async () => {
    console.log("[Auth] Logout initiated...");
    try {
      await supabase.auth.signOut();
      console.log("[Auth] Signed out successfully");
      setSession(null);
      setUser(null);
      setUserRoles([]);
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
    }
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return userRoles.includes(role);
  }, [userRoles]);

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
        isAuthenticated: !!session,
        token: session?.access_token,
        user,
        userRoles,
        login,
        register,
        logout,
        hasRole,
        isInitialized,
      }}
    >
      {children}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
