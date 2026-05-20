import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../features/auth/context/authcontext"; // Adjust path as needed
import { Link, useNavigate } from "react-router";

export function HomePageNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const getInitials = (fname?: string, lname?: string) => {
    const first = fname ? fname.charAt(0).toUpperCase() : "";
    const last = lname ? lname.charAt(0).toUpperCase() : "";
    return `${first}${last}` || "U";
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logout();
      setIsProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-none shadow-2xl shadow-black/40">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto font-headline tracking-tight relative">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tighter text-on-surface flex gap-2"
        >
          <img className="h-8" src="/favicon.svg" alt="logo" />
          <span className="text-white">Inquesta</span>
        </Link>

        <button
          className="lg:!hidden text-on-surface material-symbols-outlined"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "close" : "menu"}
        </button>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } lg:flex absolute lg:relative top-full left-0 w-full lg:w-auto bg-background/95 lg:bg-transparent flex-col lg:flex-row items-center p-6 lg:p-0 space-y-6 lg:space-y-0 lg:space-x-8 shadow-xl lg:shadow-none border-b lg:border-none border-outline-variant/50 `}
        >
          <Link
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            to="/courses"
          >
            Courses
          </Link>
          <Link
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            to="/contact"
          >
            Contact
          </Link>

          {user && (
            <Link
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              to={
                user.role === "admin"
                  ? "/admin/dashboard"
                  : user.role === "teacher"
                    ? "/teacher/dashboard"
                    : user.role === "parent"
                      ? "/parent/dashboard"
                      : "/students/dashboard"
              }
            >
              Dashboard
            </Link>
          )}

          <div className="w-full h-px bg-outline-variant lg:hidden"></div>

          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 w-full lg:w-auto">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-on-surface-variant hover:text-on-surface transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-primary-container/20 glow-hover w-full lg:w-auto"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div
                className="relative w-full lg:w-auto flex justify-center"
                ref={profileRef}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-sm border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0"
                >
                  {getInitials(user.firstname, user.lastname)}
                </button>

                {isProfileOpen && (
                  <div className="absolute lg:right-0 top-[calc(100%+10px)] w-56 bg-[#1c2026] border border-outline-variant rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-outline-variant mb-2">
                      <p className="text-[#dfe2eb] text-sm font-bold">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-[#84948e] text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#ffb4ab] hover:bg-surface-container text-sm transition-colors flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>{" "}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
