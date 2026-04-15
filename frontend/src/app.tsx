import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import SignupPage from "./pages/signuppage";
import LoginPage from "./pages/loginpage";
import DashboardPage from "./pages/dashboardpage";
import CoursePage from "./pages/coursepage";
import ProtectedRoute from "./components/middleware/protectedroute";
import PublicRoute from "./components/middleware/publicroute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursePage></CoursePage>} />

        {/* Block if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage></DashboardPage>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
