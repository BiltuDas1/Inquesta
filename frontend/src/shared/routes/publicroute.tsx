import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/context/authcontext";

const PublicRoute = () => {
  // Grab the user and loading state from your global context
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-body">
        Checking session...
      </div>
    );
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="admin/dashboard" replace />;
    }
    if (user.role === "parent") {
      return <Navigate to="/parent/dashboard" replace />;
    } else {
      return <Navigate to="/courses" replace />;
    }
    if (user.role === "teacher") {
      return <Navigate to="/teacher/dashboard" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/students/dashboard" replace />;
    }

    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
