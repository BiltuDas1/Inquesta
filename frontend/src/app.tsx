import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import SignupPage from "./pages/signuppage";
import LoginPage from "./pages/loginpage";
import DashboardPage from "./pages/dashboardpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage></DashboardPage>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
