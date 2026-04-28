"use client";

import { useState, useEffect } from "react";

const Logo = () => (
  <a href="/" className="flex items-center gap-3 no-underline shrink-0">
    <div className="w-10 h-10 rounded-xl bg-[#1a3a35] flex items-center justify-center shrink-0">
      <img className="h-8" src="/favicon.svg" alt="Inquesta Logo" />
    </div>
    <span className="text-white text-xl font-semibold tracking-wide">
      Inquesta
    </span>
  </a>
);

// function NavLink({
//   children,
//   href = "#",
// }: {
//   children: React.ReactNode;
//   href?: string;
// }) {
//   return (
//     <a
//       href={href}
//       className="text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] text-[16px] font-medium px-3 py-1.5 rounded-lg no-underline transition-colors whitespace-nowrap"
//     >
//       {children}
//     </a>
//   );
// }

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
type Panel = "main" | "menu";

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [panel, setPanel] = useState<Panel>("main");

  // It is for jump one panel to another panel
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setPanel("main"), 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Prevent background scrolling when mobile search is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const Divider = () => <div className="h-px bg-[#3b4a44] my-[2px]" />;

  const SectionLabel = ({ text }: { text: string }) => (
    <div className="pt-[14px] px-5 pb-[6px] text-xs font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#b9cac3] tracking-[0.06em] uppercase">
      {text}
    </div>
  );

  function MenuItem({
    label,
    arrow = true,
    accent,
    onClick,
  }: {
    label: string;
    arrow?: boolean;
    accent?: boolean;
    onClick?: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-between w-full px-5 py-[11px] border-none cursor-pointer text-left rounded-none bg-transparent hover:bg-[#262a31] font-['Inter',sans-serif] text-[0.9375rem] transition-colors ${accent ? "text-[#ffb4ab]" : "text-[#dfe2eb]"}`}
      >
        {label}
        {arrow && (
          <span className="text-[#b9cac3] flex">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              arrow_forward_ios
            </span>
          </span>
        )}
      </button>
    );
  }

  const MainPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[14px] px-5 py-[18px] bg-[#31353c] border-b border-[#3b4a44] shrink-0">
        <div className="w-[52px] h-[52px] rounded-full bg-[#343d96] flex items-center justify-center shrink-0 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#bdc2ff] border-2 border-[#6fffd9]">
          SP
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[0.9375rem] text-[#dfe2eb]">
            Hi, Santu Pramanik
          </div>
          <div className="text-[0.8125rem] text-[#b9cac3] font-['Inter',sans-serif] mt-0.5">
            Welcome back
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-[#1c2026] border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-[#b9cac3] shrink-0 hover:bg-[#262a31] transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px", fontVariationSettings: "'wght' 400" }}
          >
            close
          </span>
        </button>
      </div>

      <div className="overflow-y-auto flex-1 pb-4">
        <SectionLabel text="Learn" />
        <MenuItem label="My learning" arrow={false} />
        <Divider />

        <SectionLabel text="New & Featured" />
        <button className="flex items-center gap-2.5 w-full px-5 py-[11px] bg-transparent hover:bg-[#262a31] border-none cursor-pointer transition-colors font-['Inter',sans-serif] text-[0.9375rem] text-[#dfe2eb] rounded-none">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Learn AI with Google
          <span className="ml-auto text-[#b9cac3] flex">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              arrow_forward_ios
            </span>
          </span>
        </button>
        <Divider />

        <SectionLabel text="Explore by Goal" />
        <MenuItem label="Learn AI" />
        <MenuItem label="Launch a new career" />
        <MenuItem label="Prepare for a certification" />
        <MenuItem label="Practice with Role Play" arrow={false} />
        <Divider />

        <SectionLabel text="Most popular" />
        <MenuItem label="Web Development" />
        <MenuItem label="Mobile Development" />
        <MenuItem label="Data Science" />
        <MenuItem label="Design" />
        <Divider />

        <SectionLabel text="Account" />
        <MenuItem label="Menu" arrow={true} onClick={() => setPanel("menu")} />
        <Divider />

        <MenuItem label="Sign out" arrow={false} accent />
      </div>
    </div>
  );

  const MenuPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-4 bg-[#31353c] border-b border-[#3b4a44] shrink-0">
        <button
          onClick={() => setPanel("main")}
          className="bg-transparent border-none cursor-pointer text-[#b9cac3] hover:text-[#dfe2eb] flex items-center pr-2 gap-0.5 transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            keyboard_arrow_left
          </span>
        </button>
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#dfe2eb]">
          Menu
        </span>
      </div>

      <div className="overflow-y-auto flex-1 pb-4">
        {(["Alerts", "Account", "Profile"] as const).map((section) => {
          const items: Record<string, string[]> = {
            Alerts: ["Notifications", "Messages", "Wishlist"],
            Account: [
              "Account settings",
              "Payment methods",
              "Subscriptions",
              "Luminary credits",
              "Purchase history",
            ],
            Profile: ["Public profile", "Edit profile"],
          };
          return (
            <div key={section}>
              <SectionLabel text={section} />
              {items[section].map((label) => (
                <button
                  key={label}
                  className="flex w-full px-5 py-[11px] border-none cursor-pointer text-left bg-transparent hover:bg-[#262a31] text-[#dfe2eb] font-['Inter',sans-serif] text-[0.9375rem] font-normal transition-colors rounded-none"
                >
                  {label}
                </button>
              ))}
              <Divider />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] transition-all duration-300 ${open ? "bg-black/55 backdrop-blur-[2px] pointer-events-auto" : "bg-transparent backdrop-blur-none pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-[101] w-[320px] bg-[#181c22] border-r border-[#3b4a44] flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "translate-x-0 shadow-[12px_0_40px_rgba(0,0,0,0.6)]" : "-translate-x-full"}`}
      >
        {/* Sliding inner panels */}
        <div
          className={`flex w-[640px] flex-1 overflow-hidden transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${panel === "menu" ? "-translate-x-[320px]" : "translate-x-0"}`}
        >
          <div className="w-[320px] shrink-0 h-full flex flex-col">
            <MainPanel />
          </div>
          <div className="w-[320px] shrink-0 h-full flex flex-col">
            <MenuPanel />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  // Close sidebar automatically when switching to tablet/desktop view
  useEffect(() => {
    const handleResize = () => {
      // Changed back to 768px (md breakpoint) so the full navbar shows on tablets
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Shared button class for icons
  const iconBtnClass =
    "relative flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer shrink-0 bg-transparent hover:bg-[#262a31] text-[#b9cac3] hover:text-[#dfe2eb] transition-colors";

  return (
    <>
      <nav className="sticky top-0 z-50 text-on-surface font-headline flex items-center h-16 px-4 bg-[#181c22] border-b border-[#3b4a44] overflow-hidden w-full">
        {/* ── Mobile Layout (hidden on md and up) ── */}
        <div className="flex md:hidden items-center justify-between w-full">
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className={iconBtnClass}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px", fontVariationSettings: "'wght' 300" }}
            >
              menu
            </span>
          </button>
          <div className="flex-1 flex justify-center">
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
            {/* Avatar */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
            >
              SP
            </button>
          </div>
        </div>

        {/* ── Tablet & Desktop Layout (hidden on mobile) ── */}
        <div className="hidden md:flex items-center w-full justify-center gap-2 lg:gap-45 ">
          {/* 1. LEFT GROUP: Logo and Main Links */}
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

          {/* 3. RIGHT GROUP: Teacher Links, Icons, and Avatar */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Avatar */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-full bg-[#343d96] text-[#bdc2ff] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs border-2 border-[#3b4a44] hover:border-[#6fffd9] cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
            >
              SP
            </button>
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

          {/* Trending Suggestions */}
        </div>
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
