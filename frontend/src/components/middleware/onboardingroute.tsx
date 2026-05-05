import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Navigate, Outlet } from "react-router";

const GET_USER_INFO = gql`
  query getUserInfo {
    getUserInfo {
      success
    }
  }
`;

// Response type of USER INFO
interface UserInfoData {
  getUserInfo: {
    success: boolean;
  } | null;
}

export default function OnboardingRoute() {
  const { data, loading, error } = useQuery<UserInfoData>(GET_USER_INFO, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
        Verifying account status...
      </div>
    );
  }

  // If the query fails (e.g., invalid token), kick to login
  if (error) {
    return <Navigate to="/login" replace />;
  }

  const isDetailsFilled = data?.getUserInfo?.success;

  // If they already filled their details, kick them out of the onboarding route
  if (isDetailsFilled) {
    const storedUser = localStorage.getItem("user");
    let targetRoute = "/courses"; // Default

    if (storedUser) {
      try {
        const { role } = JSON.parse(storedUser);
        if (role === "admin") targetRoute = "/dashboard";
      } catch (e) {}
    }
    return <Navigate to={targetRoute} replace />;
  }

  // If success is false, allow them to see the onboarding form
  return <Outlet />;
}
