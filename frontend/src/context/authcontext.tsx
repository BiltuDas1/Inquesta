// import { gql } from "@apollo/client";
// import { useApolloClient, useQuery, useMutation } from "@apollo/client/react";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// import toast from "react-hot-toast";
// import { useNavigate } from "react-router";


// // ── Types ──
// export interface User {
//   firstname: string;
//   lastname: string;
//   role: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (userData: User) => void;
//   logout: () => void;
// }

// // ── GraphQL Operations ──
// // We now ONLY ask for success to verify the session
// const IS_LOGGED_IN = gql`
//   query isLoggedIn {
//     isLoggedIn {
//       success
//     }
//   }
// `;

// const LOGOUT_MUTATION = gql`
//   mutation logoutUser {
//    logoutUser {
//       success
//       message
//     }
//   }
// `;

// interface IsLoggedInResponse {
//   isLoggedIn: {
//     success: boolean;
//   };
// }

// // Create the context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const client = useApolloClient();

//   const [logoutUser] = useMutation(LOGOUT_MUTATION);

//   // 1. Initial load from LocalStorage to keep UI fast
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);


//   const {
//     data,
//     loading: queryLoading,
//     error,
//   } = useQuery<IsLoggedInResponse>(IS_LOGGED_IN, {
//    fetchPolicy: "cache-and-network"
//   });

//   // Handle Success / Session Check
//   useEffect(() => {
//     if (!queryLoading) {
//       if (data?.isLoggedIn?.success) {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       } else {
//         setUser(null);
//         localStorage.removeItem("user");
//       }
//       setLoading(false);
//     }
//   }, [data, queryLoading]);

//   // Handle Errors 
//   useEffect(() => {
//     if (error) {
//       setUser(null);
//       localStorage.removeItem("user");
//       setLoading(false);
//     }
//   }, [error]);

//   // ── Actions ──

//   // The ONLY place user data is set (from the parameter)
//   const login = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = async () => {
//     const loadingToast = toast.loading("Logging out...");
//     try {
//       await logoutUser();

//       setUser(null);
//       localStorage.removeItem("user");
//       await client.clearStore();

//       toast.success("Logged out successfully", { id: loadingToast });
//       navigate("/login");
//     } catch (err: any) {
//       console.error("Logout error:", err);
//       toast.error(err.message || "Failed to log out properly.", { id: loadingToast });
      
//       setUser(null);
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { createContext, useContext, useEffect, useState, type ReactNode} from "react";

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
    isLoggedIn { success }
  }
`;

interface IsLoggedInResponse {
  isLoggedIn: {
    success: boolean;
  };
}

const LOGOUT_MUTATION = gql`
  mutation logoutUser {
    logoutUser { success message }
  }
`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logoutUser] = useMutation(LOGOUT_MUTATION);

  // 1. Instant UI Load & Network Listener
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    
    setLoading(false); // Stop loading immediately for fast UI!

    const handleSessionExpired = () => {
      setUser(null); // Wipe React state
      localStorage.removeItem("user");
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  // 2. Background Security Verification
  const { data, loading: queryLoading, error } = useQuery<IsLoggedInResponse>(IS_LOGGED_IN, {
    fetchPolicy: "network-only", // Always ask the server, never trust cache here
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

  // 3. Actions
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem("user");
      await client.clearStore();
      toast.success("Logged out successfully", { id: loadingToast });
      navigate("/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
      toast.dismiss(loadingToast);
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
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};