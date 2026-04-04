import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import {SignupPage} from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;