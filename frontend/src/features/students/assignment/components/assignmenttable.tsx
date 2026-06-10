import { useState } from "react";

export type AssignmentStatus = "not started" | "in progress" | "completed";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  creationDate: string;
  dueDate: string | null;
  status: AssignmentStatus;
}

interface AssignmentTableProps {
  assignments: Assignment[];
  onStatusChange: (assignmentId: string, newStatus: AssignmentStatus) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function AssignmentTable({
  assignments,
  onStatusChange,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: AssignmentTableProps) {
  const [activeDetailsAssignment, setActiveDetailsAssignment] = useState<Assignment | null>(null);

  // Helper to color-code the status badges / select element
  const getStatusStyles = (status: AssignmentStatus) => {
    switch (status) {
      case "not started":
        return "bg-[#84948e]/10 text-[#84948e] border-[#84948e]/30 hover:border-[#84948e]/60";
      case "in progress":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30 hover:border-[#ffb4ab]/60";
      case "completed":
        return "bg-[#6fffd9]/10 text-[#6fffd9] border-[#6fffd9]/30 hover:border-[#6fffd9]/60";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getBadgeStatusStyles = (status: AssignmentStatus) => {
    switch (status) {
      case "not started":
        return "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20";
      case "in progress":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "completed":
        return "bg-[#6fffd9]/10 text-[#6fffd9] border border-[#6fffd9]/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    // min-h-0 and overflow-auto allow this container to scroll independently. Removed flex-1 so height matches content size.
    <div className="min-h-0 overflow-auto custom-scrollbar rounded-xl border border-[#3b4a44] bg-[#1c2026] shadow-lg flex flex-col justify-between">
      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          {/* Table Header */}
          <thead className="bg-[#262a31] sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[15%]">
                Course
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[20%]">
                Assignment
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[20%]">
                Description
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[12%]">
                Created Date
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[12%]">
                Due Date
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[13%]">
                Status
              </th>
              <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[8%]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#3b4a44]/50">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="hover:bg-[#262a31]/40 transition-colors group"
                >
                  <td className="py-4 px-6 text-[#dfe2eb] font-medium text-sm">
                    {assignment.subject}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm group-hover:text-[#dfe2eb] transition-colors font-semibold">
                    {assignment.title}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm max-w-[200px] truncate" title={assignment.description}>
                    {assignment.description || "No description provided"}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm whitespace-nowrap">
                    {formatDate(assignment.creationDate)}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm whitespace-nowrap">
                    {formatDate(assignment.dueDate)}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={assignment.status}
                      onChange={(e) => onStatusChange(assignment.id, e.target.value as AssignmentStatus)}
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border bg-[#10141a] cursor-pointer outline-none transition-all ${getStatusStyles(assignment.status)}`}
                    >
                      <option value="not started" className="bg-[#1c2026] text-[#84948e]">
                        Not Started
                      </option>
                      <option value="in progress" className="bg-[#1c2026] text-[#ffb4ab]">
                        In Progress
                      </option>
                      <option value="completed" className="bg-[#1c2026] text-[#6fffd9]">
                        Completed
                      </option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setActiveDetailsAssignment(assignment)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#262a31] border border-[#3b4a44] text-[#6fffd9] hover:bg-[#323842] hover:border-[#6fffd9]/50 rounded-[8px] text-xs font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#84948e]">
                  No assignments found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-[#3b4a44] flex items-center justify-between bg-[#1c2026] shrink-0">
          <p className="text-sm text-[#84948e]">
            Showing <span className="font-semibold text-[#dfe2eb]">{totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
            <span className="font-semibold text-[#dfe2eb]">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-[#dfe2eb]">{totalItems}</span> results
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onPageChange(index + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                    currentPage === index + 1
                      ? "bg-[#6fffd9] text-[#00382c]"
                      : "border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* --- Detailed View Modal --- */}
      {activeDetailsAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#dfe2eb] animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#3b4a44] flex items-center justify-between bg-[#262a31]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6fffd9] font-bold font-headline bg-[#6fffd9]/10 px-2.5 py-1 rounded-md">
                  {activeDetailsAssignment.subject}
                </span>
                <h3 className="text-xl font-bold font-headline text-[#dfe2eb] mt-2">
                  Assignment Details
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailsAssignment(null)}
                className="w-8 h-8 rounded-full bg-[#1c2026] hover:bg-[#3b4a44] text-[#b9cac3] hover:text-[#dfe2eb] flex items-center justify-center transition-colors border border-[#3b4a44]/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {/* Title */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#84948e] font-semibold">
                  Title
                </h4>
                <p className="text-base text-[#dfe2eb] font-semibold mt-1">
                  {activeDetailsAssignment.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#84948e] font-semibold">
                  Description
                </h4>
                <div className="bg-[#10141a] border border-[#3b4a44]/40 rounded-xl p-4 text-sm text-[#b9cac3] whitespace-pre-wrap leading-relaxed mt-1.5">
                  {activeDetailsAssignment.description || "No description provided."}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#84948e] font-semibold">
                    Creation Date
                  </h4>
                  <p className="text-sm text-[#dfe2eb] mt-1 font-medium">
                    {formatDate(activeDetailsAssignment.creationDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#84948e] font-semibold">
                    Due Date
                  </h4>
                  <p className="text-sm text-[#dfe2eb] mt-1 font-medium">
                    {formatDate(activeDetailsAssignment.dueDate)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2">
                <h4 className="text-xs uppercase tracking-wider text-[#84948e] font-semibold mb-2">
                  Current Status
                </h4>
                <span className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeStatusStyles(activeDetailsAssignment.status)}`}>
                  {activeDetailsAssignment.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#262a31] border-t border-[#3b4a44] flex justify-end">
              <button
                onClick={() => setActiveDetailsAssignment(null)}
                className="px-5 py-2 bg-[#3b4a44] hover:bg-[#4d6158] text-[#dfe2eb] font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
