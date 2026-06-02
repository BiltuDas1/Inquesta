import { useState } from "react";

// --- Types ---
type GradedStatus = "none" | "partial" | "complete" | "empty";

interface AssignmentRecord {
  id: string;
  className: string;
  title: string;
  due: string;
  submissions: {
    value: string;
    isComplete: boolean;
  };
  graded: {
    value: string;
    status: GradedStatus;
  };
  action: string;
}

export default function AssignmentsPage() {
  const [activeFilter, setActiveFilter] = useState("Pending grading");
  const filters = ["All", "Pending grading", "Published", "Draft"];

  // --- Mock Data (Based on the image) ---
  const assignments: AssignmentRecord[] = [
    {
      id: "1",
      className: "8A",
      title: "Algebra test — Chapter 4",
      due: "5 May",
      submissions: { value: "32/34", isComplete: false },
      graded: { value: "0", status: "none" },
      action: "Grade",
    },
    {
      id: "2",
      className: "9B",
      title: "Geometry homework — Circles",
      due: "7 May",
      submissions: { value: "28/30", isComplete: false },
      graded: { value: "12", status: "partial" },
      action: "Continue",
    },
    {
      id: "3",
      className: "8B",
      title: "Problem set 3 — Fractions",
      due: "3 May",
      submissions: { value: "30/30", isComplete: true },
      graded: { value: "30", status: "complete" },
      action: "Done",
    },
    {
      id: "4",
      className: "10A",
      title: "Mid-term revision sheet",
      due: "9 May",
      submissions: { value: "22/36", isComplete: false },
      graded: { value: "0", status: "none" },
      action: "Grade",
    },
    {
      id: "5",
      className: "9A",
      title: "Statistics — Data collection",
      due: "12 May",
      submissions: { value: "—", isComplete: false },
      graded: { value: "—", status: "empty" },
      action: "Draft",
    },
  ];

  // Helper functions for badge styling
  const getGradedBadgeStyle = (status: GradedStatus) => {
    switch (status) {
      case "none":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20"; // Error (Red)
      case "partial":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"; // Warning (Amber)
      case "complete":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"; // Primary Container (Green)
      case "empty":
      default:
        return "bg-[#31353c] text-[#84948e] border border-[#3b4a44]"; // Neutral surface
    }
  };

  const getSubmissionsStyle = (isComplete: boolean) => {
    if (isComplete) {
      return "bg-[#00e5bc]/10 text-[#00e5bc] px-2 py-0.5 rounded-full border border-[#00e5bc]/20 text-[13px] font-bold";
    }
    return "text-[#b9cac3]";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Assignments
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Manage, create, and grade assignments
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-[#343d96] text-[#bdc2ff] border border-[#343d96]" // Using secondary container for active
                : "bg-[#1c2026] text-[#b9cac3] border border-[#3b4a44] hover:bg-[#262a31] hover:text-[#dfe2eb]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#262a31] text-[#dfe2eb] border-b border-[#3b4a44]">
                <th className="py-4 px-6 font-semibold w-[10%]">Class</th>
                <th className="py-4 px-6 font-semibold w-[35%]">
                  Assignment title
                </th>
                <th className="py-4 px-6 font-semibold w-[15%]">Due</th>
                <th className="py-4 px-6 font-semibold w-[15%]">Submissions</th>
                <th className="py-4 px-6 font-semibold w-[15%]">Graded</th>
                <th className="py-4 px-6 font-semibold w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a44]/50">
              {assignments.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#31353c]/50 transition-colors group"
                >
                  <td className="py-4 px-6 font-medium text-[#dfe2eb]">
                    {row.className}
                  </td>
                  <td className="py-4 px-6 text-[#dfe2eb]">{row.title}</td>
                  <td className="py-4 px-6 text-[#b9cac3]">{row.due}</td>
                  <td className="py-4 px-6">
                    <span
                      className={getSubmissionsStyle(
                        row.submissions.isComplete,
                      )}
                    >
                      {row.submissions.value}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-bold min-w-[28px] ${getGradedBadgeStyle(
                        row.graded.status,
                      )}`}
                    >
                      {row.graded.value}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-[#6fffd9] hover:text-[#00e5bc] font-medium transition-colors focus:outline-none">
                      {row.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action Button ── */}
      <div className="pt-2">
        <button className="bg-[#343d96] hover:bg-[#1b247f] border border-[#a8afff]/20 text-[#bdc2ff] font-semibold py-2.5 px-5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm focus:outline-none">
          <span className="text-lg leading-none">+</span> Create new assignment
        </button>
      </div>
    </div>
  );
}
