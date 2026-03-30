import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/homepage";
import Register from "./pages/register";
import Courses from "./pages/courses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;