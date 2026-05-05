// import React, { useState } from "react";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   activePath?: string;
// }

// export default function DashboardLayout({ children, activePath = "courses" }: DashboardLayoutProps) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navItems = [
//     { name: "Dashboard", icon: "grid_view", path: "dashboard" },
//     { name: "Courses", icon: "library_books", path: "courses" },
//     { name: "Students", icon: "group", path: "students" },
//     { name: "Analytics", icon: "bar_chart", path: "analytics" },
//     { name: "Settings", icon: "settings", path: "settings" },
//   ];

//   return (
//     <div className="flex h-screen bg-[#10141a] font-body text-[#dfe2eb] overflow-hidden">
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
//       )}

//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c2026] border-r border-[#3b4a44] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="h-16 flex items-center px-6 border-b border-[#3b4a44] shrink-0">
//           <span className="material-symbols-outlined text-[#6fffd9] mr-3 text-3xl">school</span>
//           <span className="font-headline font-black text-xl tracking-tight text-[#dfe2eb]">Inquesta</span>
//         </div>

//         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//           {navItems.map((item) => (
//             <a
//               key={item.name}
//               href={`/${item.path}`}
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold transition-all duration-200 ${
//                 activePath === item.path ? "bg-[#262a31] text-[#6fffd9]" : "text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
//               }`}
//             >
//               <span className="material-symbols-outlined text-[1.3rem]">{item.icon}</span>
//               {item.name}
//             </a>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-[#3b4a44] shrink-0">
//           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ffb4ab] font-headline font-semibold hover:bg-[#2a0d10] transition-colors">
//             <span className="material-symbols-outlined">logout</span>
//             Logout
//           </button>
//         </div>
//       </aside>

//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0 z-10">
//           <div className="flex items-center">
//             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4">
//               <span className="material-symbols-outlined text-2xl">menu</span>
//             </button>
//             <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block capitalize">
//               {activePath.replace("-", " ")}
//             </h2>
//           </div>

//           <div className="flex items-center gap-4 sm:gap-6">
//             <button className="text-[#b9cac3] hover:text-[#6fffd9] transition-colors relative">
//               <span className="material-symbols-outlined">notifications</span>
//               <span className="absolute top-0 right-0 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
//             </button>
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3b4a44] border-2 border-[#6fffd9] flex items-center justify-center overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(111,255,217,0.2)]">
//               <span className="material-symbols-outlined text-[#dfe2eb] text-xl">person</span>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto relative">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { Outlet, Link, useLocation } from "react-router";

// export default function DashboardLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   // Use React Router's location to automatically determine the active path
//   const location = useLocation();
  
//   // Extract the first part of the path (e.g., "/courses" -> "courses")
//   // Default to "dashboard" if at the root "/"
//   const activePath = location.pathname.split("/")[1] || "dashboard";

// const navItems = [
//     { name: "Dashboard", icon: "grid_view", path: "/dashboard" },
//     { name: "Courses", icon: "library_books", path: "/dashboard/courses" }, // If you move courses here later
//     { name: "Students", icon: "group", path: "/dashboard/students" },
//     { name: "Analytics", icon: "bar_chart", path: "/dashboard/analytics" },
//     { name: "Settings", icon: "settings", path: "/dashboard/settings" },
//   ];

//   return (
//     <div className="flex h-screen bg-[#10141a] font-body text-[#dfe2eb] overflow-hidden">
//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity backdrop-blur-sm" 
//           onClick={() => setIsSidebarOpen(false)} 
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c2026] border-r border-[#3b4a44] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="h-16 flex items-center px-6 border-b border-[#3b4a44] shrink-0">
//           <span className="material-symbols-outlined text-[#6fffd9] mr-3 text-3xl">school</span>
//           <span className="font-headline font-black text-xl tracking-tight text-[#dfe2eb]">Inquesta</span>
//         </div>

//         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               to={`/${item.path}`}
//               onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after clicking
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold transition-all duration-200 ${
//                 activePath === item.path ? "bg-[#262a31] text-[#6fffd9]" : "text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
//               }`}
//             >
//               <span className="material-symbols-outlined text-[1.3rem]">{item.icon}</span>
//               {item.name}
//             </Link>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-[#3b4a44] shrink-0">
//           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ffb4ab] font-headline font-semibold hover:bg-[#2a0d10] transition-colors">
//             <span className="material-symbols-outlined">logout</span>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content wrapper */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0 z-10">
//           <div className="flex items-center">
//             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4">
//               <span className="material-symbols-outlined text-2xl">menu</span>
//             </button>
//             <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block capitalize">
//               {activePath.replace("-", " ")}
//             </h2>
//           </div>

//           <div className="flex items-center gap-4 sm:gap-6">
//             <button className="text-[#b9cac3] hover:text-[#6fffd9] transition-colors relative">
//               <span className="material-symbols-outlined">notifications</span>
//               <span className="absolute top-0 right-0 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
//             </button>
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3b4a44] border-2 border-[#6fffd9] flex items-center justify-center overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(111,255,217,0.2)]">
//               <span className="material-symbols-outlined text-[#dfe2eb] text-xl">person</span>
//             </div>
//           </div>
//         </header>

//         {/* ── REPLACED {children} WITH <Outlet /> ── */}
//         <main className="flex-1 overflow-y-auto relative">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router"; // Ensure this matches your router package
import { Logo } from "../ui/logo";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use React Router's location to determine which tab is active based on the URL
  const location = useLocation();
  const currentUrl = location.pathname;

  // Exact paths matching your nested route setup
  const navItems = [
    { name: "Dashboard", icon: "grid_view", path: "/dashboard" },
    { name: "Courses", icon: "library_books", path: "/dashboard/courses" },
    { name: "Students", icon: "group", path: "/dashboard/students" },
    { name: "Analytics", icon: "bar_chart", path: "/dashboard/analytics" },
    { name: "Settings", icon: "settings", path: "/dashboard/settings" },
  ];

  // Helper to get the page title for the Topbar based on the current URL
  const currentTitle = navItems.find(item => 
    currentUrl === item.path || (item.path !== '/dashboard' && currentUrl.startsWith(item.path))
  )?.name || "Dashboard";

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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c2026] border-r border-[#3b4a44] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 shrink-0">
        <Logo/>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            // Check if current URL matches the item path or is a sub-path of it
            const isActive = currentUrl === item.path || (item.path !== '/dashboard' && currentUrl.startsWith(item.path));

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
                <span className="material-symbols-outlined text-[1.3rem]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#3b4a44] shrink-0">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-[8px] text-[#ffb4ab] font-headline font-semibold hover:bg-[#2a0d10] transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0 z-10">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block capitalize">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-[#b9cac3] hover:text-[#6fffd9] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3b4a44] border-2 border-[#6fffd9] flex items-center justify-center overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(111,255,217,0.2)]">
              <span className="material-symbols-outlined text-[#dfe2eb] text-xl">person</span>
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