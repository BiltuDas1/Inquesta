import { Route, Routes, useLocation, useNavigate } from "react-router";
import Home from "./pages/homepage";
import SignupPage from "./pages/signuppage";
import LoginPage from "./pages/loginpage";
import DashboardPage from "./pages/dashboardpage";
import ProtectedRoute from "./components/middleware/protectedroute";
import PublicRoute from "./components/middleware/publicroute";
import NotFoundPage from "./pages/notfoundpage";
import GoogleLogin from "./pages/googleloginpage";
import toast, { Toaster } from "react-hot-toast";
import CheckEmailPage from "./pages/checkemailpage";
import VerifyEmailPage from "./pages/verifyemailpage";
import { useEffect } from "react";
import { client } from "./lib/apolloclient";
import UserDataCollectionForm from "./pages/userdatacollectionform";
import OnboardingRoute from "./components/middleware/onboardingroute";
import CourseDetails from "./components/courses/coursedetails";
import MainLayout from "./components/layout/mainlayout";
import CourseListingPage from "./components/layout/courselistingpage";
import DashboardLayout from "./components/layout/dashboardlayout";

// For handling global session
// const GlobalSessionHandler = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleSessionExpired = async () => {
//       // Clear apollo cache
//       await client.clearStore();

//       toast.error("Your session has expired. Please log in again.");
//       navigate("/login");
//     };

//     window.addEventListener("session-expired", handleSessionExpired);

//     // Cleanup resources
//     return () => {
//       window.removeEventListener("session-expired", handleSessionExpired);
//     };
//   }, [navigate]);

//   return null;
// };

const GlobalSessionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSessionExpired = async () => {
      await client.clearStore();

      // Only kick them out with an error if they were trying to view a protected page
      if (location.pathname.startsWith("/dashboard")) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [navigate, location]);

  return null;
};
function App() {
  return (
    <>
      {/* For toast message */}
      <Toaster position="top-right"></Toaster>

      <GlobalSessionHandler />
      <Routes>
        {/* 1. PUBLIC ROUTES (No auth needed) */}
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path="/courses" element={<CourseListingPage />} />
          <Route path="/course/:courseID" element={<CourseDetails />} />
        </Route>

        {/* 2. AUTH ROUTES (Blocked if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/auth/google" element={<GoogleLogin />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route path="/email/verify" element={<VerifyEmailPage />} />
        </Route>

        {/* 3. ONBOARDING ROUTE */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboard" element={<UserDataCollectionForm />} />
        </Route>

        {/* 4. PROTECTED ROUTES (Must be logged in as Admin) */}
        <Route element={<ProtectedRoute />}>
          {/* Move your entire DashboardLayout INSIDE the ProtectedRoute */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Use index to load DashboardPage by default when visiting /dashboard */}
            <Route index element={<DashboardPage />} />
            <Route path="courses" element={<DashboardPage />} />
            <Route
              path="students"
              element={<div>Students page coming soon !!</div>}
            />
            <Route
              path="analytics"
              element={<div>Analytics coming soon</div>}
            />
            <Route path="settings" element={<div>Settings coming soon</div>} />
          </Route>
        </Route>

        {/* 5. CATCH-ALL */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
