import { useState } from "react";
import { CourseCard } from "../courses/coursecard";
import { courses, type Course } from "../../dummydata/courses";
import { FilterPanel } from "../courses/filterpanel";

// --- Main Page Component ---
export default function CourseListingPage() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // Mobile modal state
  const [desktopFilterOpen, setDesktopFilterOpen] = useState<boolean>(true); // Desktop sidebar state
  const [sortBy, setSortBy] = useState<string>("Most Popular");

  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] pb-12">
      {/* Mobile Filter Sidebar Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-[#1c2026] shadow-2xl overflow-y-auto">
            <FilterPanel
              onClose={() => setFilterOpen(false)}
              isSidebar={true}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#dfe2eb] mb-4 font-headline">
          All courses
        </h1>

        {/* Filter + Sort bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 border border-[#84948e] text-[#dfe2eb] text-sm font-semibold px-4 py-2 rounded hover:bg-[#181c22] transition-colors lg:hidden"
          >
            <span className="material-symbols-outlined">filter_list</span>
            Filter
          </button>

          {/* Desktop Filter Button (Moved to the top row) */}
          <button
            onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
            className="hidden lg:flex items-center gap-2 border border-[#84948e] text-[#dfe2eb] text-sm font-bold px-4 py-[9px] rounded hover:bg-[#181c22] transition-colors cursor-pointer"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              filter_list
            </span>
            Filter
          </button>

          {/* Sort By Dropdown */}
          <div className="flex flex-col relative">
            <label className="text-xs text-[#84948e] absolute -top-2 left-2 bg-[#10141a] px-1 font-medium z-10">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#84948e] text-sm text-[#dfe2eb] font-bold rounded px-4 py-2.5 focus:outline-none focus:border-[#6fffd9] bg-[#10141a] cursor-pointer appearance-none pr-10 relative z-0"
            >
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#84948e] z-10">
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          <span className="ml-auto text-sm text-[#84948e] font-medium hidden sm:block">
            10,000 results
          </span>
        </div>

        {/* Main Content Area
         */}
        <div className="flex overflow-hidden">
          {/* Desktop Sidebar Filters */}
          <aside
            className={`hidden lg:block flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              desktopFilterOpen ? "w-64 mr-8 opacity-100" : "w-0 mr-0 opacity-0"
            }`}
          >
            <div className="w-64 text-on-surface font-headline">
              <div className="sticky top-6">
                <FilterPanel isSidebar={false} />
              </div>
            </div>
          </aside>

          {/* Course List */}
          <main className="flex-1 min-w-0">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}

            {/*Dummy Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-10">
              {[
                { label: "‹", page: null },
                { label: "1", page: 1 },
                { label: "2", page: 2, active: true },
                { label: "3", page: 3 },
                { label: "...", page: null },
                { label: "625", page: 625 },
                { label: "›", page: null },
              ].map((item, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
                    ${item.active ? "bg-[#00e5bc] text-[#00382c] font-bold" : "text-[#dfe2eb] font-medium hover:bg-[#1c2026]"}
                    ${!item.page ? "cursor-default text-[#84948e] hover:bg-transparent" : "cursor-pointer"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
