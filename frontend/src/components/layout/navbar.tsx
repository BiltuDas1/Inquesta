import { useState, useEffect, useRef } from "react";
import { Logo } from "../ui/logo";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/authcontext";

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Create refs for both mobile and desktop containers
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check if click was outside both potential dropdown containers
      const clickedOutsideDesktop =
        desktopRef.current && !desktopRef.current.contains(target);
      const clickedOutsideMobile =
        mobileRef.current && !mobileRef.current.contains(target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const iconBtnClass =
    "relative flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer shrink-0 bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors";

  return (
    <>
      {/* Removed overflow-hidden from nav to allow dropdown to show */}
      <nav className="sticky top-0 z-50 text-on-surface font-headline flex items-center h-16 px-4 bg-[#181c22] border-b border-[#3b4a44] w-full">
        {/* ── Mobile Layout ── */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className={iconBtnClass}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "25px",
                  fontVariationSettings: "'wght' 300",
                }}
              >
                search
              </span>
            </button>

            {user ? (
              <div className="relative" ref={mobileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
                >
                  {getInitials(user.firstname, user.lastname)}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-2 border-b border-[#3b4a44] mb-1">
                      <p className="text-[#dfe2eb] text-sm font-bold truncate">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-[#84948e] text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#ffb4ab] hover:bg-[#262a31] text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        logout
                      </span>{" "}
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-xs hover:bg-[#5cebc5] transition-colors shrink-0 ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* ── Tablet & Desktop Layout ── */}
        <div className="hidden md:flex items-center w-full justify-center gap-2 lg:gap-45">
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            <Logo />
          </div>

          {/* Search bar */}
          <div className="flex-1 min-w-[200px] max-w-[640px] relative mx-2 lg:mx-6">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84948e] pointer-events-none flex">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "18px",
                  fontVariationSettings: "'wght' 300",
                }}
              >
                search
              </span>
            </span>
            <input
              type="text"
              placeholder="Search for anything"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full py-2 pr-4 pl-10 rounded-full bg-[#1c2026] outline-none text-[#dfe2eb] text-sm transition-all duration-200 border ${
                searchFocused
                  ? "border-[#6fffd9] shadow-[0_0_0_3px_rgba(111,255,217,0.12)]"
                  : "border-[#3b4a44]"
              }`}
            />
          </div>

          {/* Desktop Auth Group */}
          <div className="flex items-center gap-1 shrink-0">
            {user ? (
              <div className="relative" ref={desktopRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
                >
                  {getInitials(user.firstname, user.lastname)}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-3 border-b border-[#3b4a44] mb-2">
                      <p className="text-[#dfe2eb] text-sm font-bold">
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
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-sm hover:bg-[#5cebc5] transition-colors shrink-0 ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-[#181c22] flex flex-col md:hidden">
          <div className="flex items-center px-4 h-16 border-b border-[#3b4a44] gap-3 shrink-0">
            <span
              className="material-symbols-outlined text-[#84948e]"
              style={{ fontSize: "22px" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search for anything"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-[#dfe2eb] text-base"
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="bg-transparent border-none cursor-pointer text-[#b9cac3]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
