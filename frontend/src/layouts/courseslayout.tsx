import { Outlet } from "react-router";
import Navbar from "../shared/components/coursesnavbar";
import { Footer } from "../shared/components/footer";

export default function CoursesLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#10141a]">
      {/* Navbar stays fixed at the top */}
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      {/*  Footer stays at the bottom */}
      <Footer />
    </div>
  );
}
