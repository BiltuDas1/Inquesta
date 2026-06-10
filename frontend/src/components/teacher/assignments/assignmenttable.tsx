interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  totalSubmission: number;
  isPublished: boolean;
}

interface AssignmentTableProps {
  assignments: Assignment[];
  loading: boolean;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onShowStats: (assignment: Assignment) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function AssignmentTable({
  assignments,
  loading,
  onEdit,
  onDelete,
  onShowStats,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: AssignmentTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-4">
      <div className="overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="text-center py-12 text-[#6fffd9] font-medium">
            Loading assignments...
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm min-w-[900px]">
            <thead>
              <tr className="bg-[#181c22] text-[#b9cac3] border-b border-[#3b4a44] uppercase tracking-wider text-[0.75rem] font-bold">
                <th className="py-4 px-6">Course Name</th>
                <th className="py-4 px-6">Assignment Title</th>
                <th className="py-4 px-6">Created Date</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a44]/50">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-[#b9cac3]">
                    No assignments found
                  </td>
                </tr>
              ) : (
                assignments.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#262a31]/50 transition-colors group"
                  >
                    <td className="py-4 px-6 font-semibold text-[#dfe2eb]">
                      {row.courseName}
                    </td>
                    <td className="py-4 px-6 text-[#dfe2eb] font-medium">
                      {row.assignmentName}
                    </td>
                    <td className="py-4 px-6 text-[#b9cac3]">
                      {formatDate(row.creationDate)}
                    </td>
                    <td className="py-4 px-6 text-[#b9cac3]">
                      {formatDate(row.dueDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-bold ${row.isPublished
                          ? "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"
                          : "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20"
                          }`}
                      >
                        {row.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onShowStats(row)}
                          className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#6fffd9] cursor-pointer hover:bg-[#6fffd9]/10 transition-colors"
                        >
                          Reports
                        </button>
                        <button
                          onClick={() => onEdit(row)}
                          disabled={row.isPublished}
                          className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#3b4a44]/50 transition-colors disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#ffb4ab]/10 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination inside the card container ── */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-[#3b4a44] flex items-center justify-between bg-[#1c2026]">
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
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${currentPage === index + 1
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
    </div>
  );
}
