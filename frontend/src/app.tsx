import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import SignupPage from "./pages/signuppage";
import LoginPage from "./pages/loginpage";
import DashboardPage from "./pages/dashboardpage";
import CoursePage from "./pages/coursepage";
import ProtectedRoute from "./components/middleware/protectedroute";
import PublicRoute from "./components/middleware/publicroute";
import NotFoundPage from "./pages/notfoundpage";
import GoogleLogin from "./pages/googleloginpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursePage></CoursePage>} />

        {/* Block if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/auth/google" element={<GoogleLogin />} />
        </Route>

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage></DashboardPage>} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
