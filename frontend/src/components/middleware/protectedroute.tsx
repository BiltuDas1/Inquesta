import { Navigate, Outlet } from "react-router";
const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/courses" replace />; // or /unauthorized
  }

  return <Outlet />;
};

export default ProtectedRoute;
