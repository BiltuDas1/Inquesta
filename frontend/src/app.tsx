import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
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
import { CoursesPage1 } from "./pages/coursespage1";
import UserDataCollectionForm from "./pages/userdatacollectionform";
import OnboardingRoute from "./components/middleware/onboardingroute";
import CourseDetails from "./components/courses/coursedetails";

// For handling global session
const GlobalSessionHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = async () => {
      // Clear apollo cache
      await client.clearStore();

      toast.error("Your session has expired. Please log in again.");
      navigate("/login");
    };

    window.addEventListener("session-expired", handleSessionExpired);

    // Cleanup resources
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, [navigate]);

  return null;
};

function App() {
  return (
    <>
      {/* For toast message */}
      <Toaster position="top-right"></Toaster>

      <BrowserRouter>
        <GlobalSessionHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage1></CoursesPage1>} />
            <Route path="/course/:courseId" element={<CourseDetails/>} />

          {/* Block if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/auth/google" element={<GoogleLogin />} />
            <Route path="/check-email" element={<CheckEmailPage />} />
            <Route path="/email/verify" element={<VerifyEmailPage />} />
          </Route>
          {/* Protected Route */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            />
          </Route>

          {/* Onboard route */}
          <Route element={<OnboardingRoute />}>
            <Route path="/onboard" element={<UserDataCollectionForm />} />
          </Route>
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
