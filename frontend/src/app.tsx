import { Route, Routes, useLocation, useNavigate } from "react-router";
import Home from "./layouts/homepagelayout";
import DashboardPage from "./features/admin/pages/dashboardpage";
import ProtectedRoute from "./shared/routes/protectedroute";
import PublicRoute from "./shared/routes/publicroute";
import NotFoundPage from "./shared/pages/notfoundpage";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { client } from "./providers/apolloclient";
import UserDataCollectionForm from "./features/user/pages/userdatacollectionform";
import OnboardingRoute from "./shared/routes/onboardingroute";
import EnrollmentsDashboard from "./features/courses/admin/enrollmenttable";
import CourseListingPage from "./features/courses/pages/courselistingpage";
import CoursesLayout from "./layouts/courseslayout";
import CourseDetails from "./features/courses/pages/coursedetails";
import LoginPage from "./features/auth/pages/loginpage";
import SignupPage from "./features/auth/pages/signuppage";
import GoogleLogin from "./features/auth/pages/googleloginpage";
import VerifyEmailPage from "./features/auth/pages/verifyemailpage";
import CheckEmailPage from "./features/auth/pages/checkemailpage";
import DashboardLayout from "./layouts/adminlayout";

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
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
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

        <Route element={<CoursesLayout />}>
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
            <Route path="students" element={<EnrollmentsDashboard />} />
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
