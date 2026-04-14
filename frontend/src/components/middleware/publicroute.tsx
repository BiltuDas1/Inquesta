import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ If already logged in → redirect
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → allow login/signup
  return <Outlet />;
};

export default PublicRoute;