import { useMemo, useState } from "react";
import { CourseCard } from "../courses/coursecard";
import { FilterPanel } from "../courses/filterpanel";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Course } from "../../types/courses";
import { NumberedCursorPagination } from "../ui/cursorpagination";

// Query to get courses
const GET_COURSES = gql`
  query GetCourses($limit: Int!, $lastID: String) {
    courseGet(limit: $limit, lastID: $lastID) {
      success
      message
      data {
        id
        title
        description
        instructorName
        duration
        level
        price
        icon
      }
    }
  }
`;
// Define the exact shape of what the GraphQL query returns
interface GetCoursesResponse {
  courseGet: {
    success: boolean;
    message: string;
    data: Course[];
  };
}

// --- Main Page Component ---
export default function CourseListingPage() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // Mobile modal state
  const [desktopFilterOpen, setDesktopFilterOpen] = useState<boolean>(true); // Desktop sidebar state
  const [sortBy, setSortBy] = useState<string>("Most Popular");

  // --- 1. Init from URL Params ---
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const initialCursor = searchParams.get("cursor");
  const initialPage = parseInt(searchParams.get("p") || "1", 10);

  const [lastID, setLastID] = useState<string | null>(initialCursor);
  const [page, setPage] = useState<number>(initialPage);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  // ---  URL Update Helper ---
  const updateURL = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", newPage.toString());

    // if (newCursor) {
    //   url.searchParams.set("cursor", newCursor);
    // } else {
    //   url.searchParams.delete("cursor");
    // }
    window.history.pushState({}, "", url.toString());
  };

  const { loading, error, data } = useQuery<GetCoursesResponse>(GET_COURSES, {
    variables: { limit: 12, lastID: lastID },
    fetchPolicy: "cache-and-network",
  });

  const courses: Course[] = data?.courseGet?.data || [];
  const appError =
    data?.courseGet?.success === false ? data.courseGet.message : null;

  // ---  Pagination Data Prep ---
  // Filter out the duplicate item caused by the backend's 'lte' logic
  const cleanCourses = courses.filter((course) => course.id !== lastID);

  // Show exactly 10 items to the user
  const displayCourses = cleanCourses.slice(0, 10);

  // If the backend gave us the max limit (11), we assume a next page MIGHT exist
  const hasNextPage = cleanCourses.length > 10;

  // ---  Pagination Handlers ---
  const handleNextPage = () => {
    if (hasNextPage && displayCourses.length > 0) {
      const newCursor = displayCourses[displayCourses.length - 1].id;
      setCursorHistory((prev) => [...prev, lastID || ""]);
      setLastID(newCursor);
      setPage((p) => p + 1);
      updateURL(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Add this beneath handlePreviousPage ---
  const handleJumpToFirst = () => {
    setLastID(null); // Reset cursor
    setCursorHistory([]); // Clear history
    setPage(1); // Reset page number
    updateURL(1); // Update URL
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      const prevCursor = newHistory.pop() || null;
      setCursorHistory(newHistory);
      setLastID(prevCursor === "" ? null : prevCursor);
      setPage((p) => p - 1);
      updateURL(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
            {loading && (
              <p className="text-[#84948e] py-4 text-center">
                Loading courses...
              </p>
            )}

            {(error || appError) && (
              <p className="text-red-400 py-4 text-center bg-red-900/20 rounded border border-red-500/50">
                Error: {error?.message || appError}
              </p>
            )}

            {/* The Ghost Page Fallback UI */}
            {!loading && !error && !appError && displayCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <span className="material-symbols-outlined text-[#84948e] text-5xl mb-4">
                  inventory_2
                </span>
                <p className="text-[#dfe2eb] font-bold text-lg mb-2">
                  End of the Line!
                </p>
                <p className="text-[#84948e] mb-6">
                  You have reached the end of the courses list.
                </p>
                {cursorHistory.length > 0 && (
                  <button
                    onClick={handlePreviousPage}
                    className="px-6 py-2 bg-[#6a35ff] text-white font-bold rounded hover:bg-[#5a2ce0] transition-colors"
                  >
                    Go Back to Previous Page
                  </button>
                )}
              </div>
            )}

            {/* Render Courses */}
            {!loading &&
              displayCourses.map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}

            {/* Pagination controls only show if there are courses on screen */}
            {!loading && displayCourses.length > 0 && (
              <NumberedCursorPagination
                page={page}
                hasNext={hasNextPage}
                hasPrevious={cursorHistory.length > 0}
                onNext={handleNextPage}
                onPrevious={handlePreviousPage}
                onJumpToFirst={handleJumpToFirst}
              
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
