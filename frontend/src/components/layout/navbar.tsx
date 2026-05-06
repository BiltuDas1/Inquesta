// "use client";

// import { useState, useEffect } from "react";
// import { Logo } from "../ui/logo";
// import { useAuth } from "../../context/authcontext";
// import { useNavigate } from "react-router";



// export default function Navbar() {
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // Close mobile search automatically when switching to tablet/desktop view
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsMobileSearchOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // 2. Helper function to safely get initials
//   const getInitials = (fname?: string, lname?: string) => {
//     const first = fname ? fname.charAt(0).toUpperCase() : "";
//     const last = lname ? lname.charAt(0).toUpperCase() : "";
//     return `${first}${last}` || "U";
//   };

//   // Shared button class for icons
//   const iconBtnClass =
//     "relative flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer shrink-0 bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors";

//   return (
//     <>
//       <nav className="sticky top-0 z-50 text-on-surface font-headline flex items-center h-16 px-4 bg-[#181c22] border-b border-[#3b4a44] overflow-hidden w-full">
//         {/* ── Mobile Layout (hidden on md and up) ── */}
//         <div className="flex md:hidden items-center justify-between w-full">
//           <div className="flex items-center">
//             <Logo/>
//           </div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setIsMobileSearchOpen(true)}
//               aria-label="Search"
//               className={iconBtnClass}
//             >
//               <span
//                 className="material-symbols-outlined"
//                 style={{
//                   fontSize: "25px",
//                   fontVariationSettings: "'wght' 300",
//                 }}
//               >
//                 search
//               </span>
//             </button>
//             {/* Avatar */}
//             <button className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2">
//               SP
//             </button>
//           </div>
//         </div>

//         {/* ── Tablet & Desktop Layout (hidden on mobile) ── */}
//         <div className="hidden md:flex items-center w-full justify-center gap-2 lg:gap-45">
//           {/* 1. LEFT GROUP: Logo */}
//           <div className="flex items-center gap-3 lg:gap-6 shrink-0">
//             <Logo />
//           </div>

//           {/*  CENTER: Search bar (Flexible) */}
//           <div className="flex-1 min-w-[200px] max-w-[640px] relative mx-2 lg:mx-6">
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
//               placeholder="Search for anything"
//               onFocus={() => setSearchFocused(true)}
//               onBlur={() => setSearchFocused(false)}
//               className={`w-full py-2 pr-4 pl-10 rounded-full bg-[#1c2026] outline-none text-[#dfe2eb] font-['Inter',sans-serif] text-sm transition-all duration-200 border ${
//                 searchFocused
//                   ? "border-[#6fffd9] shadow-[0_0_0_3px_rgba(111,255,217,0.12)]"
//                   : "border-[#3b4a44]"
//               }`}
//             />
//           </div>

//           {/* 3. RIGHT GROUP: Avatar */}
//           <div className="flex items-center gap-1 shrink-0">
//             <button className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2">
//               SP
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ── Mobile Search Fullscreen Overlay ── */}
//       {isMobileSearchOpen && (
//         <div className="fixed inset-0 z-[200] bg-[#181c22] flex flex-col md:hidden animate-in fade-in duration-200">
//           {/* Top Search Bar */}
//           <div className="flex items-center px-4 h-16 border-b border-[#3b4a44] gap-3 shrink-0">
//             <span
//               className="material-symbols-outlined text-[#84948e]"
//               style={{ fontSize: "22px" }}
//             >
//               search
//             </span>
//             <input
//               type="text"
//               placeholder="Search for anything"
//               autoFocus // Automatically brings up the mobile keyboard
//               className="flex-1 bg-transparent border-none outline-none text-[#dfe2eb] font-['Inter',sans-serif] text-base placeholder:text-[#84948e]"
//             />
//             <button
//               onClick={() => setIsMobileSearchOpen(false)}
//               className="flex items-center justify-center p-2 text-[#b9cac3] hover:text-[#dfe2eb] bg-transparent border-none cursor-pointer transition-colors"
//             >
//               <span
//                 className="material-symbols-outlined"
//                 style={{ fontSize: "24px" }}
//               >
//                 close
//               </span>
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Logo } from "../ui/logo";

import { useNavigate } from "react-router"; 
import { useAuth } from "../../context/authcontext";

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  

  const { user } = useAuth();
  const navigate = useNavigate();

  // Close mobile search automatically when switching to tablet/desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Helper function to safely get initials
  const getInitials = (fname?: string, lname?: string) => {
    const first = fname ? fname.charAt(0).toUpperCase() : "";
    const last = lname ? lname.charAt(0).toUpperCase() : "";
    return `${first}${last}` || "U";
  };

  // Shared button class for icons
  const iconBtnClass =
    "relative flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer shrink-0 bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors";

  return (
    <>
      <nav className="sticky top-0 z-50 text-on-surface font-headline flex items-center h-16 px-4 bg-[#181c22] border-b border-[#3b4a44] overflow-hidden w-full">
        
        {/* ── Mobile Layout (hidden on md and up) ── */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Search"
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
            
            {/* Mobile Auth Render */}
            {user ? (
              <button className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2">
                {getInitials(user.firstname, user.lastname)}
              </button>
            ) : (
              <button 
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 rounded-lg bg-[#6fffd9] text-[#1c2026] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs hover:bg-[#5cebc5] transition-colors shrink-0 ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* ── Tablet & Desktop Layout (hidden on mobile) ── */}
        <div className="hidden md:flex items-center w-full justify-center gap-2 lg:gap-45">
          {/* 1. LEFT GROUP: Logo */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            <Logo />
          </div>

          {/* 2. CENTER: Search bar (Flexible) */}
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
              className={`w-full py-2 pr-4 pl-10 rounded-full bg-[#1c2026] outline-none text-[#dfe2eb] font-['Inter',sans-serif] text-sm transition-all duration-200 border ${
                searchFocused
                  ? "border-[#6fffd9] shadow-[0_0_0_3px_rgba(111,255,217,0.12)]"
                  : "border-[#3b4a44]"
              }`}
            />
          </div>

          {/* 3. RIGHT GROUP: Avatar / Login */}
          <div className="flex items-center gap-1 shrink-0">
            {user ? (
              <button className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2">
                {getInitials(user.firstname, user.lastname)}
              </button>
            ) : (
              <button 
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-lg bg-[#6fffd9] text-[#1c2026] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm hover:bg-[#5cebc5] transition-colors shrink-0 ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Search Fullscreen Overlay ── */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[200] bg-[#181c22] flex flex-col md:hidden animate-in fade-in duration-200">
          {/* Top Search Bar */}
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
              autoFocus // Automatically brings up the mobile keyboard
              className="flex-1 bg-transparent border-none outline-none text-[#dfe2eb] font-['Inter',sans-serif] text-base placeholder:text-[#84948e]"
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="flex items-center justify-center p-2 text-[#b9cac3] hover:text-[#dfe2eb] bg-transparent border-none cursor-pointer transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "24px" }}
              >
                close
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}