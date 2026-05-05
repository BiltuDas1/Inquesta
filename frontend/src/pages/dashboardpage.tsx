// import React, { useState, useMemo, useRef } from "react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";
// import { useMutation, useQuery } from "@apollo/client/react";
// import { NumberedCursorPagination } from "../components/ui/cursorpagination"; // Ensure path is correct

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

// interface AddCourseMutationResult {
//   courseAdd: {
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
//     >
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
//             {/* Image Upload Area */}
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
//   const [lastID, setLastID] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [cursorHistory, setCursorHistory] = useState<string[]>([]);
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");

//   // Fetching limit 11 to check if we have a "next" page, but we only display 10
//   const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(
//     GET_COURSES,
//     {
//       variables: { lastID: lastID, limit: 11 },
//       fetchPolicy: "cache-and-network",
//     }
//   );

//   const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);

//   // We rely on manual refetch() instead of refetchQueries for dynamic cursors
//   const [addCourse, { loading: adding }] = useMutation<AddCourseMutationResult>(ADD_COURSE);
//   const [updateCourse, { loading: updating }] = useMutation<UpdateCourseMutationResult>(UPDATE_COURSE);
//   const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE);

//   const rawCourses = data?.courseGet?.data || [];
  
//   // Clean duplicates caused by cursor logic bounds
//   const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

//   // Local filtering logic
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
//     [cleanCourses, search, filterLevel]
//   );

//   // Enforce PER_PAGE limit locally for rendering
//   const displayCourses = filtered.slice(0, PER_PAGE);
//   const hasNextPage = rawCourses.length > PER_PAGE;

//   // Pagination Logic
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

//   // Delete Logic
//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data: delData } = await deleteCourse({
//           variables: { id: String(id) },
//         });

//         if (delData?.courseDelete?.success) {
//           // Force refresh
//           await refetch();
          
//           // Handle deleting the last item on a page
//           if (displayCourses.length === 1 && page > 1) {
//             handlePreviousPage();
//           }
//         } else {
//           alert(`Delete failed: ${delData?.courseDelete?.message}`);
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//       }
//     }
//   };

//   // Save (Add/Edit) Logic handling multi-step upload
//   async function handleSave(formData: any, file: File | null) {
//     try {
//       let finalIcon = formData.icon;

//       // STEP 1: Process File Upload
//       if (file) {
//         const { data: uploadRes } = await requestUpload({
//           variables: { mimetype: file.type },
//         });

//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
          
//           // Native fetch to the pre-signed URL
//           await fetch(url, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//           });
          
//           // Save the generated filename for the backend DB
//           finalIcon = filename; 
//         }
//       }

//       // STEP 2: Send Data to GraphQL API
//       const courseVars = {
//         title: formData.title,
//         description: formData.description,
//         level: formData.level,
//         instructor_name: formData.instructorName, // Mapped to backend param name
//         duration: String(formData.duration),
//         price: Number(formData.price),
//         icon_name: finalIcon,
//       };

//       if (modal === "add") {
//         await addCourse({ variables: courseVars });
//       } else if (modal != null) {
//         await updateCourse({ variables: { ...courseVars, id: String(modal) } });
//       }

//       // Force UI refresh and close modal
//       await refetch();
//       setModal(null);
      
//     } catch (e) {
//       console.error("Error saving course:", e);
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

//   if (error)
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
//         Error loading courses. Please check connection.
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
//                   handleJumpToFirst(); // Reset pagination on search
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
//                 handleJumpToFirst(); // Reset pagination on filter
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
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {displayCourses.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     displayCourses.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="group hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon && (
//                           //  <p>{c.icon}</p>
//                               <img
//                                 src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${c.icon}`}
//                                 className="w-8 h-8 rounded object-cover flex-shrink-0 bg-black"
//                                 alt={`${c.title} thumbnail`}
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
//                             {c.price === 0 ? "Free" : `₹ ${c.price}`}
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

//       {modal !== null && (
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

// interface AddCourseMutationResult {
//   courseAdd: {
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

// // ── Layout Wrapper (New: Responsive Sidebar & Navbar) ───────────────────────
// function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navItems = [
//     { name: "Dashboard", icon: "grid_view", active: false },
//     { name: "Courses", icon: "library_books", active: true },
//     { name: "Students", icon: "group", active: false },
//     { name: "Analytics", icon: "bar_chart", active: false },
//     { name: "Settings", icon: "settings", active: false },
//   ];

//   return (
//     <div className="flex h-screen bg-[#10141a] font-body text-[#dfe2eb] overflow-hidden">
//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity backdrop-blur-sm"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1c2026] border-r border-[#3b4a44] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Sidebar Header / Logo */}
//         <div className="h-16 flex items-center px-6 border-b border-[#3b4a44]">
//           <span className="material-symbols-outlined text-[#6fffd9] mr-3 text-3xl">
//             school
//           </span>
//           <span className="font-headline font-black text-xl tracking-tight text-[#dfe2eb]">
//             Inquesta
//           </span>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//           {navItems.map((item) => (
//             <a
//               key={item.name}
//               href="#"
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold transition-all duration-200 ${
//                 item.active
//                   ? "bg-[#262a31] text-[#6fffd9]"
//                   : "text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
//               }`}
//             >
//               <span className="material-symbols-outlined text-[1.3rem]">
//                 {item.icon}
//               </span>
//               {item.name}
//             </a>
//           ))}
//         </nav>

//         {/* Sidebar Footer / User Quick Info */}
//         <div className="p-4 border-t border-[#3b4a44]">
//           <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#ffb4ab] font-headline font-semibold hover:bg-[#2a0d10] transition-colors">
//             <span className="material-symbols-outlined">logout</span>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content wrapper */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Navbar */}
//         <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1c2026] border-b border-[#3b4a44] shrink-0">
//           <div className="flex items-center">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="lg:hidden text-[#b9cac3] hover:text-[#dfe2eb] focus:outline-none mr-4"
//             >
//               <span className="material-symbols-outlined text-2xl">menu</span>
//             </button>
//             <h2 className="font-headline font-bold text-[#dfe2eb] text-lg hidden sm:block">
//               Course Management
//             </h2>
//           </div>

//           {/* Right side icons */}
//           <div className="flex items-center gap-4 sm:gap-6">
//             <button className="text-[#b9cac3] hover:text-[#6fffd9] transition-colors relative">
//               <span className="material-symbols-outlined">notifications</span>
//               <span className="absolute top-0 right-0 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
//             </button>
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3b4a44] border-2 border-[#6fffd9] flex items-center justify-center overflow-hidden cursor-pointer">
//               <span className="material-symbols-outlined text-[#dfe2eb] text-xl">
//                 person
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Page Content */}
//         <main className="flex-1 overflow-y-auto pb-20">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

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
//     >
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
//       className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
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
//             {/* Image Upload Area */}
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
//               ? "Save Changes"
//               : "Add Course"}
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

//   const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(
//     GET_COURSES,
//     {
//       variables: { lastID: lastID, limit: 11 },
//       fetchPolicy: "cache-and-network",
//     }
//   );

//   const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
//   const [addCourse, { loading: adding }] = useMutation<AddCourseMutationResult>(ADD_COURSE);
//   const [updateCourse, { loading: updating }] = useMutation<UpdateCourseMutationResult>(UPDATE_COURSE);
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
//     [cleanCourses, search, filterLevel]
//   );

//   const displayCourses = filtered.slice(0, PER_PAGE);
//   const hasNextPage = rawCourses.length > PER_PAGE;

//   const handleNextPage = () => {
//     if (hasNextPage && displayCourses.length > 0) {
//       const newCursor = displayCourses[displayCourses.length - 1].id;
//       setCursorHistory((prev) => [...prev, lastID || ""]);
//       setLastID(newCursor);
//       setPage((p) => p + 1);
//       // Removed window.scrollTo since we scroll the <main> container now
//     }
//   };

//   const handlePreviousPage = () => {
//     if (cursorHistory.length > 0) {
//       const newHistory = [...cursorHistory];
//       const prevCursor = newHistory.pop() || null;
//       setCursorHistory(newHistory);
//       setLastID(prevCursor === "" ? null : prevCursor);
//       setPage((p) => p - 1);
//     }
//   };

//   const handleJumpToFirst = () => {
//     setLastID(null);
//     setCursorHistory([]);
//     setPage(1);
//   };

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data: delData } = await deleteCourse({
//           variables: { id: String(id) },
//         });

//         if (delData?.courseDelete?.success) {
//           await refetch();
//           if (displayCourses.length === 1 && page > 1) {
//             handlePreviousPage();
//           }
//         } else {
//           alert(`Delete failed: ${delData?.courseDelete?.message}`);
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

//       await refetch();
//       setModal(null);
//     } catch (e) {
//       console.error("Error saving course:", e);
//     }
//   }

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   // Wrapped entire return inside the new DashboardLayout
//   return (
//     <DashboardLayout>
//       {loading && page === 1 ? (
//         <div className="h-full flex items-center justify-center text-[#6fffd9]">
//           Loading...
//         </div>
//       ) : error ? (
//         <div className="h-full flex items-center justify-center text-red-400">
//           Error loading courses. Please check connection.
//         </div>
//       ) : (
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//           {/* Header Controls */}
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

//           {/* Filters */}
//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   handleJumpToFirst();
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
//                 handleJumpToFirst();
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

//           {/* Table Area */}
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
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#3b4a44]">
//                   {displayCourses.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
//                         No courses found
//                       </td>
//                     </tr>
//                   ) : (
//                     displayCourses.map((c) => (
//                       <tr
//                         key={c.id}
//                         className="group hover:bg-[#262a31] transition-colors"
//                       >
//                         <td className="p-4 align-middle">
//                           <div className="min-w-0 flex items-center gap-3">
//                             {c.icon ? (
//                               <img
//                                 src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${c.icon}`}
//                                 className="w-10 h-10 rounded-lg object-contain flex-shrink-0 bg-[#10141a] border border-[#3b4a44]"
//                                 alt={`${c.title} thumbnail`}
//                                 onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//                                   e.currentTarget.onerror = null;
//                                   e.currentTarget.style.display = "none";
//                                 }}
//                               />
//                             ) : (
//                               <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-[#10141a] border border-[#3b4a44] flex items-center justify-center">
//                                 <span className="material-symbols-outlined text-[#84948e] text-[18px]">image</span>
//                               </div>
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

//           {/* Pagination */}
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
//       )}

//       {/* Modal is rendered outside the static layout to ensure it sits on top */}
//       {modal !== null && (
//         <CourseModal
//           editing={displayCourses.find((c) => c.id === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </DashboardLayout>
//   );
// }

// import React, { useState, useMemo } from "react";
// import { useMutation, useQuery } from "@apollo/client/react";
// import {
//   ADD_COURSE,
//   DELETE_COURSE,
//   GET_COURSES,
//   UPDATE_COURSE,
//   REQUEST_UPLOAD,
// } from "../graphql/coursesOps";


// import { NumberedCursorPagination } from "../components/ui/cursorpagination";
// import type { Course } from "../types/courses";
// import { formatLevel, LEVELS, PER_PAGE } from "../utils/courseutils";
// import CourseTable from "../components/courses/coursetable";
// import CourseModal from "../components/courses/coursemodal";
// import DashboardLayout from "../components/layout/dashboardlayout";

// interface CourseGetQueryResult { courseGet: { data: Course[] }; }
// interface RequestUploadMutationResult { request_upload: { success: boolean; data: { url: string; filename: string }; }; }
// interface DeleteCourseMutationResult { courseDelete: { success: boolean; message: string; }; }

// export default function DashboardPage() {
//   const [lastID, setLastID] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [cursorHistory, setCursorHistory] = useState<string[]>([]);
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterLevel, setFilterLevel] = useState("");

//   const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(GET_COURSES, {
//     variables: { lastID: lastID, limit: 11 },
//     fetchPolicy: "cache-and-network",
//   });

//   const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
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
//     [cleanCourses, search, filterLevel]
//   );

//   const displayCourses = filtered.slice(0, PER_PAGE);
//   const hasNextPage = rawCourses.length > PER_PAGE;

//   const handleNextPage = () => {
//     if (hasNextPage && displayCourses.length > 0) {
//       const newCursor = displayCourses[displayCourses.length - 1].id;
//       setCursorHistory((prev) => [...prev, lastID || ""]);
//       setLastID(newCursor);
//       setPage((p) => p + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (cursorHistory.length > 0) {
//       const newHistory = [...cursorHistory];
//       const prevCursor = newHistory.pop() || null;
//       setCursorHistory(newHistory);
//       setLastID(prevCursor === "" ? null : prevCursor);
//       setPage((p) => p - 1);
//     }
//   };

//   const handleJumpToFirst = () => {
//     setLastID(null);
//     setCursorHistory([]);
//     setPage(1);
//   };

//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         const { data: delData } = await deleteCourse({ variables: { id: String(id) } });
//         if (delData?.courseDelete?.success) {
//           await refetch();
//           if (displayCourses.length === 1 && page > 1) {
//             handlePreviousPage();
//           }
//         } else {
//           alert(`Delete failed: ${delData?.courseDelete?.message}`);
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
//         const { data: uploadRes } = await requestUpload({ variables: { mimetype: file.type } });
//         if (uploadRes?.request_upload?.success) {
//           const { url, filename } = uploadRes.request_upload.data;
//           await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
//           finalIcon = filename;
//         }
//       }

//       const courseVars = {
//         ...formData,
//         instructor_name: formData.instructorName,
//         price: Number(formData.price),
//         icon: finalIcon,
//       };

//       if (modal === "add") {
//         await addCourse({ variables: courseVars });
//       } else if (modal != null) {
//         await updateCourse({ variables: { ...courseVars, id: String(modal) } });
//       }

//       await refetch();
//       setModal(null);
//     } catch (e) {
//       console.error("Error saving course:", e);
//     }
//   }

//   const selectClass = "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   return (
//     <DashboardLayout activePath="courses">
//       {loading && page === 1 ? (
//         <div className="h-full flex items-center justify-center text-[#6fffd9]">Loading...</div>
//       ) : error ? (
//         <div className="h-full flex items-center justify-center text-red-400">Error loading courses.</div>
//       ) : (
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
          
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//             <div>
//               <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">Course Catalog</h1>
//               <p className="text-[0.875rem] text-[#b9cac3] mt-1">Manage and monitor your learning content</p>
//             </div>
//             <button onClick={() => setModal("add")} className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity">
//               <span className="material-symbols-outlined">Add</span> Add Course
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-3 mb-5 items-center">
//             <div className="relative flex-1 min-w-[180px]">
//               <input value={search} onChange={(e) => { setSearch(e.target.value); handleJumpToFirst(); }} placeholder="Search courses or instructors..." className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]" />
//             </div>
//             <select className={selectClass} value={filterLevel} onChange={(e) => { setFilterLevel(e.target.value); handleJumpToFirst(); }}>
//               <option value="">All Levels</option>
//               {LEVELS.map((o) => (
//                 <option key={o} value={o}>{o}</option>
//               ))}
//             </select>
//           </div>

//           <CourseTable 
//             courses={displayCourses} 
//             onEdit={(id) => setModal(id)} 
//             onDelete={handleDelete} 
//           />

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
//       )}

//       {modal !== null && (
//         <CourseModal
//           editing={displayCourses.find((c) => c.id === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </DashboardLayout>
//   );
// }

import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

// GraphQL Operations
import {
  ADD_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
  REQUEST_UPLOAD,
} from "../graphql/coursesOps";

// Types & Utils


// Modular Components

import { NumberedCursorPagination } from "../components/ui/cursorpagination";
import type { Course } from "../types/courses";
import { formatLevel, LEVELS, PER_PAGE } from "../utils/courseutils";
import CourseTable from "../components/courses/coursetable";
import CourseModal from "../components/courses/coursemodal";

// Apollo Interfaces
interface CourseGetQueryResult { 
  courseGet: { data: Course[] }; 
}
interface RequestUploadMutationResult { 
  request_upload: { success: boolean; data: { url: string; filename: string }; }; 
}
interface DeleteCourseMutationResult { 
  courseDelete: { success: boolean; message: string; }; 
}

export default function DashboardPage() {
  // ── State Management ──
  const [lastID, setLastID] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [modal, setModal] = useState<"add" | string | null>(null);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // ── GraphQL Hooks ──
  const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(GET_COURSES, {
    variables: { lastID: lastID, limit: PER_PAGE + 2 },
    fetchPolicy: "cache-and-network",
  });

  const [requestUpload] = useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
  const [addCourse, { loading: adding }] = useMutation(ADD_COURSE);
  const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE);

  // ── Data Processing & Filtering ──
  const rawCourses = data?.courseGet?.data || [];
  const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

  const filtered = useMemo(() => {
    return cleanCourses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(search.toLowerCase());
      const matchLevel = !filterLevel || formatLevel(c.level) === filterLevel;
      return matchSearch && matchLevel;
    });
  }, [cleanCourses, search, filterLevel]);

  const displayCourses = filtered.slice(0, PER_PAGE);
  const hasNextPage = filtered.length > PER_PAGE; 

  // ── Pagination Handlers ──
  const handleNextPage = () => {
    if (hasNextPage && displayCourses.length > 0) {
      const newCursor = displayCourses[displayCourses.length - 1].id;
      setCursorHistory((prev) => [...prev, lastID || ""]);
      setLastID(newCursor);
      setPage((p) => p + 1);
    }
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      const prevCursor = newHistory.pop() || null;
      setCursorHistory(newHistory);
      setLastID(prevCursor === "" ? null : prevCursor);
      setPage((p) => p - 1);
    }
  };

  const handleJumpToFirst = () => {
    setLastID(null);
    setCursorHistory([]);
    setPage(1);
  };

  // ── Action Handlers ──
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const { data: delData } = await deleteCourse({ variables: { id: String(id) } });
        if (delData?.courseDelete?.success) {
          await refetch();
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

  async function handleSave(formData: any, file: File | null) {
    try {
      let finalIcon = formData.icon;

      if (file) {
        const { data: uploadRes } = await requestUpload({ variables: { mimetype: file.type } });
        if (uploadRes?.request_upload?.success) {
          const { url, filename } = uploadRes.request_upload.data;
          await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
          finalIcon = filename; 
        }
      }

      const courseVars = {
        ...formData,
        instructor_name: formData.instructorName,
        price: Number(formData.price) || 0,
        icon: finalIcon,
      };

      if (modal === "add") {
        await addCourse({ variables: courseVars });
      } else if (modal != null) {
        await updateCourse({ variables: { ...courseVars, id: String(modal) } });
      }

      await refetch();
      setModal(null);
    } catch (e) {
      console.error("Error saving course:", e);
    }
  }

  const selectClass = "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  // ── Render Original Layout ──
  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
        
        {loading && page === 1 ? (
          <div className="h-screen flex items-center justify-center text-[#6fffd9]">Loading...</div>
        ) : error ? (
          <div className="h-screen flex items-center justify-center text-red-400">Error loading courses. Please try again.</div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
            
            {/* Header & Add Button */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
              <div>
                <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">Course Catalog</h1>
                <p className="text-[0.875rem] text-[#b9cac3] mt-1">Manage and monitor your learning content</p>
              </div>
              <button onClick={() => setModal("add")} className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-xl leading-none font-medium">+</span> Add Course
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <div className="relative flex-1 min-w-[180px]">
                <input 
                  value={search} 
                  onChange={(e) => { setSearch(e.target.value); handleJumpToFirst(); }} 
                  placeholder="Search courses or instructors..." 
                  className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]" 
                />
              </div>
              <select className={selectClass} value={filterLevel} onChange={(e) => { setFilterLevel(e.target.value); handleJumpToFirst(); }}>
                <option value="">All Levels</option>
                {LEVELS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <CourseTable 
              courses={displayCourses} 
              onEdit={(id) => setModal(id)} 
              onDelete={handleDelete} 
            />

            {/* Pagination */}
            {/* {filtered.length > 0 && (
              <NumberedCursorPagination
                page={page}
                hasNext={hasNextPage}
                hasPrevious={cursorHistory.length > 0}
                onNext={handleNextPage}
                onPrevious={handlePreviousPage}
                onJumpToFirst={handleJumpToFirst}
              />
            )} */}
            {/* Pagination */}
            <NumberedCursorPagination
              page={page}
              hasNext={hasNextPage}
              hasPrevious={cursorHistory.length > 0}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              onJumpToFirst={handleJumpToFirst}
            />
          </div>
        )}
      </div>

      {/* Modal */}
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