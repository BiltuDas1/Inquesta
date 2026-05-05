import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";


// ── Types ──
export interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;

}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// ── GraphQL Operations ──



// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const client = useApolloClient(); // Used to clear cache on logout

  // 1. Optimistic Load from LocalStorage (keeps UI snappy)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Network Verification (The Standard Approach)
  // This runs on app load. If the server says we are logged in, update state.
  // If the server returns an error (401), wipe the user and force them to login.
  useQuery(GET_ME, {
    fetchPolicy: "network-only", // Always ask the server, don't trust cache here
    onCompleted: (data) => {
      if (data?.me?.success && data?.me?.data) {
        setUser(data.me.data);
        localStorage.setItem("user", JSON.stringify(data.me.data));
      } else {
        // Token might be invalid or expired
        handleSessionExpired();
      }
      setLoading(false);
    },
    onError: () => {
      handleSessionExpired();
      setLoading(false);
    },
  });

  const [logoutMutation] = useMutation(LOGOUT_USER);

  // Helper to cleanly wipe session data
  const handleSessionExpired = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ── Actions ──
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // 1. Tell backend to destroy the session/cookie
      const { data } = await logoutMutation();

      if (data?.logout?.success) {
        toast.success(data.logout.message || "Logged out successfully");
      }
    } catch (error: any) {
      console.error("Logout failed on server:", error);
      toast.error(error.message || "Failed to log out properly.");
    } finally {
      // 2. Wipe local state
      handleSessionExpired();
      
      // 3. CRITICAL: Clear Apollo Cache so private data isn't exposed
      await client.resetStore(); 
      
      // 4. Redirect
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};