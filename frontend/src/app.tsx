import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import SignupPage from "./pages/signuppage";
import LoginPage from "./pages/loginpage";
import DashboardPage from "./pages/dashboardpage";

console.log("!!! ATTENTION: APP IS LOADING !!!");
console.log("DEBUG: GQL URL IS:", import.meta.env.VITE_API_URL);

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
