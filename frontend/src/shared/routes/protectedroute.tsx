import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/context/authcontext";


const ProtectedRoute = () => {
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

  if (user.role !== "admin") {
    return <Navigate to="/courses" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
