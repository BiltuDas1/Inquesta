import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router"; // Ensure this matches your router package
import { useAuth } from "../../../features/auth/context/authcontext";
import { Logo } from "../../../shared/components/logo";

export default function ParentDashboardLayout() {
  // ── States for Responsive Sidebar & Profile ──
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const currentUrl = location.pathname;

  const navItems = [
    {
      name: "Dashboard",
      icon: "dashboard",
      path: "/teacher/dashboard",
    },
    {
      name: "Assignments",
      icon: "assignment",
      path: "/teacher/assignments",
    },
    {
      name: "Curriculum",
      icon: "export_notes",
      path: "/teacher/curriculum",
    },
    {
      name: "Time Table",
      icon: "calendar_clock",
      path: "/teacher/timetable",
    },
    {
      name: "Attendance",
      icon: "co_present",
      path: "/teacher/attendance",
    },
  ];

  // Close profile dropdown when clicking outside
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
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar (Collapsible on Desktop, Slide-in on Mobile) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#1c2026] border-r border-[#3b4a44] transform transition-all duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
        lg:translate-x-0 lg:static lg:inset-auto ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Logo & Desktop Toggle Header */}
        <div
          className={`h-16 flex items-center shrink-0 border-b border-[#3b4a44]/50 transition-all duration-300 justify-between px-6 ${isDesktopCollapsed ? "lg:justify-center lg:px-4" : ""
            }`}
        >
          {/* Logo container fades and shrinks when collapsed */}
          <div
            className={`overflow-hidden transition-all duration-300 flex items-center max-w-[200px] opacity-100 ${isDesktopCollapsed ? "lg:max-w-0 lg:opacity-0" : ""
              }`}
          >
            <Logo />
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors shrink-0"
            title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined text-xl">
              {isDesktopCollapsed ? "menu_open" : "menu_open"}
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive =
              currentUrl === item.path ||
              (item.path !== "/dashboard" && currentUrl.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                title={isDesktopCollapsed ? item.name : undefined} // Tooltip when collapsed
                className={`flex items-center py-3 px-4 rounded-[8px] font-headline font-semibold transition-all duration-200 group relative ${isActive
                    ? "bg-[#262a31] text-[#6fffd9]"
                    : "text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
                  } ${isDesktopCollapsed ? "lg:justify-center lg:px-0" : ""}`}
              >
                <span className="material-symbols-outlined text-[1.3rem] shrink-0">
                  {item.icon}
                </span>

                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ml-3 max-w-[200px] opacity-100 ${isDesktopCollapsed ? "lg:max-w-0 lg:ml-0 lg:opacity-0" : ""
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-3 border-t border-[#3b4a44] shrink-0">
          <button
            onClick={handleLogout}
            title={isDesktopCollapsed ? "Logout" : undefined}
            className={`flex items-center w-full py-3 px-4 rounded-[8px] text-[#ffb4ab] font-headline font-semibold hover:bg-[#2a0d10] transition-colors group ${isDesktopCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ml-3 max-w-[200px] opacity-100 ${isDesktopCollapsed ? "lg:max-w-0 lg:ml-0 lg:opacity-0" : ""
                }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0 z-10 transition-all duration-300">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block capitalize">
              {/* {getGreeting()} {", "}
              {user?.firstname} 👋🏼 */}
              Teacher Dashboard
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

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto relative bg-[#10141a]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
