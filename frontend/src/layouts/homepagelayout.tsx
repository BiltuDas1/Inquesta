import { Outlet, useLocation } from "react-router";
import { Footer } from "../shared/components/footer"; // Adjust path as needed
import { HeroSection } from "../shared/components/herosection";
import { CtaSection } from "../shared/components/ctasection";
import { HomePageNavbar } from "../shared/components/homepagenavbar";
import { CourseCarousel } from "../shared/components/notice-carousel";

export default function HomePageLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
      {/* Navbar Component */}
      <HomePageNavbar />

      {isHomePage && <HeroSection />}

      {isHomePage && <CourseCarousel />}

      {/*  Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {isHomePage && <CtaSection />}

      {/*Footer Component */}
      <Footer />
    </div>
  );
}
