// // ── Types ──
// export type TeacherStatus = "Active" | "Pending" | "Inactive";

// export interface Teacher {
//   id: string;
//   name: string;
//   email: string;
//   qualification: string;
//   status: "Active" | "Inactive" | "Pending";
//   experience?: string; // <-- Add the ? to make it optional
//   subject?: string;    // <-- Add the ? to make it optional
// }

// interface TeacherTableProps {
//   teachers: Teacher[];
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number | ((prev: number) => number)) => void;
//   onEdit: (id: string) => void;
//   onDelete: (id: string) => void;
// }

// export default function TeacherTable({
//   teachers,
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
//   onEdit,
//   onDelete,
// }: TeacherTableProps) {
//   // ── Render Helpers ──
//   const getStatusStyles = (status: TeacherStatus) => {
//     switch (status) {
//       case "Active":
//         return "bg-[#00e5bc]/10 text-[#6fffd9] border-[#00e5bc]/30";
//       case "Pending":
//         return "bg-[#343d96]/40 text-[#bdc2ff] border-[#343d96]";
//       case "Inactive":
//         return "bg-[#93000a]/40 text-[#ffb4ab] border-[#93000a]/50";
//       default:
//         return "bg-[#262a31] text-[#b9cac3] border-[#3b4a44]";
//     }
//   };

//   return (
//     <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm flex flex-col">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse min-w-[900px]">
//           <thead>
//             <tr className="bg-[#262a31] border-b border-[#3b4a44] text-[#b9cac3] font-headline text-sm uppercase tracking-wider">
//               <th className="px-6 py-4 font-semibold">Teacher</th>
//               <th className="px-6 py-4 font-semibold">Subject</th>
//               <th className="px-6 py-4 font-semibold">Qualification</th>
//               <th className="px-6 py-4 font-semibold">Exp.</th>
//               <th className="px-6 py-4 font-semibold text-center">Status</th>
//               <th className="px-6 py-4 font-semibold text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#3b4a44]">
//             {teachers.length > 0 ? (
//               teachers.map((teacher) => (
//                 <tr
//                   key={teacher.id}
//                   className="hover:bg-[#262a31]/50 transition-colors group"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-[#3b4a44] border border-[#84948e] flex items-center justify-center text-[#dfe2eb] font-bold font-headline">
//                         {teacher.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-[#dfe2eb]">
//                           {teacher.name}
//                         </div>
//                         <div className="text-xs text-[#84948e] mt-0.5">
//                           {teacher.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-[#b9cac3]">
//                     {teacher.subject}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-[#b9cac3]">
//                     {teacher.qualification}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-[#b9cac3]">
//                     {teacher.experience}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(
//                         teacher.status
//                       )}`}
//                     >
//                       {teacher.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => onEdit(teacher.id)}
//                         className="w-8 h-8 rounded-full flex items-center justify-center text-[#b9cac3] hover:text-[#6fffd9] hover:bg-[#6fffd9]/10 transition-colors"
//                         title="Edit"
//                       >
//                         <span className="material-symbols-outlined text-[18px]">
//                           edit
//                         </span>
//                       </button>
//                       <button
//                         onClick={() => onDelete(teacher.id)}
//                         className="w-8 h-8 rounded-full flex items-center justify-center text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors"
//                         title="Delete"
//                       >
//                         <span className="material-symbols-outlined text-[18px]">
//                           delete
//                         </span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="px-6 py-12 text-center text-[#84948e]">
//                   <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
//                     sentiment_dissatisfied
//                   </span>
//                   <p>No teachers found matching your criteria.</p>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Pagination ── */}
//       {totalPages > 0 && (
//         <div className="px-6 py-4 border-t border-[#3b4a44] flex items-center justify-between bg-[#1c2026]">
//           <p className="text-sm text-[#84948e]">
//             Showing <span className="font-semibold text-[#dfe2eb]">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
//             <span className="font-semibold text-[#dfe2eb]">
//               {Math.min(currentPage * itemsPerPage, totalItems)}
//             </span>{" "}
//             of <span className="font-semibold text-[#dfe2eb]">{totalItems}</span> results
//           </p>
          
//           <div className="flex gap-2">
//             <button
//               onClick={() => onPageChange((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <span className="material-symbols-outlined text-[18px]">chevron_left</span>
//             </button>
            
//             <div className="flex gap-1">
//               {Array.from({ length: totalPages }).map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => onPageChange(index + 1)}
//                   className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
//                     currentPage === index + 1
//                       ? "bg-[#6fffd9] text-[#00382c]"
//                       : "border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <span className="material-symbols-outlined text-[18px]">chevron_right</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";

// ── Types ──
export type TeacherStatus = "Active" | "Pending" | "Inactive";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  qualification: string;
  status: "Active" | "Inactive" | "Pending";
}

interface TeacherTableProps {
  teachers: Teacher[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TeacherTable({
  teachers,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}: TeacherTableProps) {
  // ── Render Helpers ──
  const getStatusStyles = (status: TeacherStatus) => {
    switch (status) {
      case "Active":
        return "bg-[#00e5bc]/10 text-[#6fffd9] border-[#00e5bc]/30";
      case "Pending":
        return "bg-[#343d96]/40 text-[#bdc2ff] border-[#343d96]";
      case "Inactive":
        return "bg-[#93000a]/40 text-[#ffb4ab] border-[#93000a]/50";
      default:
        return "bg-[#262a31] text-[#b9cac3] border-[#3b4a44]";
    }
  };

  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#262a31] border-b border-[#3b4a44] text-[#b9cac3] font-headline text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Teacher</th>
              <th className="px-6 py-4 font-semibold">Qualification</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b4a44]">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-[#262a31]/50 transition-colors group"
                >
                  {/* Teacher Name & Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b4a44] border border-[#84948e] flex items-center justify-center text-[#dfe2eb] font-bold font-headline uppercase">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#dfe2eb]">
                          {teacher.name}
                        </div>
                        <div className="text-xs text-[#84948e] mt-0.5">
                          {teacher.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Qualification */}
                  <td className="px-6 py-4 text-sm text-[#b9cac3]">
                    {teacher.qualification}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(
                        teacher.status
                      )}`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(teacher.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#b9cac3] hover:text-[#6fffd9] hover:bg-[#6fffd9]/10 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(teacher.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Updated colSpan from 6 to 4 to match the new column count */}
                <td colSpan={4} className="px-6 py-12 text-center text-[#84948e]">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                    sentiment_dissatisfied
                  </span>
                  <p>No teachers found matching your criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-[#3b4a44] flex items-center justify-between bg-[#1c2026]">
          <p className="text-sm text-[#84948e]">
            Showing <span className="font-semibold text-[#dfe2eb]">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
            <span className="font-semibold text-[#dfe2eb]">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-[#dfe2eb]">{totalItems}</span> results
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange((p) => Math.max(1, p - 1))}
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
              onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
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