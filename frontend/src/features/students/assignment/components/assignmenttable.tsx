import React from "react";

// --- Types (Exported so the parent page can use them) ---
export type AssignmentStatus = "Pending" | "Draft saved" | "Not started" | "Submitted" | "Graded";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: AssignmentStatus;
  score: string;
}

interface AssignmentTableProps {
  assignments: Assignment[];
}

export default function AssignmentTable({ assignments }: AssignmentTableProps) {
  // Helper to color-code the status badges
  const getStatusStyles = (status: AssignmentStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "Draft saved":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Not started":
        return "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20";
      case "Submitted":
        return "bg-[#bdc2ff]/10 text-[#bdc2ff] border border-[#bdc2ff]/20";
      case "Graded":
        return "bg-[#6fffd9]/10 text-[#6fffd9] border border-[#6fffd9]/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    // min-h-0 and overflow-auto allow this container to scroll independently
    <div className="flex-1 min-h-0 overflow-auto custom-scrollbar rounded-xl border border-[#3b4a44] bg-[#1c2026] shadow-lg">
      <table className="w-full text-left border-collapse min-w-[800px]">
        
        {/* Table Header */}
        <thead className="bg-[#262a31] sticky top-0 z-10">
          <tr>
            <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[15%]">
              Subject
            </th>
            <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[40%]">
              Assignment
            </th>
            <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[15%]">
              Due date
            </th>
            <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[15%]">
              Status
            </th>
            <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] w-[15%]">
              Score
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
                <td className="py-4 px-6 text-[#b9cac3] text-sm group-hover:text-[#dfe2eb] transition-colors">
                  {assignment.title}
                </td>
                <td className="py-4 px-6 text-[#b9cac3] text-sm whitespace-nowrap">
                  {assignment.dueDate}
                </td>
                <td className="py-4 px-6">
                  <span 
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyles(assignment.status)}`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#b9cac3] font-medium text-sm">
                  {assignment.score}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center text-[#84948e]">
                No assignments found for this filter.
              </td>
            </tr>
          )}
        </tbody>
        
      </table>
    </div>
  );
}