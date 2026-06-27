// import { useState, useEffect, useRef } from "react";
// import { Logo } from "./logo";
// import { useNavigate, useLocation, Link } from "react-router"; // Added useLocation
// import { useAuth } from "../../features/auth/context/authcontext";

// export default function Navbar() {
//   const [searchInput, setSearchInput] = useState("");
//   const [searchFocused, setSearchFocused] = useState(false);

//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const desktopRef = useRef<HTMLDivElement>(null);
//   const mobileRef = useRef<HTMLDivElement>(null);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;
//       const clickedOutsideDesktop =
//         desktopRef.current && !desktopRef.current.contains(target);
//       const clickedOutsideMobile =
//         mobileRef.current && !mobileRef.current.contains(target);

//       if (clickedOutsideDesktop && clickedOutsideMobile) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Handle resize for mobile search
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsMobileSearchOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Sync the search input with the URL when the page loads or URL changes
//   useEffect(() => {
//     if (location.pathname === "/courses") {
//       const params = new URLSearchParams(location.search);
//       setSearchInput(params.get("q") || "");
//     } else {
//       setSearchInput(""); // Clear search bar if we navigate away from courses
//     }
//   }, [location.pathname, location.search]);

//   // Live filtering ONLY when already on the courses page
//   useEffect(() => {
//     if (location.pathname !== "/courses") return;

//     const handler = setTimeout(() => {
//       const params = new URLSearchParams(location.search);
//       const currentQ = params.get("q") || "";
//       const newQ = searchInput.trim();

//       // Only push to URL if the search actually changed (prevents loop with sync useEffect)
//       if (currentQ !== newQ) {
//         if (newQ) {
//           params.set("q", newQ);
//         } else {
//           params.delete("q");
//         }
//         navigate(`/courses?${params.toString()}`, { replace: true });
//       }
//     }, 400); // 400ms debounce

//     return () => clearTimeout(handler);
//   }, [searchInput, location.pathname, location.search, navigate]);

//   // Pressing 'Enter' forces the search globally
//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       const query = searchInput.trim();
//       if (query) {
//         navigate(`/courses?q=${encodeURIComponent(query)}`);
//       } else {
//         navigate(`/courses`);
//       }
//       setIsMobileSearchOpen(false);
//       (e.target as HTMLInputElement).blur(); // Remove focus after searching
//     }
//   };

//   const getInitials = (fname?: string, lname?: string) => {
//     const first = fname ? fname.charAt(0).toUpperCase() : "";
//     const last = lname ? lname.charAt(0).toUpperCase() : "";
//     return `${first}${last}` || "U";
//   };

//   const handleLogout = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await logout();
//       setIsProfileOpen(false);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const iconBtnClass =
//     "relative flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer shrink-0 bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors";

//   return (
//     <>
//       <nav className="sticky top-0 z-50 w-full h-16 bg-[#181c22] border-b border-[#3b4a44] text-on-surface font-headline">
//         {/* ── Mobile Layout ── */}
//         <div className="flex md:hidden items-center justify-between w-full h-full px-4">
//           {isMobileSearchOpen ? (
//             <div className="flex items-center w-full h-full gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
//               <span
//                 className="material-symbols-outlined text-[#84948e]"
//                 style={{ fontSize: "22px" }}
//               >
//                 search
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search for anything..."
//                 autoFocus
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 onKeyDown={handleSearchKeyDown}
//                 className="flex-1 bg-transparent border-none outline-none text-[#dfe2eb] text-base w-full h-full"
//               />
//               <button
//                 onClick={() => setIsMobileSearchOpen(false)}
//                 className="bg-transparent border-none cursor-pointer text-[#b9cac3] p-1 flex items-center justify-center hover:bg-[#262a31] rounded-full transition-colors"
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="flex items-center shrink-0">
//                 <Logo />
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setIsMobileSearchOpen(true)}
//                   className={iconBtnClass}
//                 >
//                   <span
//                     className="material-symbols-outlined"
//                     style={{
//                       fontSize: "25px",
//                       fontVariationSettings: "'wght' 300",
//                     }}
//                   >
//                     search
//                   </span>
//                 </button>

//                 {user && (
//                   <Link
//                     to={
//                       user.role === "admin"
//                         ? "/admin/dashboard"
//                         : "/student/dashboard"
//                     }
//                     className="text-[#b9cac3] hover:text-[#dfe2eb] transition-colors text-sm font-semibold"
//                   >
//                     Dashboard
//                   </Link>
//                 )}

//                 {user ? (
//                   <div className="relative" ref={mobileRef}>
//                     <button
//                       onClick={() => setIsProfileOpen(!isProfileOpen)}
//                       className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
//                     >
//                       {getInitials(user.firstname, user.lastname)}
//                     </button>
//                     {isProfileOpen && (
//                       <div className="absolute right-0 mt-2 w-48 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
//                         <div className="px-4 py-2 border-b border-[#3b4a44] mb-1">
//                           <p className="text-[#dfe2eb] text-sm font-bold truncate">
//                             {user.firstname} {user.lastname}
//                           </p>
//                           <p className="text-[#84948e] text-xs truncate">
//                             {user.email}
//                           </p>
//                         </div>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 text-[#ffb4ab] hover:bg-[#262a31] text-sm transition-colors flex items-center gap-2"
//                         >
//                           <span className="material-symbols-outlined text-sm">
//                             logout
//                           </span>{" "}
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => navigate("/login")}
//                     className="px-3 py-1.5 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-xs hover:bg-[#5cebc5] transition-colors shrink-0 ml-2"
//                   >
//                     Login
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* ── Tablet & Desktop Layout ── */}
//         <div className="hidden md:flex items-center justify-between w-full h-full px-4 lg:px-8 max-w-7xl mx-auto">
//           <div className="flex items-center shrink-0">
//             <Logo />
//           </div>

//           <div className="flex-1 max-w-[640px] relative mx-8">
//             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84948e] pointer-events-none flex">
//               <span
//                 className="material-symbols-outlined"
//                 style={{
//                   fontSize: "18px",
//                   fontVariationSettings: "'wght' 300",
//                 }}
//               >
//                 search
//               </span>
//             </span>

//             <input
//               type="text"
//               placeholder="Search for anything... (Press Enter)"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               onKeyDown={handleSearchKeyDown}
//               onFocus={() => setSearchFocused(true)}
//               onBlur={() => setSearchFocused(false)}
//               className={`w-full py-2 pr-4 pl-10 rounded-full bg-[#1c2026] outline-none text-[#dfe2eb] text-sm transition-all duration-200 border ${
//                 searchFocused
//                   ? "border-[#6fffd9] shadow-[0_0_0_3px_rgba(111,255,217,0.12)]"
//                   : "border-[#3b4a44]"
//               }`}
//             />
//           </div>

//           <div className="flex items-center gap-6 shrink-0">
//             {user && (
//               <div className="flex items-center gap-6">
//                 <Link
//                   to={
//                     user.role === "admin"
//                       ? "/admin/dashboard"
//                       : user.role === "teacher"
//                         ? "/teacher/dashboard"
//                         : user.role === "parent"
//                           ? "/parent/dashboard"
//                           : "/students/dashboard"
//                   }
//                   className="flex items-center gap-2 text-[#b9cac3] hover:text-[#6fffd9] transition-colors font-semibold text-sm tracking-wide"
//                 >
//                   Dashboard
//                 </Link>
//               </div>
//             )}

//             {user ? (
//               <div className="relative" ref={desktopRef}>
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0"
//                 >
//                   {getInitials(user.firstname, user.lastname)}
//                 </button>

//                 {isProfileOpen && (
//                   <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
//                     <div className="px-4 py-3 border-b border-[#3b4a44] mb-2">
//                       <p className="text-[#dfe2eb] text-sm font-bold">
//                         {user.firstname} {user.lastname}
//                       </p>
//                       <p className="text-[#84948e] text-xs truncate">
//                         {user.email}
//                       </p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-[#ffb4ab] hover:bg-[#262a31] text-sm transition-colors flex items-center gap-2 font-medium"
//                     >
//                       <span className="material-symbols-outlined text-[18px]">
//                         logout
//                       </span>{" "}
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="px-5 py-2 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-sm hover:bg-[#5cebc5] transition-colors shrink-0"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Logo } from "./logo";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../features/auth/context/authcontext";
import { useCart } from "../../features/auth/context/cartcontext";

export default function Navbar() {
  const [searchInput, setSearchInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock cart count - replace this with your actual Cart Context / State
  const { cartCount } = useCart();

  const { user, logout } = useAuth();
  console.log("CoursesNavbar user role:", user?.role, "user:", user);
  const navigate = useNavigate();
  const location = useLocation();

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
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

  // Handle resize for mobile search
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync the search input with the URL when the page loads or URL changes
  useEffect(() => {
    if (location.pathname === "/courses") {
      const params = new URLSearchParams(location.search);
      setSearchInput(params.get("q") || "");
    } else {
      setSearchInput(""); // Clear search bar if we navigate away from courses
    }
  }, [location.pathname, location.search]);

  // Live filtering ONLY when already on the courses page
  useEffect(() => {
    if (location.pathname !== "/courses") return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      const currentQ = params.get("q") || "";
      const newQ = searchInput.trim();

      // Only push to URL if the search actually changed (prevents loop with sync useEffect)
      if (currentQ !== newQ) {
        if (newQ) {
          params.set("q", newQ);
        } else {
          params.delete("q");
        }
        navigate(`/courses?${params.toString()}`, { replace: true });
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [searchInput, location.pathname, location.search, navigate]);

  // Pressing 'Enter' forces the search globally
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = searchInput.trim();
      if (query) {
        navigate(`/courses?q=${encodeURIComponent(query)}`);
      } else {
        navigate(`/courses`);
      }
      setIsMobileSearchOpen(false);
      (e.target as HTMLInputElement).blur(); // Remove focus after searching
    }
  };

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
      <nav className="sticky top-0 z-50 w-full h-16 bg-[#181c22] border-b border-[#3b4a44] text-on-surface font-headline">
        {/* ── Mobile Layout ── */}
        <div className="flex md:hidden items-center justify-between w-full h-full px-4">
          {isMobileSearchOpen ? (
            <div className="flex items-center w-full h-full gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
              <span
                className="material-symbols-outlined text-[#84948e]"
                style={{ fontSize: "22px" }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search for anything..."
                autoFocus
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-[#dfe2eb] text-base w-full h-full"
              />
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="bg-transparent border-none cursor-pointer text-[#b9cac3] p-1 flex items-center justify-center hover:bg-[#262a31] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center shrink-0">
                <Logo />
              </div>
              <div className="flex items-center gap-2">
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

                {/* Mobile Cart Icon */}
                {(user?.role === "student" || user?.role === "user") && (
                  <button
                    onClick={() => navigate("/cart")}
                    className={iconBtnClass}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "25px",
                        fontVariationSettings: "'wght' 300",
                      }}
                    >
                      shopping_cart
                    </span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-[#10141a] bg-[#6fffd9] rounded-full shadow-sm">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>
                )}

                {user && (
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : "/student/dashboard"
                    }
                    className="text-[#b9cac3] hover:text-[#dfe2eb] transition-colors text-sm font-semibold ml-1"
                  >
                    Dashboard
                  </Link>
                )}

                {user ? (
                  <div className="relative" ref={mobileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-1"
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
                    className="px-3 py-1.5 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-xs hover:bg-[#5cebc5] transition-colors shrink-0 ml-1"
                  >
                    Login
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Tablet & Desktop Layout ── */}
        <div className="hidden md:flex items-center justify-between w-full h-full px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          <div className="flex-1 max-w-[640px] relative mx-8">
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
              placeholder="Search for anything... (Press Enter)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full py-2 pr-4 pl-10 rounded-full bg-[#1c2026] outline-none text-[#dfe2eb] text-sm transition-all duration-200 border ${
                searchFocused
                  ? "border-[#6fffd9] shadow-[0_0_0_3px_rgba(111,255,217,0.12)]"
                  : "border-[#3b4a44]"
              }`}
            />
          </div>

          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            {user && (
              <div className="flex items-center gap-6">
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "teacher"
                        ? "/teacher/dashboard"
                        : user.role === "parent"
                          ? "/parent/dashboard"
                          : "/students/dashboard"
                  }
                  className="flex items-center gap-2 text-[#b9cac3] hover:text-[#6fffd9] transition-colors font-semibold text-sm tracking-wide"
                >
                  Dashboard
                </Link>
              </div>
            )}

            {/* Desktop Cart Icon */}
            {(user?.role === "student" || user?.role === "user") && (
              <button onClick={() => navigate("/cart")} className={iconBtnClass}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "25px",
                    fontVariationSettings: "'wght' 300",
                  }}
                >
                  shopping_cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-[#10141a] bg-[#6fffd9] rounded-full shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative" ref={desktopRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0"
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
                className="px-5 py-2 rounded-lg bg-[#6fffd9] text-[#1c2026] font-bold text-sm hover:bg-[#5cebc5] transition-colors shrink-0"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
