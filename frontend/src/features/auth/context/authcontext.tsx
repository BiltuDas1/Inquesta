
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";

export interface User {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn {
      success
    }
  }
`;

interface IsLoggedInResponse {
  isLoggedIn: {
    success: boolean;
  };
}

const LOGOUT_MUTATION = gql`
  mutation logoutUser {
    logoutUser {
      success
      message
    }
  }
`;

interface LogoutUserResponse {
  logoutUser: {
    success: boolean;
    message: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);

    const handleSessionExpired = () => {
      setUser(null);
      localStorage.removeItem("user");
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<IsLoggedInResponse>(IS_LOGGED_IN, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!queryLoading && data && !data.isLoggedIn?.success) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [data, queryLoading]);

  useEffect(() => {
    if (error) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [error]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const [logoutUser] = useMutation<LogoutUserResponse>(LOGOUT_MUTATION);
  const logout = async () => {
    try {
      const response = await logoutUser();
      setUser(null);
      localStorage.removeItem("user");
      await client.clearStore();
      toast.success(
        response.data?.logoutUser?.message || "Logged out successfully",
      );
      navigate("/login");
    } catch (err: any) {
      setUser(null);
      localStorage.removeItem("user");
      await client.clearStore();
      navigate("/login");
      toast.error(err.message || "Failed to log out properly.");
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
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
