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

  // Fetch user roles from database
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to fetch user roles:", error);
        return [];
      }

      return data?.map((r) => r.role) || [];
    } catch (err) {
      console.error("Error fetching roles:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          const roles = await fetchUserRoles(initialSession.user.id);
          setUserRoles(roles);
        }
      } catch (error) {
        console.error("Auth Init Failed", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          const roles = await fetchUserRoles(newSession.user.id);
          setUserRoles(roles);
        } else {
          setUserRoles([]);
        }

        // Close modal on successful auth
        if (event === "SIGNED_IN") {
          setShowAuthModal(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const login = () => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  };

  const register = () => {
    setAuthModalMode("register");
    setShowAuthModal(true);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserRoles([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
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
