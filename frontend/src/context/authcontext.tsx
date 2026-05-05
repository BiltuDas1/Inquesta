import { gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// ── Types ──
export interface User {
  firstname: string;
  lastname: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// ── GraphQL Query ──
const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn {
      data {
        firstname
        lastname
        role
      }
    }
  }
`;

interface IsLoggedInResponse {
  isLoggedIn: {
    data: User | null;
  };
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();
  const client = useApolloClient();

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<IsLoggedInResponse>(IS_LOGGED_IN, {
    fetchPolicy: "network-only",
  });

  // Handle Success / Data Changes
  useEffect(() => {
    if (!queryLoading) {
      if (data?.isLoggedIn?.data) {
        setUser(data.isLoggedIn.data);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [data, queryLoading]);

  // Handle Errors
  useEffect(() => {
    if (error) {
      console.error("Auth verification failed:", error);
      setUser(null);
      setLoading(false);
    }
  }, [error]);

  // Call this function after a successful Login Mutation
  const login = (userData: User) => {
    setUser(userData);
  };

  // Call this function when the user clicks "Logout"
  const logout = async () => {
    try {
      setUser(null);

      // Clear Apollo Cache so the next user doesn't see cached private data
      await client.clearStore();

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out properly.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Custom Hook ──
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
