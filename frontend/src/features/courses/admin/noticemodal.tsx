// import React, { useState, useEffect, useRef } from "react";

// interface NoticeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: {
//     title: string;
//     description: string;
//     badge: string;
//     isActive: boolean;
//     image: File | null;
//   }) => void;
// }

// export default function NoticeModal({
//   isOpen,
//   onClose,
//   onSave,
// }: NoticeModalProps) {
//   const [formData, setFormData] = useState<{
//     title: string;
//     description: string;
//     badge: string;
//     isActive: boolean;
//     image: File | null;
//   }>({
//     title: "",
//     description: "",
//     badge: "Beginner Friendly",
//     isActive: true,
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
  
//   const modalRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Generate and clean up image previews to avoid memory leaks
//   useEffect(() => {
//     if (!formData.image) {
//       setImagePreview(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(formData.image);
//     setImagePreview(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   }, [formData.image]);

//   // Close modal when clicking outside of it
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleOutsideClick = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [isOpen, onClose]);

//   // Reset form when modal opens or closes
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         title: "",
//         description: "",
//         badge: "Beginner Friendly",
//         isActive: true,
//         image: null,
//       });
//     }
//   }, [isOpen]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Image Upload Handlers
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFormData((prev) => ({ ...prev, image: e.dataTransfer.files[0] }));
//     }
//   };

//   const removeImage = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10141a]/80 backdrop-blur-md px-4 transition-all duration-300">
//       <div
//         ref={modalRef}
//         className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh] overflow-hidden"
//       >
//         {/* ── Modal Header ── */}
//         <div className="flex justify-between items-center border-b border-[#3b4a44]/60 bg-[#181c22] px-6 py-5 shrink-0">
//           <div>
//             <h2 className="text-md font-headline text-[#dfe2eb] tracking-tight">
//               Create New Notice
//             </h2>
//             <p className="text-[0.78rem] font-body text-[#b9cac3] mt-0.5">
//               Fill in the form to broadcast a new notification card.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-8 h-8 rounded-[8px] bg-transparent text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#262a31] flex items-center justify-center transition-all duration-200 cursor-pointer"
//           >
//             <span className="material-symbols-outlined text-xl">close</span>
//           </button>
//         </div>

//         {/* ── Modal Body / Form ── */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-6 space-y-5 flex-1 overflow-y-auto"
//         >
//           {/* Title Input Field Container */}
//           <div className="space-y-2 group">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//               Notice Title
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="title"
//                 required
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Extended System Framework Upgrades"
//                 className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Description Textarea Field Container */}
//           <div className="space-y-2 group">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//               Detailed Description
//             </label>
//             <textarea
//               name="description"
//               required
//               rows={3}
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Provide clean, comprehensive technical instructions or announcements regarding this notice module..."
//               className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 resize-none leading-relaxed"
//             />
//           </div>

//           {/* ── Image Upload Field Container ── */}
//           <div className="space-y-2">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
//               Notice Header Image
//             </label>
            
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/*"
//               className="sr-only"
//               id="notice-image-upload"
//             />

//             {!imagePreview ? (
//               <label
//                 htmlFor="notice-image-upload"
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[12px] p-5 text-center cursor-pointer transition-all duration-200 min-h-[120px] ${
//                   isDragging
//                     ? "border-[#6fffd9] bg-[#6fffd9]/5"
//                     : "border-[#3b4a44] bg-[#10141a] hover:border-[#84948e]/60"
//                 }`}
//               >
//                 <span className={`material-symbols-outlined text-2xl mb-1.5 transition-colors ${isDragging ? 'text-[#6fffd9]' : 'text-[#84948e]'}`}>
//                   add_photo_alternate
//                 </span>
//                 <p className="text-[0.82rem] font-body text-[#dfe2eb] font-medium">
//                   Click to upload <span className="text-[#84948e]">or drag and drop</span>
//                 </p>
//                 <p className="text-[0.7rem] text-[#84948e] mt-0.5">
//                   PNG, JPG, or WEBP formats preferred
//                 </p>
//               </label>
//             ) : (
//               <div className="relative border border-[#3b4a44] rounded-[12px] overflow-hidden bg-[#10141a] p-2 flex items-center gap-4 group">
//                 <img
//                   src={imagePreview}
//                   alt="Upload preview"
//                   className="w-20 h-14 object-cover rounded-[6px] border border-[#3b4a44]/60 bg-[#1c2026]"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[0.82rem] font-body font-medium text-[#dfe2eb] truncate">
//                     {formData.image?.name}
//                   </p>
//                   <p className="text-[0.72rem] text-[#84948e]">
//                     {formData.image ? (formData.image.size / (1024 * 1024)).toFixed(2) : 0} MB
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="mr-2 w-7 h-7 rounded-[6px] bg-[#262a31] text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#321c1a] flex items-center justify-center transition-all duration-200 cursor-pointer"
//                   title="Remove image"
//                 >
//                   <span className="material-symbols-outlined text-lg">delete</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Dual Column Layout Row for Select Field & Switch Toggle Component */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Custom Select Box Dropdown Component */}
//             <div className="space-y-2 relative group">
//               <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//                 Badge
//               </label>
//               <div className="relative">
//                 <select
//                   name="badge"
//                   value={formData.badge}
//                   onChange={handleInputChange}
//                   className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] pl-4 pr-10 py-2.5 text-[0.9rem] font-headline font-semibold text-[#dfe2eb] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 appearance-none cursor-pointer"
//                 >
//                   <option value="Beginner Friendly" className="bg-[#1c2026]">
//                     Beginner Friendly
//                   </option>
//                   <option value="Advanced" className="bg-[#1c2026]">
//                     Advanced
//                   </option>
//                   <option value="Trending" className="bg-[#1c2026]">
//                     Trending
//                   </option>
//                 </select>
//                 <span className="material-symbols-outlined text-[#84948e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-lg group-focus-within:text-[#6fffd9] transition-colors">
//                   unfold_more
//                 </span>
//               </div>
//             </div>

//             {/* Premium Style Toggle Controller Switch Card Box Wrapper Component */}
//             <div className="space-y-2">
//               <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
//                 Status
//               </label>
//               <label className="flex items-center justify-between bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2 h-[42px] cursor-pointer hover:border-[#84948e]/60 transition-colors">
//                 <span className="text-[0.82rem] font-body font-medium text-[#dfe2eb]">
//                   {formData.isActive
//                     ? "Live (Active)"
//                     : "Draft (Hidden)"}
//                 </span>
//                 <div className="relative flex items-center">
//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleInputChange}
//                     className="sr-only peer"
//                   />
//                   <div className="w-10 h-6 bg-[#3b4a44] rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#dfe2eb] after:rounded-full after:h-5 after:w-5 after:transition-all duration-250 peer-checked:bg-[#6fffd9] peer-checked:after:bg-[#00382c]"></div>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </form>

//         {/* ── Modal Footer Action Panel Component Bar ── */}
//         <div className="border-t border-[#3b4a44]/60 bg-[#181c22] px-6 py-4 flex justify-end gap-3 shrink-0">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-[18px] py-2.5 rounded-[8px] text-[0.82rem] font-headline font-bold text-[#b9cac3] border border-[#3b4a44] bg-transparent hover:text-[#dfe2eb] hover:bg-[#262a31] transition-all duration-200 cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-[22px] py-2.5 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] rounded-[8px] text-[0.82rem] font-headline font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(111,255,217,0.15)] hover:shadow-[0_0_20px_rgba(0,229,188,0.25)]"
//           >
//             Add Notice
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






// import React, { useState, useEffect, useRef } from "react";

// // ── 1. Component Props ──
// interface NoticeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (
//     data: {
//       title: string;
//       description: string;
//       badge: string;
//       isActive: boolean;
//     },
//     file: File | null
//   ) => void;
//   isSubmitting: boolean;
// }

// // ── 2. Main Component ──
// export default function NoticeModal({
//   isOpen,
//   onClose,
//   onSave,
//   isSubmitting,
// }: NoticeModalProps) {
//   // Local Form State
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     badge: "Beginner Friendly",
//     isActive: true,
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const modalRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Generate and clean up image previews to avoid memory leaks
//   useEffect(() => {
//     if (!selectedFile) {
//       setImagePreview(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(selectedFile);
//     setImagePreview(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   }, [selectedFile]);

//   // Close modal when clicking outside of it (only if not currently submitting)
//   useEffect(() => {
//     if (!isOpen || isSubmitting) return;

//     const handleOutsideClick = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [isOpen, onClose, isSubmitting]);

//   // Reset form when modal opens or closes
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         title: "",
//         description: "",
//         badge: "Beginner Friendly",
//         isActive: true,
//       });
//       setSelectedFile(null);
//     }
//   }, [isOpen]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Image Upload Handlers
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     if (!isSubmitting) setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (!isSubmitting && e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setSelectedFile(e.dataTransfer.files[0]);
//     }
//   };

//   const removeImage = () => {
//     setSelectedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ── Final Submission Handler ──
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     // Pass the data and the raw file up to the parent component
//     onSave(formData, selectedFile);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10141a]/80 backdrop-blur-md px-4 transition-all duration-300">
//       <div
//         ref={modalRef}
//         className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh] overflow-hidden"
//       >
//         {/* ── Modal Header ── */}
//         <div className="flex justify-between items-center border-b border-[#3b4a44]/60 bg-[#181c22] px-6 py-5 shrink-0">
//           <div>
//             <h2 className="text-md font-headline text-[#dfe2eb] tracking-tight">
//               Create New Notice
//             </h2>
//             <p className="text-[0.78rem] font-body text-[#b9cac3] mt-0.5">
//               Fill in the form to broadcast a new notification card.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="w-8 h-8 rounded-[8px] bg-transparent text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#262a31] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40"
//           >
//             <span className="material-symbols-outlined text-xl">close</span>
//           </button>
//         </div>

//         {/* ── Modal Body / Form ── */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-6 space-y-5 flex-1 overflow-y-auto"
//         >
//           {/* Title Input Field */}
//           <div className="space-y-2 group">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//               Notice Title
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 name="title"
//                 required
//                 disabled={isSubmitting}
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Extended System Framework Upgrades"
//                 className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 disabled:opacity-60"
//               />
//             </div>
//           </div>

//           {/* Description Textarea Field */}
//           <div className="space-y-2 group">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//               Detailed Description
//             </label>
//             <textarea
//               name="description"
//               required
//               rows={3}
//               disabled={isSubmitting}
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Provide clean, comprehensive technical instructions or announcements regarding this notice module..."
//               className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 resize-none leading-relaxed disabled:opacity-60"
//             />
//           </div>

//           {/* ── Image Upload Field ── */}
//           <div className="space-y-2">
//             <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
//               Notice Header Image
//             </label>

//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               accept="image/*"
//               className="sr-only"
//               id="notice-image-upload"
//               disabled={isSubmitting}
//             />

//             {!imagePreview ? (
//               <label
//                 htmlFor="notice-image-upload"
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[12px] p-5 text-center cursor-pointer transition-all duration-200 min-h-[120px] ${
//                   isDragging
//                     ? "border-[#6fffd9] bg-[#6fffd9]/5"
//                     : "border-[#3b4a44] bg-[#10141a] hover:border-[#84948e]/60"
//                 } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
//               >
//                 <span className={`material-symbols-outlined text-2xl mb-1.5 transition-colors ${isDragging ? 'text-[#6fffd9]' : 'text-[#84948e]'}`}>
//                   add_photo_alternate
//                 </span>
//                 <p className="text-[0.82rem] font-body text-[#dfe2eb] font-medium">
//                   Click to upload <span className="text-[#84948e]">or drag and drop</span>
//                 </p>
//                 <p className="text-[0.7rem] text-[#84948e] mt-0.5">
//                   PNG, JPG, or WEBP formats preferred
//                 </p>
//               </label>
//             ) : (
//               <div className="relative border border-[#3b4a44] rounded-[12px] overflow-hidden bg-[#10141a] p-2 flex items-center gap-4 group">
//                 <img
//                   src={imagePreview}
//                   alt="Upload preview"
//                   className="w-20 h-14 object-cover rounded-[6px] border border-[#3b4a44]/60 bg-[#1c2026]"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[0.82rem] font-body font-medium text-[#dfe2eb] truncate">
//                     {selectedFile?.name}
//                   </p>
//                   <p className="text-[0.72rem] text-[#84948e]">
//                     {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   disabled={isSubmitting}
//                   className="mr-2 w-7 h-7 rounded-[6px] bg-[#262a31] text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#321c1a] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40"
//                   title="Remove image"
//                 >
//                   <span className="material-symbols-outlined text-lg">delete</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="space-y-2 relative group">
//               <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
//                 Badge
//               </label>
//               <div className="relative">
//                 <select
//                   name="badge"
//                   disabled={isSubmitting}
//                   value={formData.badge}
//                   onChange={handleInputChange}
//                   className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] pl-4 pr-10 py-2.5 text-[0.9rem] font-headline font-semibold text-[#dfe2eb] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60"
//                 >
//                   <option value="Beginner Friendly" className="bg-[#1c2026]">
//                     Beginner Friendly
//                   </option>
//                   <option value="Advanced" className="bg-[#1c2026]">
//                     Advanced
//                   </option>
//                   <option value="Trending" className="bg-[#1c2026]">
//                     Trending
//                   </option>
//                 </select>
//                 <span className="material-symbols-outlined text-[#84948e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-lg group-focus-within:text-[#6fffd9] transition-colors">
//                   unfold_more
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
//                 Status
//               </label>
//               <label className={`flex items-center justify-between bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2 h-[42px] cursor-pointer hover:border-[#84948e]/60 transition-colors ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
//                 <span className="text-[0.82rem] font-body font-medium text-[#dfe2eb]">
//                   {formData.isActive ? "Live (Active)" : "Draft (Hidden)"}
//                 </span>
//                 <div className="relative flex items-center">
//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleInputChange}
//                     disabled={isSubmitting}
//                     className="sr-only peer"
//                   />
//                   <div className="w-10 h-6 bg-[#3b4a44] rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#dfe2eb] after:rounded-full after:h-5 after:w-5 after:transition-all duration-250 peer-checked:bg-[#6fffd9] peer-checked:after:bg-[#00382c]"></div>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </form>

//         {/* ── Modal Footer Action Panel ── */}
//         <div className="border-t border-[#3b4a44]/60 bg-[#181c22] px-6 py-4 flex justify-end gap-3 shrink-0">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="px-[18px] py-2.5 rounded-[8px] text-[0.82rem] font-headline font-bold text-[#b9cac3] border border-[#3b4a44] bg-transparent hover:text-[#dfe2eb] hover:bg-[#262a31] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="px-[22px] py-2.5 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] rounded-[8px] text-[0.82rem] font-headline font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(111,255,217,0.15)] hover:shadow-[0_0_20px_rgba(0,229,188,0.25)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="material-symbols-outlined animate-spin text-[1.1rem]">
//                   progress_activity
//                 </span>
//                 Adding...
//               </>
//             ) : (
//               "Add Notice"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";

// ── 1. Component Props ──
interface NoticeModalProps {
  isOpen: boolean;
  editing?: {
    id?: string | number;
    title: string;
    description: string;
    badge: string;
    isActive: boolean;
    image?: string; // Holds the existing image URL if editing
  } | null;
  onClose: () => void;
  onSave: (
    data: {
      title: string;
      description: string;
      badge: string;
      isActive: boolean;
    },
    file: File | null
  ) => void;
  isSubmitting: boolean;
}

// ── 2. Main Component ──
export default function NoticeModal({
  isOpen,
  editing, // <-- Now receiving the editing prop
  onClose,
  onSave,
  isSubmitting,
}: NoticeModalProps) {
  
  // Initialize state with editing values if they exist
  const [formData, setFormData] = useState({
    title: editing?.title || "",
    description: editing?.description || "",
    badge: editing?.badge || "Beginner Friendly",
    isActive: editing !== null && editing !== undefined ? editing.isActive : true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editing?.image || null);
  const [isDragging, setIsDragging] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close modal when clicking outside of it
  useEffect(() => {
    if (!isOpen || isSubmitting) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose, isSubmitting]);

  // Reset or populate form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      // If modal opens, fill with edit data (or blank if adding new)
      setFormData({
        title: editing?.title || "",
        description: editing?.description || "",
        badge: editing?.badge || "Beginner Friendly",
        isActive: editing !== null && editing !== undefined ? editing.isActive : true,
      });
      setSelectedFile(null);
      setImagePreview(editing?.image || null);
    } else {
      // Clear data when closing
      setFormData({
        title: "",
        description: "",
        badge: "Beginner Friendly",
        isActive: true,
      });
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [isOpen, editing]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSubmitting) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isSubmitting && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Final Submission Handler ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Pass the data and the raw file up to the parent component
    onSave(formData, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10141a]/80 backdrop-blur-md px-4 transition-all duration-300">
      <div
        ref={modalRef}
        className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* ── Modal Header ── */}
        <div className="flex justify-between items-center border-b border-[#3b4a44]/60 bg-[#181c22] px-6 py-5 shrink-0">
          <div>
            <h2 className="text-md font-headline text-[#dfe2eb] tracking-tight">
              {editing ? "Edit Notice" : "Create New Notice"}
            </h2>
            <p className="text-[0.78rem] font-body text-[#b9cac3] mt-0.5">
              {editing 
                ? "Update the details for this notification card." 
                : "Fill in the form to broadcast a new notification card."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-[8px] bg-transparent text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#262a31] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* ── Modal Body / Form ── */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 flex-1 overflow-y-auto"
        >
          {/* Title Input Field */}
          <div className="space-y-2 group">
            <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
              Notice Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                required
                disabled={isSubmitting}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Extended System Framework Upgrades"
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Description Textarea Field */}
          <div className="space-y-2 group">
            <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
              Detailed Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              disabled={isSubmitting}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide clean, comprehensive technical instructions or announcements regarding this notice module..."
              className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-3 text-[0.9rem] font-body text-[#dfe2eb] placeholder-[#84948e]/50 focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 resize-none leading-relaxed disabled:opacity-60"
            />
          </div>

          {/* ── Image Upload Field ── */}
          <div className="space-y-2">
            <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
              Notice Header Image
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="sr-only"
              id="notice-image-upload"
              disabled={isSubmitting}
            />

            {!imagePreview ? (
              <label
                htmlFor="notice-image-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[12px] p-5 text-center cursor-pointer transition-all duration-200 min-h-[120px] ${
                  isDragging
                    ? "border-[#6fffd9] bg-[#6fffd9]/5"
                    : "border-[#3b4a44] bg-[#10141a] hover:border-[#84948e]/60"
                } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
              >
                <span className={`material-symbols-outlined text-2xl mb-1.5 transition-colors ${isDragging ? 'text-[#6fffd9]' : 'text-[#84948e]'}`}>
                  add_photo_alternate
                </span>
                <p className="text-[0.82rem] font-body text-[#dfe2eb] font-medium">
                  Click to upload <span className="text-[#84948e]">or drag and drop</span>
                </p>
                <p className="text-[0.7rem] text-[#84948e] mt-0.5">
                  PNG, JPG, or WEBP formats preferred
                </p>
              </label>
            ) : (
              <div className="relative border border-[#3b4a44] rounded-[12px] overflow-hidden bg-[#10141a] p-2 flex items-center gap-4 group">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-20 h-14 object-cover rounded-[6px] border border-[#3b4a44]/60 bg-[#1c2026]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.82rem] font-body font-medium text-[#dfe2eb] truncate">
                    {selectedFile ? selectedFile.name : "Existing Image"}
                  </p>
                  {selectedFile && (
                    <p className="text-[0.72rem] text-[#84948e]">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isSubmitting}
                  className="mr-2 w-7 h-7 rounded-[6px] bg-[#262a31] text-[#84948e] hover:text-[#ffb4ab] hover:bg-[#321c1a] flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40"
                  title="Remove image"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 relative group">
              <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3] group-focus-within:text-[#6fffd9] transition-colors">
                Badge
              </label>
              <div className="relative">
                <select
                  name="badge"
                  disabled={isSubmitting}
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] pl-4 pr-10 py-2.5 text-[0.9rem] font-headline font-semibold text-[#dfe2eb] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60"
                >
                  <option value="Beginner Friendly" className="bg-[#1c2026]">
                    Beginner Friendly
                  </option>
                  <option value="Advanced" className="bg-[#1c2026]">
                    Advanced
                  </option>
                  <option value="Trending" className="bg-[#1c2026]">
                    Trending
                  </option>
                  <option value="Urgent" className="bg-[#1c2026]">
                    Urgent
                  </option>
                  <option value="Update" className="bg-[#1c2026]">
                    Update
                  </option>
                </select>
                <span className="material-symbols-outlined text-[#84948e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-lg group-focus-within:text-[#6fffd9] transition-colors">
                  unfold_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.75rem] tracking-wider font-headline font-bold text-[#b9cac3]">
                Status
              </label>
              <label className={`flex items-center justify-between bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2 h-[42px] cursor-pointer hover:border-[#84948e]/60 transition-colors ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
                <span className="text-[0.82rem] font-body font-medium text-[#dfe2eb]">
                  {formData.isActive ? "Live (Active)" : "Draft (Hidden)"}
                </span>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[#3b4a44] rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#dfe2eb] after:rounded-full after:h-5 after:w-5 after:transition-all duration-250 peer-checked:bg-[#6fffd9] peer-checked:after:bg-[#00382c]"></div>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* ── Modal Footer Action Panel ── */}
        <div className="border-t border-[#3b4a44]/60 bg-[#181c22] px-6 py-4 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-[18px] py-2.5 rounded-[8px] text-[0.82rem] font-headline font-bold text-[#b9cac3] border border-[#3b4a44] bg-transparent hover:text-[#dfe2eb] hover:bg-[#262a31] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-[22px] py-2.5 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] rounded-[8px] text-[0.82rem] font-headline font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(111,255,217,0.15)] hover:shadow-[0_0_20px_rgba(0,229,188,0.25)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[1.1rem]">
                  progress_activity
                </span>
                Saving...
              </>
            ) : editing ? (
              "Save Changes"
            ) : (
              "Add Notice"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}