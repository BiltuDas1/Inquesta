import { useState, useMemo } from "react";
import type { Assignment } from "../components/assignmenttable";
import AssignmentTable from "../components/assignmenttable";


type FilterOption = "All" | "Pending" | "Submitted" | "Graded";

export default function AssignmentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

  // --- Mock Data ---
  const assignmentsData: Assignment[] = useMemo(
    () => [
      { id: "1", subject: "Mathematics", title: "Problem set 4 — Quadratic equations", dueDate: "8 May", status: "Pending", score: "—" },
      { id: "2", subject: "History", title: "Essay: Causes of WWI (500 words)", dueDate: "10 May", status: "Draft saved", score: "—" },
      { id: "3", subject: "Science", title: "Lab report: Photosynthesis experiment", dueDate: "12 May", status: "Not started", score: "—" },
      { id: "4", subject: "English", title: "Chapter 5 comprehension questions", dueDate: "6 May", status: "Submitted", score: "—" },
      { id: "5", subject: "Mathematics", title: "Problem set 3 — Linear equations", dueDate: "2 May", status: "Graded", score: "88/100" },
      { id: "6", subject: "Science", title: "Quiz: Periodic table", dueDate: "30 Apr", status: "Graded", score: "76/100" },
    ],
    []
  );

  const filters: FilterOption[] = ["All", "Pending", "Submitted", "Graded"];

  // --- Filtering Logic ---
  const filteredAssignments = useMemo(() => {
    if (activeFilter === "All") return assignmentsData;
    
    return assignmentsData.filter((assignment) => {
      // Grouping unsubmitted states under the "Pending" filter tab
      if (activeFilter === "Pending") {
        return ["Pending", "Draft saved", "Not started"].includes(assignment.status);
      }
      return assignment.status === activeFilter;
    });
  }, [activeFilter, assignmentsData]);

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb]">
      
      {/* --- Header Section --- */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">Assignments</h1>
        <p className="text-[#84948e] mt-1">All assignments — track submissions and grades</p>
      </div>

      {/* --- Filters Section --- */}
      <div className="flex flex-wrap gap-3 mb-6 shrink-0">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeFilter === filter
                ? "bg-[#262a31] border-[#6fffd9] text-[#6fffd9] shadow-[0_0_10px_rgba(111,255,217,0.1)]"
                : "bg-transparent border-[#3b4a44] text-[#b9cac3] hover:bg-[#1c2026] hover:text-[#dfe2eb] hover:border-[#84948e]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* --- Extracted Table Component --- */}
      <AssignmentTable assignments={filteredAssignments} />
      
    </div>
  );
}