import { useMemo, useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Course } from "../types/courses";
import { FilterPanel } from "../components/filterpanel";
import { NumberedCursorPagination } from "../../../shared/components/cursorpagination";
import { CourseCard } from "../components/coursecard";
import { useLocation } from "react-router";

// --- 1. GraphQL Queries ---

// Standard query to get default courses
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
        slug
      }
    }
  }
`;

// New query for searching courses (Fixed Types & Data Wrapper)
const SEARCH_COURSES = gql`
  query searchCourses(
    $lastID: String
    $lastRelevance: Float
    $limit: Int!
    $text: String!
  ) {
    searchCourses(
      lastID: $lastID
      lastRelevance: $lastRelevance
      limit: $limit
      text: $text
    ) {
      data {
        id
        title
        description
        instructorName
        duration
        level
        price
        icon
        slug
        relevance
      }
    }
  }
`;

// --- 2. TypeScript Interfaces ---
interface GetCoursesResponse {
  courseGet: {
    success: boolean;
    message: string;
    data: Course[];
  };
}

// Extend Course to include relevance for the search results
interface SearchableCourse extends Course {
  relevance?: number;
}

interface SearchCoursesResponse {
  searchCourses: {
    data: SearchableCourse[];
  };
}

// --- Main Page Component ---
export default function CourseListingPage() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // Mobile modal state
  const [desktopFilterOpen, setDesktopFilterOpen] = useState<boolean>(true); // Desktop sidebar state

  // ---Init from URL Params ---
  // const searchParams = useMemo(
  //   () => new URLSearchParams(window.location.search),
  //   [window.location.search],
  // );
  const location = useLocation();

  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const initialPage = parseInt(searchParams.get("p") || "1", 10);
  const searchQuery = searchParams.get("q"); // Read search term from Navbar URL
  const initialCursorID = searchParams.get("cursor");
  const initialCursorRel = searchParams.get("rel");

  console.log("Search", searchQuery);

  const [lastID, setLastID] = useState<string | null>(initialCursorID);
  const [lastRelevance, setLastRelevance] = useState<string | null>(
    initialCursorRel,
  );
  const [page, setPage] = useState<number>(initialPage);

  // History now tracks BOTH ID and Relevance so we can navigate backwards accurately during search
  const [cursorHistory, setCursorHistory] = useState<
    { id: string | null; rel: string | null }[]
  >([]);

  // Reset pagination if the search query changes in the URL
  useEffect(() => {
    setLastID(null);
    setLastRelevance(null);
    setPage(1);
    setCursorHistory([]);
  }, [searchQuery]);

  // ---URL Update Helper ---
  const updateURL = (
    newPage: number,
    newID: string | null,
    newRel: string | null = null,
  ) => {
    const url = new URL(window.location.href);
    url.searchParams.set("p", newPage.toString());

    if (newID) {
      url.searchParams.set("cursor", newID);
    } else {
      url.searchParams.delete("cursor");
    }

    if (newRel) {
      url.searchParams.set("rel", newRel);
    } else {
      url.searchParams.delete("rel");
    }

    // Use replaceState to avoid cluttering the browser's back button history
    window.history.replaceState({}, "", url.toString());
  };

  // --Conditional GraphQL Execution ---
  //Default Query (Runs if NO search query exists)
  const {
    loading: defaultLoading,
    error: defaultError,
    data: defaultData,
  } = useQuery<GetCoursesResponse>(GET_COURSES, {
    variables: { limit: 12, lastID: lastID }, // Strict Int for limit
    skip: !!searchQuery, // Skip this query if searchQuery exists
    fetchPolicy: "cache-and-network",
  });

  // Search Query (Runs if search query DOES exist)
  const {
    loading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery<SearchCoursesResponse>(SEARCH_COURSES, {
    variables: {
      text: searchQuery || "",
      limit: 12,
      lastID: lastID,
      lastRelevance: lastRelevance ? parseFloat(lastRelevance) : 0,
    },
    skip: !searchQuery, // Skip this query if searchQuery is empty/null
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  // Consolidate results based on which query ran
  const loading = defaultLoading || searchLoading;
  const error = defaultError || searchError;
  const appError =
    !searchQuery && defaultData?.courseGet?.success === false
      ? defaultData.courseGet.message
      : null;

  // Extract the courses array depending on response structure
  const courses: SearchableCourse[] = searchQuery
    ? (searchData?.searchCourses?.data ?? [])
    : (defaultData?.courseGet?.data ?? []);
  // ---  Pagination Data Prep ---
  const cleanCourses = courses.filter((course) => course.id !== lastID);

  // Show exactly 10 items to the user
  const displayCourses = cleanCourses.slice(0, 10);

  // If the backend gave us the look-ahead item (11 items total), a next page exists
  const hasNextPage = cleanCourses.length > 10;

  // --- 5. Pagination Handlers ---
  const handleNextPage = () => {
    if (hasNextPage && displayCourses.length > 0) {
      const lastItem = displayCourses[displayCourses.length - 1];
      const newCursorID = lastItem.id;
      const newCursorRel = lastItem.relevance
        ? lastItem.relevance.toString()
        : "0.0";

      setCursorHistory((prev) => [...prev, { id: lastID, rel: lastRelevance }]);
      setLastID(newCursorID);
      setLastRelevance(newCursorRel);
      setPage((p) => p + 1);

      updateURL(page + 1, newCursorID, searchQuery ? newCursorRel : null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToFirst = () => {
    setLastID(null);
    setLastRelevance(null);
    setCursorHistory([]);
    setPage(1);
    updateURL(1, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      const prev = newHistory.pop() || { id: null, rel: null };

      setCursorHistory(newHistory);
      setLastID(prev.id);
      setLastRelevance(prev.rel);
      setPage((p) => p - 1);

      updateURL(page - 1, prev.id, searchQuery ? prev.rel : null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page > 1) {
      // FIX FOR REFRESH: If they refresh on page 2+, history is lost.
      // Jump them back to Page 1 safely so they aren't stuck.
      handleJumpToFirst();
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
          {searchQuery ? `Search Results for "${searchQuery}"` : "All courses"}
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
        </div>

        {/* Main Content Area */}
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

            {/* For No Course */}
            {!loading && !error && !appError && displayCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
                {/* Awesome Icon with subtle glow */}
                <div className="w-24 h-24 rounded-full bg-[#1c2026] border border-[#3b4a44] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(111,255,217,0.1)]">
                  <span className="material-symbols-outlined text-[#6fffd9] text-5xl">
                    {searchQuery ? "youtube_searched_for" : "auto_stories"}
                  </span>
                </div>

                {/* Styled Text */}
                <h3 className="text-[#dfe2eb] font-bold text-2xl mb-2 font-headline">
                  {searchQuery ? "No matches found" : "No courses available"}
                </h3>
                <p className="text-[#84948e] max-w-sm mb-8 leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any courses matching "${searchQuery}". Try searching for a different topic or keyword.`
                    : "It looks like our library is still growing. Please check back later!"}
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {(cursorHistory.length > 0 || page > 1) && (
                    <button
                      onClick={handlePreviousPage}
                      className="px-6 py-3 bg-[#1c2026] text-[#dfe2eb] border border-[#3b4a44] font-bold rounded-lg hover:border-[#6fffd9] transition-all"
                    >
                      Go Back
                    </button>
                  )}

                  {searchQuery ? (
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete("q");
                        window.history.replaceState({}, "", url.toString());
                        window.location.reload();
                      }}
                      className="px-6 py-3 bg-[#6fffd9] text-[#10141a] font-bold rounded-lg hover:bg-[#5cebc5] transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)]"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={handleJumpToFirst}
                      className="px-6 py-3 bg-[#6fffd9] text-[#10141a] font-bold rounded-lg hover:bg-[#5cebc5] transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)]"
                    >
                      Return Home
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Render Courses */}
            {!loading &&
              displayCourses.map((course: SearchableCourse) => (
                <CourseCard key={course.id} course={course} />
              ))}

            {/* Pagination controls only show if there are courses on screen */}
            {!loading && displayCourses.length > 0 && (
              <NumberedCursorPagination
                page={page}
                hasNext={hasNextPage}
                hasPrevious={cursorHistory.length > 0 || page > 1}
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
