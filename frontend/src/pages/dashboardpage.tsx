// import { useState, useMemo } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";

// // ── Types ───────────────────────────────────────────────────────────────────

// type Level = "Beginner" | "Intermediate" | "Advanced";

// // Course type
// interface Course {
//   id: string | number;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
// }

// // Course GET Response type
// interface CourseGetQueryResult {
//   courseGet: {
//     data: Course[];
//   };
// }

// // Course DELETE Response type
// interface DeleteCourseMutationResult {
//   courseDelete: {
//     message: string;
//     success: boolean;
//   };
// }

// // Course UPDATE Response type
// interface UpdateCourseMutationResult {
//   courseUpdate: {
//     message: string;
//     success: boolean;
//   };
// }

// // Convert the level into title case ──────────────────────────────────────────────────────────
// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const PER_PAGE = 5;
// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────

// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span
//       className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
//     >
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   onSave: (data: Omit<Course, "id">) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//   });

//   const inputClass =
//     "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass =
//     "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" && value === "" ? "" : value,
//     }));
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
//           {editing ? "Edit Course" : "Add New Course"}
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input
//                 name="title"
//                 className={inputClass}
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Advanced React Patterns"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select
//                   name="level"
//                   className={inputClass}
//                   value={formData.level}
//                   onChange={handleChange}
//                 >
//                   {LEVELS.map((l) => (
//                     <option key={l} value={l} className="bg-[#1c2026]">
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input
//                   name="instructorName"
//                   className={inputClass}
//                   value={formData.instructorName}
//                   onChange={handleChange}
//                   placeholder="Instructor name"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input
//                   name="duration"
//                   className={inputClass}
//                   type="text"
//                   value={formData.duration || ""}
//                   onChange={handleChange}
//                   placeholder="e.g. 24"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input
//                   name="price"
//                   className={inputClass}
//                   type="number"
//                   min={0}
//                   step="1"
//                   value={formData.price}
//                   onChange={handleChange}
//                   onKeyDown={(e) => {
//                     if (e.key === "." || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                   placeholder="0 = Free"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className={labelClass}>Course Description</label>
//             <textarea
//               name="description"
//               className={`${inputClass} flex-1 min-h-[200px] lg:min-h-0 resize-none`}
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Provide a detailed overview of the course content..."
//             />
//           </div>
//         </div>

//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button
//             onClick={onClose}
//             className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData)}
//             disabled={isSubmitting}
//             className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
//           >
//             {isSubmitting
//               ? "Saving..."
//               : editing
//                 ? "Save Changes"
//                 : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   // Fetch the course from DB
//   const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES);

//   // Add the course into the DB
//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, {
//     refetchQueries: [{ query: GET_COURSES }],
//   });

//   // Delete the selected course from the DB
//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(
//     DELETE_COURSE,
//     { refetchQueries: [{ query: GET_COURSES }] },
//   );

//   // Update the selected course
//   const [updateCourse, { loading: updating }] =
//     useMutation<UpdateCourseMutationResult>(UPDATE_COURSE, {
//       refetchQueries: [{ query: GET_COURSES }],
//     });

//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState<"add" | string | number | null>(null);

//   const courses: Course[] = data?.courseGet?.data || [];

//   const filtered = useMemo(
//     () =>
//       courses.filter((c) => {
//         if (
//           search &&
//           !c.title.toLowerCase().includes(search.toLowerCase()) &&
//           !c.instructorName.toLowerCase().includes(search.toLowerCase())
//         )
//           return false;
//         if (filterLevel && formatLevel(c.level) !== filterLevel) return false;
//         return true;
//       }),
//     [courses, search, filterLevel],
//   );

//   const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
//   const safePage = Math.min(page, pages);
//   const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

//   const editingCourse =
//     typeof modal === "string" || typeof modal === "number"
//       ? (courses.find((c) => c.id === modal) ?? null)
//       : null;

//   async function handleSave(formData: Omit<Course, "id">) {
//     try {
//       // Add course
//       if (modal == "add") {
//         await addCourse({
//           variables: {
//             title: formData.title,
//             description: formData.description,
//             level: formData.level,
//             instructor_name: formData.instructorName,
//             duration: String(formData.duration),
//             price: Number(formData.price),
//           },
//         });
//       }
//       // Update course
//       else if (modal != null) {
//         await updateCourse({
//           variables: {
//             id: String(modal), // The modal state holds the ID when editing
//             title: formData.title,
//             description: formData.description,
//             level: formData.level,
//             instructor_name: formData.instructorName,
//             duration: String(formData.duration),
//             price: Number(formData.price),
//           },
//         });
//       }

//       setModal(null);
//     } catch (e) {
//       console.error("Error saving course:", e);
//     }
//   }

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data } = await deleteCourse({
//           variables: { id },
//         });

//         if (data?.courseDelete?.success) {
//           console.log("Deleted:", data.courseDelete.message);
//         } else {
//           alert(`Delete failed: ${data?.courseDelete?.message}`);
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//         alert(`Error: ${e.message}`);
//       }
//     }
//   };

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
//         Error: {error.message}
//       </div>
//     );

//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                 Course Catalog
//               </h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                 Manage and monitor your learning content
//               </p>
//             </div>
//             <button
//               onClick={() => setModal("add")}
//               className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search courses or instructors..."
//                 className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//               />
//             </div>
//             <select
//               className={selectClass}
//               value={filterLevel}
//               onChange={(e) => {
//                 setFilterLevel(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => (
//                 <option key={o} value={o}>
//                   {o}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                     {["Course", "Level", "Duration", "Price", ""].map(
//                       (h, i) => (
//                         <th
//                           key={i}
//                           className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
//                         >
//                           {h}
//                         </th>
//                       ),
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {sliced.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="text-center p-12 text-[#b9cac3]"
//                       >
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     sliced.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="group hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0">
//                             <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
//                               {c.title}
//                             </div>
//                             <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
//                               Instructor: {c.instructorName}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-middle">
//                           <LevelBadge level={c.level} />
//                         </td>
//                         <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
//                           {c.duration}
//                         </td>
//                         <td className="p-4 align-middle">
//                           <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
//                             {c.price === 0 ? "Free" : `₹  ${c.price}`}
//                           </span>
//                         </td>
//                         <td className="p-4 align-middle text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => setModal(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center justify-between p-4 border-t border-[#3b4a44]">
//               <span className="text-[0.8rem] text-[#b9cac3]">
//                 Showing{" "}
//                 {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
//                 {Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
//                 {filtered.length}
//               </span>
//               <div className="flex gap-1">
//                 {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p)}
//                     className={`px-3 py-1 rounded-[8px] text-[0.8rem] border transition-all ${
//                       p === safePage
//                         ? "bg-[#6fffd9] text-[#00382c] border-[#6fffd9]"
//                         : "bg-[#262a31] text-[#b9cac3] border-[#3b4a44]"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {modal !== null && (
//         <CourseModal
//           editing={editingCourse}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }

// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";

// // ── Types ───────────────────────────────────────────────────────────────────

// type Level = "Beginner" | "Intermediate" | "Advanced";

// interface Course {
//   id: string | number;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
//   icon?: string; // <-- Added icon
// }

// // Added these interfaces to fix the "Property does not exist on type '{}'" error
// interface CourseGetQueryResult {
//   courseGet: {
//     data: Course[];
//   };
// }

// interface RequestUploadMutationResult {
//   request_upload: {
//     success: boolean;
//     message: string;
//     data: {
//       url: string;
//       filename: string;
//     };
//   };
// }

// interface DeleteCourseMutationResult {
//   courseDelete: {
//     message: string;
//     success: boolean;
//   };
// }

// interface UpdateCourseMutationResult {
//   courseUpdate: {
//     message: string;
//     success: boolean;
//   };
// }

// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const PER_PAGE = 5;
// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────

// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span
//       className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
//     >
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   // Updated onSave to accept the selected file
//   onSave: (data: Omit<Course, "id">, file: File | null) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//     icon: editing?.icon ?? "", // <-- Added icon
//   });

//   // <-- New States for Image Upload -->
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(editing?.icon || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const inputClass =
//     "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass =
//     "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" && value === "" ? "" : value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
//           {editing ? "Edit Course" : "Add New Course"}
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input
//                 name="title"
//                 className={inputClass}
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Advanced React Patterns"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select
//                   name="level"
//                   className={inputClass}
//                   value={formData.level}
//                   onChange={handleChange}
//                 >
//                   {LEVELS.map((l) => (
//                     <option key={l} value={l} className="bg-[#1c2026]">
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input
//                   name="instructorName"
//                   className={inputClass}
//                   value={formData.instructorName}
//                   onChange={handleChange}
//                   placeholder="Instructor name"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input
//                   name="duration"
//                   className={inputClass}
//                   type="text"
//                   value={formData.duration || ""}
//                   onChange={handleChange}
//                   placeholder="e.g. 24"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input
//                   name="price"
//                   className={inputClass}
//                   type="number"
//                   min={0}
//                   step="1"
//                   value={formData.price}
//                   onChange={handleChange}
//                   onKeyDown={(e) => {
//                     if (e.key === "." || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                   placeholder="0 = Free"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-4">
//             {/* <-- NEW: Image Upload Field (Placed neatly above description) --> */}
//             <div>
//               <label className={labelClass}>Course Thumbnail</label>
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     className="w-full h-full object-cover"
//                     alt="Preview"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center text-[#84948e]">
//                     <span className="material-symbols-outlined text-2xl mb-1">
//                       image
//                     </span>
//                     <span className="text-[0.75rem] font-headline font-semibold">
//                       Upload Image
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>

//             <div className="flex flex-col flex-1">
//               <label className={labelClass}>Course Description</label>
//               <textarea
//                 name="description"
//                 className={`${inputClass} flex-1 min-h-[140px] resize-none`}
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Provide a detailed overview of the course content..."
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button
//             onClick={onClose}
//             className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData, selectedFile)} // Passed file to onSave
//             disabled={isSubmitting}
//             className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
//           >
//             {isSubmitting
//               ? "Saving..."
//               : editing
//                 ? "Save Changes"
//                 : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   // Added generics <CourseGetQueryResult> to fix the TS error
//   const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES, {
//     variables: { lastID: "null", limit: 10 }, // Used your query variables
//   });

//   const [requestUpload] =
//     useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);

//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, {
//     refetchQueries: [
//       { query: GET_COURSES, variables: { lastID: "null", limit: 0 } },
//     ],
//   });

//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(
//     DELETE_COURSE,
//     {
//       refetchQueries: [
//         { query: GET_COURSES, variables: { lastID: "null", limit: 0 } },
//       ],
//     },
//   );

//   const [updateCourse, { loading: updating }] =
//     useMutation<UpdateCourseMutationResult>(UPDATE_COURSE, {
//       refetchQueries: [
//         { query: GET_COURSES, variables: { lastID: "null", limit: 0 } },
//       ],
//     });

//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState<"add" | string | number | null>(null);

//   const courses: Course[] = data?.courseGet?.data || [];

//   const filtered = useMemo(
//     () =>
//       courses.filter((c) => {
//         if (
//           search &&
//           !c.title.toLowerCase().includes(search.toLowerCase()) &&
//           !c.instructorName.toLowerCase().includes(search.toLowerCase())
//         )
//           return false;
//         if (filterLevel && formatLevel(c.level) !== filterLevel) return false;
//         return true;
//       }),
//     [courses, search, filterLevel],
//   );

//   const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
//   const safePage = Math.min(page, pages);
//   const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

//   const editingCourse =
//     typeof modal === "string" || typeof modal === "number"
//       ? (courses.find((c) => c.id === modal) ?? null)
//       : null;

//   async function handleSave(formData: Omit<Course, "id">, file: File | null) {
//     try {
//       let finalIcon = formData.icon;

//       // <-- NEW: Multi-step Image Upload Logic -->
//       if (file) {
//         const { data: uploadRes } = await requestUpload({
//           variables: { mimetype: file.type },
//         });

//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;

//           // Upload raw binary to pre-signed URL
//           await fetch(url, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//           });

//           finalIcon = filename; // Save filename for DB
//         }
//       }

//       // Prepare common variables mapping frontend to backend schema
//       const courseVars = {
//         title: formData.title,
//         description: formData.description,
//         level: formData.level,
//         instructor_name: formData.instructorName, // Mapped to backend naming
//         duration: String(formData.duration),
//         price: Number(formData.price),
//         icon: finalIcon, // Pass icon
//       };

//       if (modal === "add") {
//         await addCourse({ variables: courseVars });
//       } else if (modal != null) {
//         await updateCourse({ variables: { ...courseVars, id: String(modal) } });
//       }

//       setModal(null);
//     } catch (e) {
//       console.error("Error saving course:", e);
//     }
//   }

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data } = await deleteCourse({
//           variables: { id: String(id) },
//         });

//         if (data?.courseDelete?.success) {
//           console.log("Deleted:", data.courseDelete.message);
//         } else {
//           alert(`Delete failed: ${data?.courseDelete?.message}`);
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//         alert(`Error: ${e.message}`);
//       }
//     }
//   };

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
//         Error: {error.message}
//       </div>
//     );

//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                 Course Catalog
//               </h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                 Manage and monitor your learning content
//               </p>
//             </div>
//             <button
//               onClick={() => setModal("add")}
//               className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search courses or instructors..."
//                 className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//               />
//             </div>
//             <select
//               className={selectClass}
//               value={filterLevel}
//               onChange={(e) => {
//                 setFilterLevel(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => (
//                 <option key={o} value={o}>
//                   {o}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                     {["Course", "Level", "Duration", "Price", ""].map(
//                       (h, i) => (
//                         <th
//                           key={i}
//                           className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
//                         >
//                           {h}
//                         </th>
//                       ),
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {sliced.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="text-center p-12 text-[#b9cac3]"
//                       >
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     sliced.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="group hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           {/* <-- Tiny image preview in table added for visual feedback --> */}
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon && (
//                               <img
//                                 src={c.icon}
//                                 className="w-8 h-8 rounded object-cover flex-shrink-0 bg-black"
//                                 alt=""
//                               />
//                             )}
//                             <div>
//                               <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
//                                 {c.title}
//                               </div>
//                               <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
//                                 Instructor: {c.instructorName}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-middle">
//                           <LevelBadge level={c.level} />
//                         </td>
//                         <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
//                           {c.duration}
//                         </td>
//                         <td className="p-4 align-middle">
//                           <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
//                             {c.price === 0 ? "Free" : `₹  ${c.price}`}
//                           </span>
//                         </td>
//                         <td className="p-4 align-middle text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => setModal(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex items-center justify-between p-4 border-t border-[#3b4a44]">
//               <span className="text-[0.8rem] text-[#b9cac3]">
//                 Showing{" "}
//                 {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
//                 {Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
//                 {filtered.length}
//               </span>
//               <div className="flex gap-1">
//                 {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p)}
//                     className={`px-3 py-1 rounded-[8px] text-[0.8rem] border transition-all ${
//                       p === safePage
//                         ? "bg-[#6fffd9] text-[#00382c] border-[#6fffd9]"
//                         : "bg-[#262a31] text-[#b9cac3] border-[#3b4a44]"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {modal !== null && (
//         <CourseModal
//           editing={editingCourse}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }

// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { NumberedCursorPagination } from "../components/ui/cursorpagination";

// // ── Types ───────────────────────────────────────────────────────────────────

// type Level = "Beginner" | "Intermediate" | "Advanced";

// interface Course {
//   id: string | number;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
//   icon?: string;
// }

// interface CourseGetQueryResult {
//   courseGet: {
//     data: Course[];
//   };
// }

// interface RequestUploadMutationResult {
//   request_upload: {
//     success: boolean;
//     message: string;
//     data: {
//       url: string;
//       filename: string;
//     };
//   };
// }

// interface DeleteCourseMutationResult {
//   courseDelete: {
//     message: string;
//     success: boolean;
//   };
// }

// interface UpdateCourseMutationResult {
//   courseUpdate: {
//     message: string;
//     success: boolean;
//   };
// }

// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const PER_PAGE = 10;
// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────

// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span
//       className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
//     >
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   onSave: (data: Omit<Course, "id">, file: File | null) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//     icon: editing?.icon ?? "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(editing?.icon || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const inputClass =
//     "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass =
//     "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" && value === "" ? "" : value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
//           {editing ? "Edit Course" : "Add New Course"}
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input
//                 name="title"
//                 className={inputClass}
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Advanced React Patterns"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select
//                   name="level"
//                   className={inputClass}
//                   value={formData.level}
//                   onChange={handleChange}
//                 >
//                   {LEVELS.map((l) => (
//                     <option key={l} value={l} className="bg-[#1c2026]">
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input
//                   name="instructorName"
//                   className={inputClass}
//                   value={formData.instructorName}
//                   onChange={handleChange}
//                   placeholder="Instructor name"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input
//                   name="duration"
//                   className={inputClass}
//                   type="text"
//                   value={formData.duration || ""}
//                   onChange={handleChange}
//                   placeholder="e.g. 24"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input
//                   name="price"
//                   className={inputClass}
//                   type="number"
//                   min={0}
//                   step="1"
//                   value={formData.price}
//                   onChange={handleChange}
//                   onKeyDown={(e) => {
//                     if (e.key === "." || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                   placeholder="0 = Free"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-4">
//             <div>
//               <label className={labelClass}>Course Thumbnail</label>
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     className="w-full h-full object-cover"
//                     alt="Preview"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center text-[#84948e]">
//                     <span className="material-symbols-outlined text-2xl mb-1">
//                       image
//                     </span>
//                     <span className="text-[0.75rem] font-headline font-semibold">
//                       Upload Image
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>

//             <div className="flex flex-col flex-1">
//               <label className={labelClass}>Course Description</label>
//               <textarea
//                 name="description"
//                 className={`${inputClass} flex-1 min-h-[140px] resize-none`}
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Provide a detailed overview of the course content..."
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button
//             onClick={onClose}
//             className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData, selectedFile)}
//             disabled={isSubmitting}
//             className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
//           >
//             {isSubmitting
//               ? "Saving..."
//               : editing
//                 ? "Save Changes"
//                 : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES, {
//     variables: { lastID: "null", limit: 100 }, // Fetching enough to handle local pagination
//   });

//   const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);

//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, {
//     refetchQueries: [{ query: GET_COURSES, variables: { lastID: "null", limit: 100 } }],
//   });

//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE, {
//     refetchQueries: [{ query: GET_COURSES, variables: { lastID: "null", limit: 100 } }],
//   });

//   const [updateCourse, { loading: updating }] = useMutation<UpdateCourseMutationResult>(UPDATE_COURSE, {
//     refetchQueries: [{ query: GET_COURSES, variables: { lastID: "null", limit: 100 } }],
//   });

//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState<"add" | string | number | null>(null);

//   const courses: Course[] = data?.courseGet?.data || [];

//   const filtered = useMemo(
//     () =>
//       courses.filter((c) => {
//         if (
//           search &&
//           !c.title.toLowerCase().includes(search.toLowerCase()) &&
//           !c.instructorName.toLowerCase().includes(search.toLowerCase())
//         )
//           return false;
//         if (filterLevel && formatLevel(c.level) !== filterLevel) return false;
//         return true;
//       }),
//     [courses, search, filterLevel],
//   );

//   const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
//   const safePage = Math.min(page, pages);
//   const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

//   const editingCourse =
//     typeof modal === "string" || typeof modal === "number"
//       ? (courses.find((c) => c.id === modal) ?? null)
//       : null;

//   async function handleSave(formData: Omit<Course, "id">, file: File | null) {
//     try {
//       let finalIcon = formData.icon;

//       if (file) {
//         const { data: uploadRes } = await requestUpload({
//           variables: { mimetype: file.type },
//         });

//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
//           await fetch(url, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//           });
//           finalIcon = filename;
//         }
//       }

//       const courseVars = {
//         title: formData.title,
//         description: formData.description,
//         level: formData.level,
//         instructor_name: formData.instructorName,
//         duration: String(formData.duration),
//         price: Number(formData.price),
//         icon: finalIcon,
//       };

//       if (modal === "add") {
//         await addCourse({ variables: courseVars });
//       } else if (modal != null) {
//         await updateCourse({ variables: { ...courseVars, id: String(modal) } });
//       }

//       setModal(null);
//     } catch (e) {
//       console.error("Error saving course:", e);
//     }
//   }

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data: delData } = await deleteCourse({ variables: { id: String(id) } });
//         if (delData?.courseDelete?.success) {
//            // If on the last page and deleting the only item, go back one page
//            if (sliced.length === 1 && page > 1) setPage(page - 1);
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//       }
//     }
//   };

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   if (loading) return <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">Loading...</div>;
//   if (error) return <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">Error: {error.message}</div>;

//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                 Course Catalog
//               </h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                 Manage and monitor your learning content
//               </p>
//             </div>
//             <button
//               onClick={() => setModal("add")}
//               className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search courses or instructors..."
//                 className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//               />
//             </div>
//             <select
//               className={selectClass}
//               value={filterLevel}
//               onChange={(e) => {
//                 setFilterLevel(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => <option key={o} value={o}>{o}</option>)}
//             </select>
//           </div>

//           <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                     {["Course", "Level", "Duration", "Price", ""].map((h, i) => (
//                       <th key={i} className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {sliced.length === 0 ? (
//                     <tr><td colSpan={5} className="text-center p-12 text-[#b9cac3]">No courses found</td></tr>
//                   ) : (
//                     sliced.map((c) => (
//                       <tr key={c.id} className="group hover:bg-[#262a31] transition-colors">
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon && <img src={c.icon} className="w-8 h-8 rounded object-cover flex-shrink-0 bg-black" alt="" />}
//                             <div>
//                               <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">{c.title}</div>
//                               <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">Instructor: {c.instructorName}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-middle"><LevelBadge level={c.level} /></td>
//                         <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">{c.duration}</td>
//                         <td className="p-4 align-middle">
//                           <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
//                             {c.price === 0 ? "Free" : `₹ ${c.price}`}
//                           </span>
//                         </td>
//                         <td className="p-4 align-middle text-right">
//                           <div className="flex justify-end gap-2">
//                             <button onClick={() => setModal(c.id)} className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]">Edit</button>
//                             <button onClick={() => handleDelete(c.id)} className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]">Delete</button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* ── INTEGRATED PAGINATION COMPONENT ──────────────────────────────── */}
//           {filtered.length > 0 && (
//             <NumberedCursorPagination
//               page={safePage}
//               hasNext={safePage < pages}
//               hasPrevious={safePage > 1}
//               onNext={() => setPage(safePage + 1)}
//               onPrevious={() => setPage(safePage - 1)}
//               onJumpToFirst={() => setPage(1)}
//             />
//           )}
//         </div>
//       </div>

//       {modal !== null && (
//         <CourseModal
//           editing={editingCourse}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }

// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { NumberedCursorPagination } from "../components/ui/cursorpagination";

// // ── Types ───────────────────────────────────────────────────────────────────
// type Level = "Beginner" | "Intermediate" | "Advanced";

// interface Course {
//   id: string;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
//   icon?: string;
// }

// interface CourseGetQueryResult {
//   courseGet: {
//     success: boolean;
//     message: string;
//     data: Course[];
//   };
// }

// interface RequestUploadMutationResult {
//   request_upload: {
//     success: boolean;
//     message: string;
//     data: { url: string; filename: string };
//   };
// }

// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────
// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}>
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   onSave: (data: Omit<Course, "id">, file: File | null) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//     icon: editing?.icon ?? "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(editing?.icon || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const inputClass = "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass = "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: type === "number" && value === "" ? "" : value }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">{editing ? "Edit Course" : "Add New Course"}</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input name="title" className={inputClass} value={formData.title} onChange={handleChange} />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select name="level" className={inputClass} value={formData.level} onChange={handleChange}>
//                   {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input name="instructorName" className={inputClass} value={formData.instructorName} onChange={handleChange} />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input name="duration" className={inputClass} value={formData.duration} onChange={handleChange} />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input name="price" className={inputClass} type="number" value={formData.price} onChange={handleChange} />
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div>
//               <label className={labelClass}>Course Thumbnail</label>
//               <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden">
//                 {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> :
//                 <div className="flex flex-col items-center text-[#84948e]"><span className="material-symbols-outlined text-2xl">image</span><span>Upload Image</span></div>}
//               </div>
//               <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) { setSelectedFile(file); setPreview(URL.createObjectURL(file)); }
//               }} />
//             </div>
//             <div className="flex flex-col flex-1">
//               <label className={labelClass}>Course Description</label>
//               <textarea name="description" className={`${inputClass} flex-1 min-h-[140px] resize-none`} value={formData.description} onChange={handleChange} />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button onClick={onClose} className="text-[#b9cac3] font-bold">Cancel</button>
//           <button onClick={() => onSave(formData, selectedFile)} disabled={isSubmitting} className="bg-[#6fffd9] text-[#00382c] px-6 py-2 rounded-full font-bold">
//             {isSubmitting ? "Saving..." : editing ? "Save Changes" : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   // --- 1. Cursor Pagination State ---
//   const [lastID, setLastID] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [cursorHistory, setCursorHistory] = useState<string[]>([]);
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");

//   // --- 2. GQL Queries/Mutations ---
//   // Fetching limit 11 so we can check if a 12th item exists (hasNextPage)
//   const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES, {
//     variables: { lastID: lastID, limit: 11 },
//     fetchPolicy: "cache-and-network"
//   });

//   const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, { refetchQueries: [GET_COURSES] });
//   const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE, { refetchQueries: [GET_COURSES] });
//   const [deleteCourse] = useMutation(DELETE_COURSE, { refetchQueries: [GET_COURSES] });

//   // --- 3. Data Processing ---
//   const rawCourses = data?.courseGet?.data || [];

//   // Clean duplicates (common in cursor pagination where lte/gte is used)
//   const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

//   // Show exactly 10
//   const displayCourses = cleanCourses.slice(0, 10);
//   const hasNextPage = rawCourses.length > 10;

//   // --- 4. Pagination Handlers ---
//   const handleNextPage = () => {
//     if (hasNextPage && displayCourses.length > 0) {
//       const newCursor = displayCourses[displayCourses.length - 1].id;
//       setCursorHistory((prev) => [...prev, lastID || ""]);
//       setLastID(newCursor);
//       setPage((p) => p + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePreviousPage = () => {
//     if (cursorHistory.length > 0) {
//       const newHistory = [...cursorHistory];
//       const prevCursor = newHistory.pop() || null;
//       setCursorHistory(newHistory);
//       setLastID(prevCursor === "" ? null : prevCursor);
//       setPage((p) => p - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleJumpToFirst = () => {
//     setLastID(null);
//     setCursorHistory([]);
//     setPage(1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // --- 5. Save Logic ---
//   async function handleSave(formData: any, file: File | null) {
//     try {
//       let finalIcon = formData.icon;
//       if (file) {
//         const { data: uploadRes } = await requestUpload({ variables: { mimetype: file.type } });
//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
//           await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
//           finalIcon = filename;
//         }
//       }

//       const vars = { ...formData, instructor_name: formData.instructorName, price: Number(formData.price), icon: finalIcon };
//       if (modal === "add") await addCourse({ variables: vars });
//       else await updateCourse({ variables: { ...vars, id: modal } });
//       setModal(null);
//     } catch (e) { console.error(e); }
//   }

//   if (loading && page === 1) return <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">Loading...</div>;

//   return (
//     <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] p-6 sm:p-10">
//       <div className="max-w-[1400px] mx-auto">
//         <div className="flex justify-between items-center mb-10">
//           <h1 className="text-3xl font-black font-headline">Course Catalog</h1>
//           <button onClick={() => setModal("add")} className="bg-[#6fffd9] text-[#00382c] px-6 py-2 rounded-full font-bold">Add Course</button>
//         </div>

//         <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                   {["Course", "Level", "Duration", "Price", ""].map((h, i) => (
//                     <th key={i} className="p-4 text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] uppercase tracking-widest">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#3b4a44]">
//                 {displayCourses.map((c) => (
//                   <tr key={c.id} className="hover:bg-[#262a31] transition-colors">
//                     <td className="p-4 flex items-center gap-3">
//                       {c.icon && <img src={c.icon} className="w-10 h-10 rounded object-cover bg-black" />}
//                       <div>
//                         <div className="font-headline font-semibold text-[#dfe2eb]">{c.title}</div>
//                         <div className="text-[0.75rem] text-[#b9cac3]">Instructor: {c.instructorName}</div>
//                       </div>
//                     </td>
//                     <td className="p-4"><LevelBadge level={c.level} /></td>
//                     <td className="p-4 text-[#b9cac3] text-[0.875rem]">{c.duration}</td>
//                     <td className="p-4 font-bold text-[#dfe2eb]">₹ {c.price}</td>
//                     <td className="p-4 text-right">
//                       <button onClick={() => setModal(c.id)} className="text-[#6fffd9] mr-4 text-sm font-bold">Edit</button>
//                       <button onClick={() => deleteCourse({ variables: { id: c.id } })} className="text-[#ffb4ab] text-sm font-bold">Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ── INTEGRATED PAGINATION ──────────────────────────────── */}
//         <NumberedCursorPagination
//           page={page}
//           hasNext={hasNextPage}
//           hasPrevious={cursorHistory.length > 0}
//           onNext={handleNextPage}
//           onPrevious={handlePreviousPage}
//           onJumpToFirst={handleJumpToFirst}
//         />
//       </div>

//       {modal && (
//         <CourseModal
//           editing={displayCourses.find(c => c.id === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </div>
//   );
// }

// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { NumberedCursorPagination } from "../components/ui/cursorpagination";

// // ── Types ───────────────────────────────────────────────────────────────────
// type Level = "Beginner" | "Intermediate" | "Advanced";

// interface Course {
//   id: string;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
//   icon?: string;
// }

// interface CourseGetQueryResult {
//   courseGet: {
//     data: Course[];
//   };
// }

// interface RequestUploadMutationResult {
//   request_upload: {
//     success: boolean;
//     message: string;
//     data: { url: string; filename: string };
//   };
// }

// interface DeleteCourseMutationResult {
//   courseDelete: {
//     message: string;
//     success: boolean;
//   };
// }

// interface UpdateCourseMutationResult {
//   courseUpdate: {
//     message: string;
//     success: boolean;
//   };
// }

// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const PER_PAGE = 10;
// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────
// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span
//       className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
//     >
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   onSave: (data: Omit<Course, "id">, file: File | null) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//     icon: editing?.icon ?? "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(editing?.icon || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const inputClass =
//     "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass =
//     "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" && value === "" ? "" : value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
//           {editing ? "Edit Course" : "Add New Course"}
//         </h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input
//                 name="title"
//                 className={inputClass}
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select
//                   name="level"
//                   className={inputClass}
//                   value={formData.level}
//                   onChange={handleChange}
//                 >
//                   {LEVELS.map((l) => (
//                     <option key={l} value={l}>
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input
//                   name="instructorName"
//                   className={inputClass}
//                   value={formData.instructorName}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input
//                   name="duration"
//                   className={inputClass}
//                   value={formData.duration}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input
//                   name="price"
//                   className={inputClass}
//                   type="number"
//                   value={formData.price}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div>
//               <label className={labelClass}>Course Thumbnail</label>
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     className="w-full h-full object-cover"
//                     alt="Preview"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center text-[#84948e]">
//                     <span className="material-symbols-outlined text-2xl">
//                       image
//                     </span>
//                     <span>Upload Image</span>
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <div className="flex flex-col flex-1">
//               <label className={labelClass}>Course Description</label>
//               <textarea
//                 name="description"
//                 className={`${inputClass} flex-1 min-h-[140px] resize-none`}
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button onClick={onClose} className="text-[#b9cac3] font-bold">
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData, selectedFile)}
//             disabled={isSubmitting}
//             className="bg-[#6fffd9] text-[#00382c] px-6 py-2 rounded-full font-bold"
//           >
//             {isSubmitting
//               ? "Saving..."
//               : editing
//                 ? "Save Changes"
//                 : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const [lastID, setLastID] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [cursorHistory, setCursorHistory] = useState<string[]>([]);
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");

//   const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES, {
//     variables: { lastID: lastID, limit: 11 },
//     fetchPolicy: "cache-and-network",
//   });

//   const [requestUpload] =
//     useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, {
//     refetchQueries: [GET_COURSES],
//   });
//   const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE, {
//     refetchQueries: [GET_COURSES],
//   });
//    // Inside your DashboardPage component
//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(
//     DELETE_COURSE,
//     {
//       refetchQueries: [
//         { query: GET_COURSES, variables: { lastID: "null", limit: 11 } },
//       ],
//     },
//   );
//   const rawCourses = data?.courseGet?.data || [];
//   const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

//   // Local filtering for search within the current cursor set
//   const filtered = useMemo(
//     () =>
//       cleanCourses.filter((c) => {
//         const matchSearch =
//           !search ||
//           c.title.toLowerCase().includes(search.toLowerCase()) ||
//           c.instructorName.toLowerCase().includes(search.toLowerCase());
//         const matchLevel = !filterLevel || formatLevel(c.level) === filterLevel;
//         return matchSearch && matchLevel;
//       }),
//     [cleanCourses, search, filterLevel],
//   );

//   const displayCourses = filtered.slice(0, 10);
//   const hasNextPage = rawCourses.length > 10;

//   const handleNextPage = () => {
//     if (hasNextPage && displayCourses.length > 0) {
//       const newCursor = displayCourses[displayCourses.length - 1].id;
//       setCursorHistory((prev) => [...prev, lastID || ""]);
//       setLastID(newCursor);
//       setPage((p) => p + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePreviousPage = () => {
//     if (cursorHistory.length > 0) {
//       const newHistory = [...cursorHistory];
//       const prevCursor = newHistory.pop() || null;
//       setCursorHistory(newHistory);
//       setLastID(prevCursor === "" ? null : prevCursor);
//       setPage((p) => p - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleJumpToFirst = () => {
//     setLastID(null);
//     setCursorHistory([]);
//     setPage(1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         // TypeScript now knows 'data' has 'courseDelete'
//         const { data } = await deleteCourse({
//           variables: { id: String(id) },
//         });

//         if (data?.courseDelete?.success) {
//           console.log("Deleted:", data.courseDelete.message);
//           // If it was the last item on the page, go back
//           if (displayCourses.length === 1 && page > 1) handlePreviousPage();
//         } else {
//           alert(data?.courseDelete?.message || "Delete failed");
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//       }
//     }
//   };

//   async function handleSave(formData: any, file: File | null) {
//     try {
//       let finalIcon = formData.icon;
//       if (file) {
//         const { data: uploadRes } = await requestUpload({
//           variables: { mimetype: file.type },
//         });
//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
//           await fetch(url, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//           });
//           finalIcon = filename;
//         }
//       }

//       const vars = {
//         ...formData,
//         instructor_name: formData.instructorName,
//         price: Number(formData.price),
//         icon: finalIcon,
//       };

//       if (modal === "add") await addCourse({ variables: vars });
//       else await updateCourse({ variables: { ...vars, id: modal } });
//       setModal(null);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   if (loading && page === 1)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
//         Loading...
//       </div>
//     );

//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                 Course Catalog
//               </h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                 Manage and monitor your learning content
//               </p>
//             </div>
//             <button
//               onClick={() => setModal("add")}
//               className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search courses or instructors..."
//                 className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//               />
//             </div>
//             <select
//               className={selectClass}
//               value={filterLevel}
//               onChange={(e) => {
//                 setFilterLevel(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => (
//                 <option key={o} value={o}>
//                   {o}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                     {["Course", "Level", "Duration", "Price", ""].map(
//                       (h, i) => (
//                         <th
//                           key={i}
//                           className="p-4 text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] uppercase tracking-widest"
//                         >
//                           {h}
//                         </th>
//                       ),
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {displayCourses.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="text-center p-12 text-[#b9cac3]"
//                       >
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     displayCourses.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon && (
//                               <img
//                                 src={c.icon}
//                                 className="w-10 h-10 rounded object-cover bg-black"
//                                 alt=""
//                               />
//                             )}
//                             <div>
//                               <div className="font-headline font-semibold text-[#dfe2eb] truncate">
//                                 {c.title}
//                               </div>
//                               <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
//                                 Instructor: {c.instructorName}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-middle">
//                           <LevelBadge level={c.level} />
//                         </td>
//                         <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
//                           {c.duration}
//                         </td>
//                         <td className="p-4 align-middle">
//                           <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
//                             ₹ {c.price}
//                           </span>
//                         </td>
//                         <td className="p-4 align-middle text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => setModal(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {filtered.length > 0 && (
//             <NumberedCursorPagination
//               page={page}
//               hasNext={hasNextPage}
//               hasPrevious={cursorHistory.length > 0}
//               onNext={handleNextPage}
//               onPrevious={handlePreviousPage}
//               onJumpToFirst={handleJumpToFirst}
//             />
//           )}
//         </div>
//       </div>

//       {modal && (
//         <CourseModal
//           editing={displayCourses.find((c) => c.id === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }

// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { NumberedCursorPagination } from "../components/ui/cursorpagination";

// // ── Types ───────────────────────────────────────────────────────────────────
// type Level = "Beginner" | "Intermediate" | "Advanced";

// interface Course {
//   id: string;
//   title: string;
//   level: Level;
//   duration: string;
//   price: number | string;
//   instructorName: string;
//   description: string;
//   icon?: string;
// }

// interface CourseGetQueryResult {
//   courseGet: {
//     success: boolean;
//     message: string;
//     data: Course[];
//   };
// }

// interface RequestUploadMutationResult {
//   request_upload: {
//     success: boolean;
//     message: string;
//     data: { url: string; filename: string };
//   };
// }

// interface DeleteCourseMutationResult {
//   courseDelete: {
//     message: string;
//     success: boolean;
//   };
// }

// interface UpdateCourseMutationResult {
//   courseUpdate: {
//     message: string;
//     success: boolean;
//   };
// }

// const formatLevel = (l: string): Level => {
//   const normalized = l.toLowerCase();
//   return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
// };

// const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// // ── Sub-components ──────────────────────────────────────────────────────────
// function LevelBadge({ level }: { level: Level }) {
//   const displayLevel = formatLevel(level);
//   const styles: Record<Level, string> = {
//     Beginner: "bg-[#0d2a20] text-[#6fffd9]",
//     Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
//     Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
//   };
//   return (
//     <span
//       className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
//     >
//       {displayLevel}
//     </span>
//   );
// }

// // ── Modal ────────────────────────────────────────────────────────────────────
// interface ModalProps {
//   editing: Course | null;
//   onClose: () => void;
//   onSave: (data: Omit<Course, "id">, file: File | null) => void;
//   isSubmitting: boolean;
// }

// function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
//   const [formData, setFormData] = useState({
//     title: editing?.title ?? "",
//     level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
//     duration: editing?.duration ? String(editing.duration) : "",
//     price: editing?.price ?? "",
//     instructorName: editing?.instructorName ?? "",
//     description: editing?.description ?? "",
//     icon: editing?.icon ?? "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(editing?.icon || null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const inputClass =
//     "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
//   const labelClass =
//     "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" && value === "" ? "" : value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
//         <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
//           {editing ? "Edit Course" : "Add New Course"}
//         </h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-4">
//             <div>
//               <label className={labelClass}>Course Title *</label>
//               <input
//                 name="title"
//                 className={inputClass}
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Level</label>
//                 <select
//                   name="level"
//                   className={inputClass}
//                   value={formData.level}
//                   onChange={handleChange}
//                 >
//                   {LEVELS.map((l) => (
//                     <option key={l} value={l}>
//                       {l}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Instructor</label>
//                 <input
//                   name="instructorName"
//                   className={inputClass}
//                   value={formData.instructorName}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className={labelClass}>Duration</label>
//                 <input
//                   name="duration"
//                   className={inputClass}
//                   value={formData.duration}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Price (INR)</label>
//                 <input
//                   name="price"
//                   className={inputClass}
//                   type="number"
//                   value={formData.price}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div>
//               <label className={labelClass}>Course Thumbnail</label>
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
//               >
//                 {preview ? (
//                   <img
//                     src={preview}
//                     className="w-full h-full object-cover"
//                     alt="Preview"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center text-[#84948e]">
//                     <span className="material-symbols-outlined text-2xl">
//                       image
//                     </span>
//                     <span>Upload Image</span>
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <div className="flex flex-col flex-1">
//               <label className={labelClass}>Course Description</label>
//               <textarea
//                 name="description"
//                 className={`${inputClass} flex-1 min-h-[140px] resize-none`}
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
//           <button onClick={onClose} className="text-[#b9cac3] font-bold">
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData, selectedFile)}
//             disabled={isSubmitting}
//             className="bg-[#6fffd9] text-[#00382c] px-6 py-2 rounded-full font-bold"
//           >
//             {isSubmitting
//               ? "Saving..."
//               : editing
//                 ? "Save Changes"
//                 : "Add Course"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const [lastID, setLastID] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [cursorHistory, setCursorHistory] = useState<string[]>([]);
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");

//   // Extracted 'refetch' to manually trigger updates after mutations
//   const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(
//     GET_COURSES,
//     {
//       variables: { lastID: lastID, limit: 11 },
//       fetchPolicy: "cache-and-network",
//     },
//   );

//   const [requestUpload] =
//     useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);

//   // Removed hardcoded refetchQueries to avoid cache mismatches
//   const [addCourse, { loading: adding }] = useMutation(ADD_COURSE);
//   const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE);
//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE);

//   const rawCourses = data?.courseGet?.data || [];
//   const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

//   const filtered = useMemo(
//     () =>
//       cleanCourses.filter((c) => {
//         const matchSearch =
//           !search ||
//           c.title.toLowerCase().includes(search.toLowerCase()) ||
//           c.instructorName.toLowerCase().includes(search.toLowerCase());
//         const matchLevel = !filterLevel || formatLevel(c.level) === filterLevel;
//         return matchSearch && matchLevel;
//       }),
//     [cleanCourses, search, filterLevel],
//   );

//   const displayCourses = filtered.slice(0, 10);
//   const hasNextPage = rawCourses.length > 10;

//   const handleNextPage = () => {
//     if (hasNextPage && displayCourses.length > 0) {
//       const newCursor = displayCourses[displayCourses.length - 1].id;
//       setCursorHistory((prev) => [...prev, lastID || ""]);
//       setLastID(newCursor);
//       setPage((p) => p + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePreviousPage = () => {
//     if (cursorHistory.length > 0) {
//       const newHistory = [...cursorHistory];
//       const prevCursor = newHistory.pop() || null;
//       setCursorHistory(newHistory);
//       setLastID(prevCursor === "" ? null : prevCursor);
//       setPage((p) => p - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleJumpToFirst = () => {
//     setLastID(null);
//     setCursorHistory([]);
//     setPage(1);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data } = await deleteCourse({
//           variables: { id: String(id) },
//         });

//         if (data?.courseDelete?.success) {
//           // Force the UI to refresh with current data immediately
//           await refetch();

//           // If we deleted the very last item on a paginated screen, go back a page
//           if (displayCourses.length === 1 && page > 1) {
//             handlePreviousPage();
//           }
//         } else {
//           alert(data?.courseDelete?.message || "Delete failed");
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//       }
//     }
//   };

//   async function handleSave(formData: any, file: File | null) {
//     try {
//       let finalIcon = formData.icon;
//       if (file) {
//         const { data: uploadRes } = await requestUpload({
//           variables: { mimetype: file.type },
//         });
//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
//           await fetch(url, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//           });
//           finalIcon = filename;
//         }
//       }

//       const vars = {
//         ...formData,
//         instructor_name: formData.instructorName,
//         price: Number(formData.price),
//         icon_name: finalIcon,
//       };

//       if (modal === "add") await addCourse({ variables: vars });
//       else await updateCourse({ variables: { ...vars, id: modal } });

//       // Force the UI to refresh immediately after saving
//       await refetch();
//       setModal(null);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   if (loading && page === 1)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
//         Loading...
//       </div>
//     );

//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                 Course Catalog
//               </h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                 Manage and monitor your learning content
//               </p>
//             </div>
//             <button
//               onClick={() => setModal("add")}
//               className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
//             >
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 placeholder="Search courses or instructors..."
//                 className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//               />
//             </div>
//             <select
//               className={selectClass}
//               value={filterLevel}
//               onChange={(e) => {
//                 setFilterLevel(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => (
//                 <option key={o} value={o}>
//                   {o}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-[#181c22] border-b border-[#3b4a44]">
//                     {["Course", "Level", "Duration", "Price", ""].map(
//                       (h, i) => (
//                         <th
//                           key={i}
//                           className="p-4 text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] uppercase tracking-widest"
//                         >
//                           {h}
//                         </th>
//                       ),
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {displayCourses.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="text-center p-12 text-[#b9cac3]"
//                       >
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     displayCourses.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon && (
//                               <img
//                                 src={c.icon}
//                                 className="w-10 h-10 rounded object-cover bg-black"
//                                 alt=""
//                               />
//                             )}
//                             <div>
//                               <div className="font-headline font-semibold text-[#dfe2eb] truncate">
//                                 {c.title}
//                               </div>
//                               <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
//                                 Instructor: {c.instructorName}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-middle">
//                           <LevelBadge level={c.level} />
//                         </td>
//                         <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
//                           {c.duration}
//                         </td>
//                         <td className="p-4 align-middle">
//                           <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
//                             ₹ {c.price}
//                           </span>
//                         </td>
//                         <td className="p-4 align-middle text-right">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => setModal(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(c.id)}
//                               className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {filtered.length > 0 && (
//             <NumberedCursorPagination
//               page={page}
//               hasNext={hasNextPage}
//               hasPrevious={cursorHistory.length > 0}
//               onNext={handleNextPage}
//               onPrevious={handlePreviousPage}
//               onJumpToFirst={handleJumpToFirst}
//             />
//           )}
//         </div>
//       </div>

//       {modal && (
//         <CourseModal
//           editing={displayCourses.find((c) => c.id === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }



import React, { useState, useMemo, useRef } from "react";
import {
  ADD_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
  REQUEST_UPLOAD,
} from "../graphql/coursesOps";
import { useMutation, useQuery } from "@apollo/client/react";
import { NumberedCursorPagination } from "../components/ui/cursorpagination"; // Ensure path is correct

// ── Types ───────────────────────────────────────────────────────────────────

type Level = "Beginner" | "Intermediate" | "Advanced";

interface Course {
  id: string;
  title: string;
  level: Level;
  duration: string;
  price: number | string;
  instructorName: string;
  description: string;
  icon?: string;
}

interface CourseGetQueryResult {
  courseGet: {
    data: Course[];
  };
}

interface RequestUploadMutationResult {
  request_upload: {
    success: boolean;
    message: string;
    data: {
      url: string;
      filename: string;
    };
  };
}

interface DeleteCourseMutationResult {
  courseDelete: {
    message: string;
    success: boolean;
  };
}

interface UpdateCourseMutationResult {
  courseUpdate: {
    message: string;
    success: boolean;
  };
}

interface AddCourseMutationResult {
  courseAdd: {
    message: string;
    success: boolean;
  };
}

const formatLevel = (l: string): Level => {
  const normalized = l.toLowerCase();
  return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
};

const PER_PAGE = 10;
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// ── Sub-components ──────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const displayLevel = formatLevel(level);
  const styles: Record<Level, string> = {
    Beginner: "bg-[#0d2a20] text-[#6fffd9]",
    Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
    Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
  };
  return (
    <span
      className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
    >
      {displayLevel}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  editing: Course | null;
  onClose: () => void;
  onSave: (data: Omit<Course, "id">, file: File | null) => void;
  isSubmitting: boolean;
}

function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
  const [formData, setFormData] = useState({
    title: editing?.title ?? "",
    level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
    duration: editing?.duration ? String(editing.duration) : "",
    price: editing?.price ?? "",
    instructorName: editing?.instructorName ?? "",
    description: editing?.description ?? "",
    icon: editing?.icon ?? "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(editing?.icon || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value === "" ? "" : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
        <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
          {editing ? "Edit Course" : "Add New Course"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input
                name="title"
                className={inputClass}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced React Patterns"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Level</label>
                <select
                  name="level"
                  className={inputClass}
                  value={formData.level}
                  onChange={handleChange}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l} className="bg-[#1c2026]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Instructor</label>
                <input
                  name="instructorName"
                  className={inputClass}
                  value={formData.instructorName}
                  onChange={handleChange}
                  placeholder="Instructor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  name="duration"
                  className={inputClass}
                  type="text"
                  value={formData.duration || ""}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                />
              </div>
              <div>
                <label className={labelClass}>Price (INR)</label>
                <input
                  name="price"
                  className={inputClass}
                  type="number"
                  min={0}
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="0 = Free"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Image Upload Area */}
            <div>
              <label className={labelClass}>Course Thumbnail</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#84948e]">
                    <span className="material-symbols-outlined text-2xl mb-1">
                      image
                    </span>
                    <span className="text-[0.75rem] font-headline font-semibold">
                      Upload Image
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className={labelClass}>Course Description</label>
              <textarea
                name="description"
                className={`${inputClass} flex-1 min-h-[140px] resize-none`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed overview of the course content..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
          <button
            onClick={onClose}
            className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData, selectedFile)}
            disabled={isSubmitting}
            className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [lastID, setLastID] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [modal, setModal] = useState<"add" | string | null>(null);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Fetching limit 11 to check if we have a "next" page, but we only display 10
  const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(
    GET_COURSES,
    {
      variables: { lastID: lastID, limit: 11 },
      fetchPolicy: "cache-and-network",
    }
  );

  const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);

  // We rely on manual refetch() instead of refetchQueries for dynamic cursors
  const [addCourse, { loading: adding }] = useMutation<AddCourseMutationResult>(ADD_COURSE);
  const [updateCourse, { loading: updating }] = useMutation<UpdateCourseMutationResult>(UPDATE_COURSE);
  const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE);

  const rawCourses = data?.courseGet?.data || [];
  
  // Clean duplicates caused by cursor logic bounds
  const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

  // Local filtering logic
  const filtered = useMemo(
    () =>
      cleanCourses.filter((c) => {
        const matchSearch =
          !search ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.instructorName.toLowerCase().includes(search.toLowerCase());
        const matchLevel = !filterLevel || formatLevel(c.level) === filterLevel;
        return matchSearch && matchLevel;
      }),
    [cleanCourses, search, filterLevel]
  );

  // Enforce PER_PAGE limit locally for rendering
  const displayCourses = filtered.slice(0, PER_PAGE);
  const hasNextPage = rawCourses.length > PER_PAGE;

  // Pagination Logic
  const handleNextPage = () => {
    if (hasNextPage && displayCourses.length > 0) {
      const newCursor = displayCourses[displayCourses.length - 1].id;
      setCursorHistory((prev) => [...prev, lastID || ""]);
      setLastID(newCursor);
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      const prevCursor = newHistory.pop() || null;
      setCursorHistory(newHistory);
      setLastID(prevCursor === "" ? null : prevCursor);
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToFirst = () => {
    setLastID(null);
    setCursorHistory([]);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Logic
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const { data: delData } = await deleteCourse({
          variables: { id: String(id) },
        });

        if (delData?.courseDelete?.success) {
          // Force refresh
          await refetch();
          
          // Handle deleting the last item on a page
          if (displayCourses.length === 1 && page > 1) {
            handlePreviousPage();
          }
        } else {
          alert(`Delete failed: ${delData?.courseDelete?.message}`);
        }
      } catch (e: any) {
        console.error("Delete Error:", e);
      }
    }
  };

  // Save (Add/Edit) Logic handling multi-step upload
  async function handleSave(formData: any, file: File | null) {
    try {
      let finalIcon = formData.icon;

      // STEP 1: Process File Upload
      if (file) {
        const { data: uploadRes } = await requestUpload({
          variables: { mimetype: file.type },
        });

        if (uploadRes?.request_upload?.success) {
          const { url, filename } = uploadRes.request_upload.data;
          
          // Native fetch to the pre-signed URL
          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });
          
          // Save the generated filename for the backend DB
          finalIcon = filename; 
        }
      }

      // STEP 2: Send Data to GraphQL API
      const courseVars = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        instructor_name: formData.instructorName, // Mapped to backend param name
        duration: String(formData.duration),
        price: Number(formData.price),
        icon_name: finalIcon,
      };

      if (modal === "add") {
        await addCourse({ variables: courseVars });
      } else if (modal != null) {
        await updateCourse({ variables: { ...courseVars, id: String(modal) } });
      }

      // Force UI refresh and close modal
      await refetch();
      setModal(null);
      
    } catch (e) {
      console.error("Error saving course:", e);
    }
  }

  const selectClass =
    "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  if (loading && page === 1)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
        Error loading courses. Please check connection.
      </div>
    );

  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
            <div>
              <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
                Course Catalog
              </h1>
              <p className="text-[0.875rem] text-[#b9cac3] mt-1">
                Manage and monitor your learning content
              </p>
            </div>
            <button
              onClick={() => setModal("add")}
              className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">Add</span> Add Course
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleJumpToFirst(); // Reset pagination on search
                }}
                placeholder="Search courses or instructors..."
                className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
              />
            </div>
            <select
              className={selectClass}
              value={filterLevel}
              onChange={(e) => {
                setFilterLevel(e.target.value);
                handleJumpToFirst(); // Reset pagination on filter
              }}
            >
              <option value="">All Levels</option>
              {LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#181c22] border-b border-[#3b4a44]">
                    {["Course", "Level", "Duration", "Price", ""].map(
                      (h, i) => (
                        <th
                          key={i}
                          className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]">
                  {displayCourses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    displayCourses.map((c) => (
                      <tr
                        key={c.id}
                        className="group hover:bg-[#262a31] transition-colors"
                      >
                        <td className="p-4 align-middle">
                          <div className="min-w-0 flex items-center gap-3">
                            {c.icon && (
                          //  <p>{c.icon}</p>
                              <img
                                src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${c.icon}`}
                                className="w-8 h-8 rounded object-cover flex-shrink-0 bg-black"
                                alt={`${c.title} thumbnail`}
                              />
                            )}
                            <div>
                              <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
                                {c.title}
                              </div>
                              <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
                                Instructor: {c.instructorName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <LevelBadge level={c.level} />
                        </td>
                        <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
                          {c.duration}
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
                            {c.price === 0 ? "Free" : `₹ ${c.price}`}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setModal(c.id)}
                              className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
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
            </div>
          </div>

          {filtered.length > 0 && (
            <NumberedCursorPagination
              page={page}
              hasNext={hasNextPage}
              hasPrevious={cursorHistory.length > 0}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              onJumpToFirst={handleJumpToFirst}
            />
          )}
        </div>
      </div>

      {modal !== null && (
        <CourseModal
          editing={displayCourses.find((c) => c.id === modal) || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isSubmitting={adding || updating}
        />
      )}
    </>
  );
}