import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/context/authcontext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-body">
        Authenticating...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if (user.role !== "admin") {
  //   return <Navigate to="/courses" replace />;
  // }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "teacher":
        return <Navigate to="/teacher/dashboard" replace />;
      case "student":
      case "user":
        return <Navigate to="/students/dashboard" replace />;
      default:
        return <Navigate to="/courses" replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;
