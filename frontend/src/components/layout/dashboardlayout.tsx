import { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router"; // Ensure this matches your router package
import { Logo } from "../ui/logo";
import { useAuth } from "../../context/authcontext";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { logout, user } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Use React Router's location to determine which tab is active based on the URL
  const location = useLocation();
  const currentUrl = location.pathname;

  // Exact paths matching your nested route setup
  const navItems = [
    { name: "Courses", icon: "library_books", path: "/dashboard/courses" },
    { name: "Students", icon: "group", path: "/dashboard/students" },
  ];

  // Helper to get the page title for the Topbar based on the current URL
  const currentTitle =
    navItems.find(
      (item) =>
        currentUrl === item.path ||
        (item.path !== "/dashboard" && currentUrl.startsWith(item.path)),
    )?.name || "Dashboard";

    // ── Close dropdown when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ── Centralized Logout Handler ──
  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await logout();
      setIsProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#10141a] font-body text-[#dfe2eb] overflow-hidden">
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c2026] border-r border-[#3b4a44] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 shrink-0">
          <Logo />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              currentUrl === item.path ||
              (item.path !== "/dashboard" && currentUrl.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after clicking
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] font-headline font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#262a31] text-[#6fffd9]"
                    : "text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
                }`}
              >
                <span className="material-symbols-outlined text-[1.3rem]">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content Wrapper ── */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0 z-10">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block capitalize">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* ── Interactive Profile Dropdown ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3b4a44] border-2 border-[#6fffd9] flex items-center justify-center overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(111,255,217,0.2)] hover:border-[#5cebc5] transition-colors"
              >
                {user ? (
                  <span className="text-[#dfe2eb] text-sm sm:text-base font-bold uppercase">
                    {user.firstname?.[0]}
                    {user.lastname?.[0]}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[#dfe2eb] text-xl">
                    person
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && user && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-3 border-b border-[#3b4a44] mb-2">
                    <p className="text-[#dfe2eb] text-sm font-bold truncate">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-[#84948e] text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[#ffb4ab] hover:bg-[#262a31] text-sm transition-colors flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>{" "}
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content Injected Here ── */}
        <main className="flex-1 overflow-y-auto relative bg-[#10141a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
