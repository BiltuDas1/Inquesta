import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/context/authcontext";

const GET_USER_INFO = gql`
  query getUserInfo {
    getUserInfo {
      success
    }
  }
`;

interface UserInfoData {
  getUserInfo: {
    success: boolean;
  } | null;
}

export default function OnboardingRoute() {
  // 1. Grab user and auth loading state from global context
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data,
    loading: isQueryLoading,
    error,
  } = useQuery<UserInfoData>(GET_USER_INFO, {
    fetchPolicy: "network-only",
    skip: !user || isAuthLoading,
  });

  if (isAuthLoading || isQueryLoading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-body">
        Verifying account status...
      </div>
    );
  }

  if (!user || error) {
    return <Navigate to="/login" replace />;
  }

  const isDetailsFilled = data?.getUserInfo?.success;

  if (user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  if (isDetailsFilled) {
    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
}
