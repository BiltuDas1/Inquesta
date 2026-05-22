// import { useState, useRef, type ChangeEvent } from "react";

// // 1. Define the shape of your form data
// interface HeroFormData {
//   badgeText: string;
//   titleLine1: string;
//   titleLine2: string;
//   titleLine3: string;
//   description: string;
//   imageUrl: string;
//   imageFile: File | null;
// }

// export function HeroSectionSettings() {
//   // 2. Apply the interface to useState
//   const [formData, setFormData] = useState<HeroFormData>({
//     badgeText: "REGISTRATION IS CURRENTLY GOING ON",
//     titleLine1: "Learn.",
//     titleLine2: "Build.",
//     titleLine3: "Innovate", // No dot here
//     description:
//       "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
//     imageFile: null,
//   });

//   // 3. Add types to your refs
//   const inputRefs = {
//     badgeText: useRef<HTMLInputElement>(null),
//     titleLine1: useRef<HTMLInputElement>(null),
//     titleLine2: useRef<HTMLInputElement>(null),
//     titleLine3: useRef<HTMLInputElement>(null),
//     description: useRef<HTMLTextAreaElement>(null),
//     imageUrl: useRef<HTMLInputElement>(null),
//   };

//   // 4. Create a specific type for the fieldKey
//   type FieldKey = keyof typeof inputRefs;

//   // 5. Change handler for standard text inputs
//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 6. Special handler for the Image File Upload
//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({
//         ...prev,
//         imageUrl: previewUrl,
//         imageFile: file,
//       }));
//     }
//   };

//   // 7. Focus or trigger the appropriate input
//   const focusInput = (fieldKey: FieldKey) => {
//     if (inputRefs[fieldKey].current) {
//       if (fieldKey === "imageUrl") {
//         inputRefs[fieldKey].current?.click();
//       } else {
//         inputRefs[fieldKey].current?.focus();
//         inputRefs[fieldKey].current?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//     }
//   };

//   const handleSave = () => {
//     console.log("Saving new hero configuration to database...", formData);
//     alert("Hero section settings saved successfully!");
//   };

//   const inputClass =
//     "w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors";
//   const labelClass = "block text-sm font-medium text-[#b9cac3] mb-1";

//   return (
//     <div className="flex flex-col xl:flex-row h-full gap-6 p-4 sm:p-6 lg:p-8 overflow-y-auto xl:overflow-hidden bg-[#10141a]">
//       {/* =========================================
//           LEFT PANEL: EDITOR FORM
//       ========================================= */}
//       <div className="xl:w-1/3 flex flex-col bg-[#1c2026] rounded-2xl border border-[#3b4a44] shadow-xl overflow-hidden shrink-0">
//         <div className="p-4 border-b border-[#3b4a44] flex justify-between items-center bg-[#262a31] sticky top-0 z-20">
//           <h2 className="text-xl font-bold text-[#dfe2eb]">Hero Content</h2>
//           <button
//             onClick={handleSave}
//             className="bg-[#6fffd9] text-[#003829] px-4 py-2 rounded-lg font-bold hover:bg-[#5cebc5] transition-colors flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined text-sm">save</span>
//             Save
//           </button>
//         </div>

//         <div className="p-6 xl:overflow-y-auto space-y-6 custom-scrollbar xl:h-full pb-20">
//           {/* Badge */}
//           <div>
//             <label className={labelClass}>Top Badge Text</label>
//             <input
//               ref={inputRefs.badgeText}
//               type="text"
//               name="badgeText"
//               value={formData.badgeText}
//               onChange={handleChange}
//               className={inputClass}
//             />
//           </div>

//           {/* Title Lines */}
//           <div className="p-4 border border-[#3b4a44] rounded-xl bg-[#10141a]/50 space-y-4">
//             <h3 className="text-[#dfe2eb] font-semibold text-sm mb-2">
//               Main Heading
//             </h3>
//             <div>
//               <label className={labelClass}>Line 1</label>
//               <input
//                 ref={inputRefs.titleLine1}
//                 type="text"
//                 name="titleLine1"
//                 value={formData.titleLine1}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className={labelClass}>Line 2</label>
//               <input
//                 ref={inputRefs.titleLine2}
//                 type="text"
//                 name="titleLine2"
//                 value={formData.titleLine2}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className={labelClass}>Line 3 (Gradient Text)</label>
//               <input
//                 ref={inputRefs.titleLine3}
//                 type="text"
//                 name="titleLine3"
//                 value={formData.titleLine3}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className={labelClass}>Subtitle / Description</label>
//             <textarea
//               ref={inputRefs.description}
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={3}
//               className={`${inputClass} resize-none`}
//             />
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className={labelClass}>Right Image</label>
//             <input
//               ref={inputRefs.imageUrl}
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="w-full bg-[#10141a] border border-[#3b4a44] text-[#b9cac3] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors 
//               file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#3b4a44] file:text-[#dfe2eb] hover:file:bg-[#262a31] file:cursor-pointer cursor-pointer"
//             />
//             {formData.imageFile && (
//               <p className="text-xs text-[#6fffd9] mt-2">
//                 Selected: {formData.imageFile.name}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* =========================================
//           RIGHT PANEL: LIVE PREVIEW
//       ========================================= */}
//       <div className="xl:w-2/3 rounded-2xl border border-[#3b4a44] shadow-2xl xl:overflow-y-auto relative bg-background text-on-background shrink-0 xl:shrink">
//         <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-white/20">
//           <span className="w-2 h-2 rounded-full bg-[#6fffd9] animate-pulse"></span>
//           Live Preview
//         </div>

//         <section className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden px-8 pt-24 pb-12 w-full">
//           <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
//             <div className="space-y-8 min-w-0">
              
//               {/* Badge Preview */}
//               <div className="relative group w-fit max-w-full">
//                 <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
//                   <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
//                   <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant truncate">
//                     {formData.badgeText}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => focusInput("badgeText")}
//                   className="absolute -top-3 -right-3 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>

//               {/* Title Preview */}
//               <div className="relative group pr-8">
//                 <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] break-words">
//                   {formData.titleLine1} <br /> {formData.titleLine2} <br />
                  
//                   {/* Removed the dot from here completely */}
//                   <span className="text-gradient">{formData.titleLine3}</span>
//                 </h1>
                
//                 <button
//                   onClick={() => focusInput("titleLine3")}
//                   className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>

//               {/* Description Preview */}
//               <div className="relative group max-w-xl pr-8">
//                 <p className="text-lg md:text-md text-on-surface-variant leading-relaxed break-words">
//                   {formData.description}
//                 </p>
//                 <button
//                   onClick={() => focusInput("description")}
//                   className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>
//             </div>

//             {/* Image Preview */}
//             <div className="hidden lg:block relative group min-w-0">
//               <div className="glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden">
//                 <img
//                   alt="Hero Preview"
//                   className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity"
//                   src={formData.imageUrl}
//                   onError={(e) => {
//                     e.currentTarget.src =
//                       "https://placehold.co/800x500/1c2026/6fffd9?text=Invalid+Image+URL";
//                   }}
//                 />
//               </div>
//               <button
//                 onClick={() => focusInput("imageUrl")}
//                 className="absolute top-8 right-8 bg-[#6fffd9] text-[#003829] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-20"
//               >
//                 <span className="material-symbols-outlined">edit</span>
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }


// import { useState, useRef, useEffect, type ChangeEvent } from "react";
// import {  gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";

// // --- 1. GraphQL Query ---
// const GET_HERO_SECTION = gql`
//   query getHeroSection {
//     getHeroSection {
//       data {
//         description
//         heading
//         heroImageUrl
//         statusBadge
//       }
//     }
//   }
// `;

// const UPDATE_HERO = gql`
//   mutation updateHero(
//     $description: String!
//     $heading: String!
//     $heroImage: String!
//     $statusBadge: String!
//   ) {
//     updateHero(
//       description: $description
//       heading: $heading
//       heroImage: $heroImage
//       statusBadge: $statusBadge
//     ) {
//       success
//       message
//     }
//   }
// `;

// const REQUEST_UPLOAD = gql`
//   mutation requestUpload($mimetype: String!) {
//     request_upload(mimetype: $mimetype) {
//       success
//       data {
//         url
//         filename
//       }
//     }
//   }
// `;


// interface HeroData {
//   description: string;
//   heading: string;
//   heroImageUrl: string;
//   statusBadge: string;
// }

// interface GetHeroSectionResponse {
//   getHeroSection: {
//     data: HeroData;
//   };
// }

// interface UpdateHeroResponse {
//   updateHero: {
//     success: boolean;
//     message: string;
//   };
// }

// interface RequestUploadResponse {
//   request_upload: {
//     success: boolean;
//     data: {
//       url: string;
//       filename: string;
//     };
//   };
// }

// interface HeroFormData {
//   badgeText: string;
//   titleLine1: string;
//   titleLine2: string;
//   titleLine3: string;
//   description: string;
//   imageUrl: string;
//   imageFile: File | null;
// }

// export function HeroSectionSettings() {
//   // 3. Form State
//   const [formData, setFormData] = useState<HeroFormData>({
//     badgeText: "REGISTRATION IS CURRENTLY GOING ON",
//     titleLine1: "Learn.",
//     titleLine2: "Build.",
//     titleLine3: "Innovate", 
//     description: "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
//     imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
//     imageFile: null,
//   });

//   // 4. Fetch the dynamic data
//   const { data, loading, error } = useQuery<GetHeroSectionResponse>(GET_HERO_SECTION, {
//     fetchPolicy: "network-only", // Ensures we get the freshest data for the editor
//   });

//   // 5. Populate form when data arrives
//   useEffect(() => {
//     if (data?.getHeroSection?.data) {
//       const dbData = data.getHeroSection.data;
      
//       // Handle the heading split logic (split by \n or space)
//       const rawHeading = dbData.heading || "";
//       const delimiter = rawHeading.includes('\n') ? '\n' : ' ';
//       const headingParts = rawHeading.split(delimiter).filter(p => p.trim() !== '');

//       setFormData({
//         badgeText: dbData.statusBadge || "REGISTRATION IS CURRENTLY GOING ON",
//         titleLine1: headingParts[0] || "Learn.",
//         titleLine2: headingParts[1] || "Build.",
//         // Grab everything else for the 3rd line in case it contains multiple words
//         titleLine3: headingParts.slice(2).join(" ") || "Innovate", 
//         description: dbData.description || "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
//         imageUrl: dbData.heroImageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
//         imageFile: null, // Keep null as this is only for newly uploaded files
//       });
//     }
//   }, [data]);

//   // 6. Refs & Focus handling
//   const inputRefs = {
//     badgeText: useRef<HTMLInputElement>(null),
//     titleLine1: useRef<HTMLInputElement>(null),
//     titleLine2: useRef<HTMLInputElement>(null),
//     titleLine3: useRef<HTMLInputElement>(null),
//     description: useRef<HTMLTextAreaElement>(null),
//     imageUrl: useRef<HTMLInputElement>(null),
//   };

//   type FieldKey = keyof typeof inputRefs;

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({
//         ...prev,
//         imageUrl: previewUrl,
//         imageFile: file,
//       }));
//     }
//   };

//   const focusInput = (fieldKey: FieldKey) => {
//     if (inputRefs[fieldKey].current) {
//       if (fieldKey === "imageUrl") {
//         inputRefs[fieldKey].current?.click();
//       } else {
//         inputRefs[fieldKey].current?.focus();
//         inputRefs[fieldKey].current?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//     }
//   };

//   const handleSave = () => {
//     // Note: When saving to the DB, you will want to recombine the title lines
//     // const fullHeadingToSave = `${formData.titleLine1}\n${formData.titleLine2}\n${formData.titleLine3}`;
//     console.log("Saving new hero configuration to database...", formData);
//     alert("Hero section settings saved successfully!");
//   };

//   const inputClass =
//     "w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors disabled:opacity-50";
//   const labelClass = "block text-sm font-medium text-[#b9cac3] mb-1";

//   // Loading State Overlay Check
//   if (error) {
//     return (
//       <div className="flex h-full items-center justify-center text-red-400 p-8">
//         Failed to load Hero settings: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col xl:flex-row h-full gap-6 p-4 sm:p-6 lg:p-8 overflow-y-auto xl:overflow-hidden bg-[#10141a] relative">
      
//       {/* Optional Loading Overlay while fetching */}
//       {loading && (
//         <div className="absolute inset-0 z-50 bg-[#10141a]/80 backdrop-blur-sm flex items-center justify-center">
//           <div className="flex flex-col items-center gap-3">
//             <span className="w-8 h-8 border-4 border-[#3b4a44] border-t-[#6fffd9] rounded-full animate-spin"></span>
//             <p className="text-[#dfe2eb] font-medium">Loading settings...</p>
//           </div>
//         </div>
//       )}

//       {/* =========================================
//           LEFT PANEL: EDITOR FORM
//       ========================================= */}
//       <div className="xl:w-1/3 flex flex-col bg-[#1c2026] rounded-2xl border border-[#3b4a44] shadow-xl overflow-hidden shrink-0">
//         <div className="p-4 border-b border-[#3b4a44] flex justify-between items-center bg-[#262a31] sticky top-0 z-20">
//           <h2 className="text-xl font-bold text-[#dfe2eb]">Hero Content</h2>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="bg-[#6fffd9] text-[#003829] px-4 py-2 rounded-lg font-bold hover:bg-[#5cebc5] transition-colors flex items-center gap-2 disabled:opacity-50"
//           >
//             <span className="material-symbols-outlined text-sm">save</span>
//             Save
//           </button>
//         </div>

//         <div className="p-6 xl:overflow-y-auto space-y-6 custom-scrollbar xl:h-full pb-20">
//           {/* Badge */}
//           <div>
//             <label className={labelClass}>Top Badge Text</label>
//             <input
//               ref={inputRefs.badgeText}
//               type="text"
//               name="badgeText"
//               value={formData.badgeText}
//               onChange={handleChange}
//               disabled={loading}
//               className={inputClass}
//             />
//           </div>

//           {/* Title Lines */}
//           <div className="p-4 border border-[#3b4a44] rounded-xl bg-[#10141a]/50 space-y-4">
//             <h3 className="text-[#dfe2eb] font-semibold text-sm mb-2">
//               Main Heading
//             </h3>
//             <div>
//               <label className={labelClass}>Line 1</label>
//               <input
//                 ref={inputRefs.titleLine1}
//                 type="text"
//                 name="titleLine1"
//                 value={formData.titleLine1}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className={labelClass}>Line 2</label>
//               <input
//                 ref={inputRefs.titleLine2}
//                 type="text"
//                 name="titleLine2"
//                 value={formData.titleLine2}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className={labelClass}>Line 3 (Gradient Text)</label>
//               <input
//                 ref={inputRefs.titleLine3}
//                 type="text"
//                 name="titleLine3"
//                 value={formData.titleLine3}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className={labelClass}>Subtitle / Description</label>
//             <textarea
//               ref={inputRefs.description}
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               disabled={loading}
//               rows={4}
//               className={`${inputClass} resize-none`}
//             />
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className={labelClass}>Right Image</label>
//             <input
//               ref={inputRefs.imageUrl}
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               disabled={loading}
//               className="w-full bg-[#10141a] border border-[#3b4a44] text-[#b9cac3] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors 
//               file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#3b4a44] file:text-[#dfe2eb] hover:file:bg-[#262a31] file:cursor-pointer cursor-pointer"
//             />
//             {formData.imageFile ? (
//               <p className="text-xs text-[#6fffd9] mt-2">
//                 Selected: {formData.imageFile.name}
//               </p>
//             ) : (
//               <p className="text-xs text-[#84948e] mt-2 truncate">
//                 Current: {formData.imageUrl.split('/').pop()}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* =========================================
//           RIGHT PANEL: LIVE PREVIEW
//       ========================================= */}
//       <div className="xl:w-2/3 rounded-2xl border border-[#3b4a44] shadow-2xl xl:overflow-y-auto relative bg-background text-on-background shrink-0 xl:shrink">
//         <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-white/20">
//           <span className="w-2 h-2 rounded-full bg-[#6fffd9] animate-pulse"></span>
//           Live Preview
//         </div>

//         <section className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden px-8 pt-24 pb-12 w-full">
//           <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
//             <div className="space-y-8 min-w-0">
              
//               {/* Badge Preview */}
//               <div className="relative group w-fit max-w-full">
//                 <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
//                   <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
//                   <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant truncate">
//                     {formData.badgeText}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => focusInput("badgeText")}
//                   className="absolute -top-3 -right-3 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>

//               {/* Title Preview */}
//               <div className="relative group pr-8">
//                 <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] break-words">
//                   {formData.titleLine1} <br /> {formData.titleLine2} <br />
//                   <span className="text-gradient">{formData.titleLine3}</span>
//                 </h1>
                
//                 <button
//                   onClick={() => focusInput("titleLine3")}
//                   className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>

//               {/* Description Preview */}
//               <div className="relative group max-w-xl pr-8">
//                 <p className="text-lg md:text-md text-on-surface-variant leading-relaxed break-words">
//                   {formData.description}
//                 </p>
//                 <button
//                   onClick={() => focusInput("description")}
//                   className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">edit</span>
//                 </button>
//               </div>
//             </div>

//             {/* Image Preview */}
//             <div className="hidden lg:block relative group min-w-0">
//               <div className="glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden">
//                 <img
//                   alt="Hero Preview"
//                   className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity"
//                   src={formData.imageUrl}
//                   onError={(e) => {
//                     e.currentTarget.src =
//                       "https://placehold.co/800x500/1c2026/6fffd9?text=Invalid+Image+URL";
//                   }}
//                 />
//               </div>
//               <button
//                 onClick={() => focusInput("imageUrl")}
//                 className="absolute top-8 right-8 bg-[#6fffd9] text-[#003829] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-20"
//               >
//                 <span className="material-symbols-outlined">edit</span>
//               </button>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";

// --- 1. GraphQL Queries & Mutations ---
const GET_HERO_SECTION = gql`
  query getHeroSection {
    getHeroSection {
      data {
        description
        heading
        heroImageUrl
        statusBadge
      }
    }
  }
`;

const UPDATE_HERO = gql`
  mutation updateHero(
    $description: String!
    $heading: String!
    $heroImage: String!
    $statusBadge: String!
  ) {
    updateHero(
      description: $description
      heading: $heading
      heroImage: $heroImage
      statusBadge: $statusBadge
    ) {
      success
      message
    }
  }
`;

const REQUEST_UPLOAD = gql`
  mutation requestUpload($mimetype: String!) {
    request_upload(mimetype: $mimetype) {
      success
      data {
        url
        filename
      }
    }
  }
`;

// --- 2. TypeScript Interfaces ---
interface HeroData {
  description: string;
  heading: string;
  heroImageUrl: string;
  statusBadge: string;
}

interface GetHeroSectionResponse {
  getHeroSection: {
    data: HeroData;
  };
}

interface UpdateHeroResponse {
  updateHero: {
    success: boolean;
    message: string;
  };
}

interface RequestUploadResponse {
  request_upload: {
    success: boolean;
    data: {
      url: string;
      filename: string;
    };
  };
}

interface HeroFormData {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
}

export function HeroSectionSettings() {
  // 3. Form State
  const [formData, setFormData] = useState<HeroFormData>({
    badgeText: "REGISTRATION IS CURRENTLY GOING ON",
    titleLine1: "Learn.",
    titleLine2: "Build.",
    titleLine3: "Innovate",
    description: "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    imageFile: null,
  });

  // Fetch the dynamic data
  const { data, loading, error, refetch } = useQuery<GetHeroSectionResponse>(GET_HERO_SECTION, {
    fetchPolicy: "network-only", // Ensures we get the freshest data for the editor
  });

  // Setup Mutations
  const [updateHero, { loading: updating }] = useMutation<UpdateHeroResponse>(UPDATE_HERO);
  const [requestUpload, { loading: uploading }] = useMutation<RequestUploadResponse>(REQUEST_UPLOAD);

  const isBusy = loading || updating || uploading;

  // 5. Populate form when data arrives
  useEffect(() => {
    if (data?.getHeroSection?.data) {
      const dbData = data.getHeroSection.data;
      
      // Handle the heading split logic (split by \n or space)
      const rawHeading = dbData.heading || "";
      const delimiter = rawHeading.includes('\n') ? '\n' : ' ';
      const headingParts = rawHeading.split(delimiter).filter(p => p.trim() !== '');

      setFormData({
        badgeText: dbData.statusBadge || "REGISTRATION IS CURRENTLY GOING ON",
        titleLine1: headingParts[0] || "Learn.",
        titleLine2: headingParts[1] || "Build.",
        // Grab everything else for the 3rd line in case it contains multiple words
        titleLine3: headingParts.slice(2).join(" ") || "Innovate", 
        description: dbData.description || "Hands-on STEM Courses for K-12 students across India. From PictoBlox to Arduino.",
        imageUrl: dbData.heroImageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        imageFile: null, // Keep null as this is only for newly uploaded files
      });
    }
  }, [data]);

  // 6. Refs & Focus handling
  const inputRefs = {
    badgeText: useRef<HTMLInputElement>(null),
    titleLine1: useRef<HTMLInputElement>(null),
    titleLine2: useRef<HTMLInputElement>(null),
    titleLine3: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    imageUrl: useRef<HTMLInputElement>(null),
  };

  type FieldKey = keyof typeof inputRefs;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: previewUrl,
        imageFile: file,
      }));
    }
  };

  const focusInput = (fieldKey: FieldKey) => {
    if (inputRefs[fieldKey].current) {
      if (fieldKey === "imageUrl") {
        inputRefs[fieldKey].current?.click();
      } else {
        inputRefs[fieldKey].current?.focus();
        inputRefs[fieldKey].current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      let finalImage = formData.imageUrl; // Default to current URL string if no new file

      //  Upload new image if file was selected
      if (formData.imageFile) {
        const { data: uploadRes } = await requestUpload({
          variables: { mimetype: formData.imageFile.type },
        });

        if (uploadRes?.request_upload?.success) {
          const { url, filename } = uploadRes.request_upload.data;

          // Perform PUT request to presigned URL
          await fetch(url, {
            method: "PUT",
            body: formData.imageFile,
            headers: { "Content-Type": formData.imageFile.type },
          });

          finalImage = filename; // Use the generated filename for saving to DB
        } else {
          throw new Error("Failed to get upload authorization.");
        }
      }

      // 2. Save entire Hero configuration to DB
      const fullHeadingToSave = `${formData.titleLine1}\n${formData.titleLine2}\n${formData.titleLine3}`;
      
      const { data: updateData } = await updateHero({
        variables: {
          description: formData.description,
          heading: fullHeadingToSave,
          heroImage: finalImage,
          statusBadge: formData.badgeText,
        }
      });

      if (updateData?.updateHero?.success) {
        toast.success("Hero section settings saved successfully!");
        setFormData(prev => ({ ...prev, imageFile: null })); // Reset file so it doesn't re-upload on next save
        refetch(); // Refresh cache
      } else {
        throw new Error(updateData?.updateHero?.message || "Failed to update hero configuration.");
      }

    } catch (err: any) {
      console.error("Error saving hero settings:", err);
      toast.error(err.message || "An unexpected error occurred while saving.");
    }
  };

  const inputClass =
    "w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-[#b9cac3] mb-1";

  // Loading State Overlay Check
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400 p-8">
        Failed to load Hero settings: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row h-full gap-6 p-4 sm:p-6 lg:p-8 overflow-y-auto xl:overflow-hidden bg-[#10141a] relative">
      
      {/* Loading Overlay while fetching, updating, or uploading */}
      {isBusy && (
        <div className="absolute inset-0 z-50 bg-[#10141a]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-4 border-[#3b4a44] border-t-[#6fffd9] rounded-full animate-spin"></span>
            <p className="text-[#dfe2eb] font-medium">
              {uploading ? "Uploading image..." : updating ? "Saving settings..." : "Loading settings..."}
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          LEFT PANEL: EDITOR FORM
      ========================================= */}
      <div className="xl:w-1/3 flex flex-col bg-[#1c2026] rounded-2xl border border-[#3b4a44] shadow-xl overflow-hidden shrink-0">
        <div className="p-4 border-b border-[#3b4a44] flex justify-between items-center bg-[#262a31] sticky top-0 z-20">
          <h2 className="text-xl font-bold text-[#dfe2eb]">Hero Content</h2>
          <button
            onClick={handleSave}
            disabled={isBusy}
            className="bg-[#6fffd9] text-[#003829] px-4 py-2 rounded-lg font-bold hover:bg-[#5cebc5] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Save
          </button>
        </div>

        <div className="p-6 xl:overflow-y-auto space-y-6 custom-scrollbar xl:h-full pb-20">
          {/* Badge */}
          <div>
            <label className={labelClass}>Top Badge Text</label>
            <input
              ref={inputRefs.badgeText}
              type="text"
              name="badgeText"
              value={formData.badgeText}
              onChange={handleChange}
              disabled={isBusy}
              className={inputClass}
            />
          </div>

          {/* Title Lines */}
          <div className="p-4 border border-[#3b4a44] rounded-xl bg-[#10141a]/50 space-y-4">
            <h3 className="text-[#dfe2eb] font-semibold text-sm mb-2">
              Main Heading
            </h3>
            <div>
              <label className={labelClass}>Line 1</label>
              <input
                ref={inputRefs.titleLine1}
                type="text"
                name="titleLine1"
                value={formData.titleLine1}
                onChange={handleChange}
                disabled={isBusy}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Line 2</label>
              <input
                ref={inputRefs.titleLine2}
                type="text"
                name="titleLine2"
                value={formData.titleLine2}
                onChange={handleChange}
                disabled={isBusy}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Line 3 (Gradient Text)</label>
              <input
                ref={inputRefs.titleLine3}
                type="text"
                name="titleLine3"
                value={formData.titleLine3}
                onChange={handleChange}
                disabled={isBusy}
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Subtitle / Description</label>
            <textarea
              ref={inputRefs.description}
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isBusy}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Right Image</label>
            <input
              ref={inputRefs.imageUrl}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isBusy}
              className="w-full bg-[#10141a] border border-[#3b4a44] text-[#b9cac3] rounded-lg px-4 py-2 focus:outline-none focus:border-[#6fffd9] transition-colors 
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#3b4a44] file:text-[#dfe2eb] hover:file:bg-[#262a31] file:cursor-pointer cursor-pointer"
            />
            {formData.imageFile ? (
              <p className="text-xs text-[#6fffd9] mt-2">
                Selected: {formData.imageFile.name}
              </p>
            ) : (
              <p className="text-xs text-[#84948e] mt-2 truncate">
                Current: {formData.imageUrl.split('/').pop()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: LIVE PREVIEW
      ========================================= */}
      <div className="xl:w-2/3 rounded-2xl border border-[#3b4a44] shadow-2xl xl:overflow-y-auto relative bg-background text-on-background shrink-0 xl:shrink">
        <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-[#6fffd9] animate-pulse"></span>
          Live Preview
        </div>

        <section className="relative min-h-[550px] md:min-h-[650px] flex items-center overflow-hidden px-8 pt-24 pb-12 w-full">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 min-w-0">
              
              {/* Badge Preview */}
              <div className="relative group w-fit max-w-full">
                <div className="inline-flex items-center space-x-2 bg-surface-container-low/50 border border-outline-variant px-4 py-2 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                  <span className="text-xs font-medium tracking-widest uppercase text-on-surface-variant truncate">
                    {formData.badgeText}
                  </span>
                </div>
                <button
                  onClick={() => focusInput("badgeText")}
                  className="absolute -top-3 -right-3 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              {/* Title Preview */}
              <div className="relative group pr-8">
                <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] break-words">
                  {formData.titleLine1} <br /> {formData.titleLine2} <br />
                  <span className="text-gradient">{formData.titleLine3}</span>
                </h1>
                
                <button
                  onClick={() => focusInput("titleLine3")}
                  className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              {/* Description Preview */}
              <div className="relative group max-w-xl pr-8">
                <p className="text-lg md:text-md text-on-surface-variant leading-relaxed break-words">
                  {formData.description}
                </p>
                <button
                  onClick={() => focusInput("description")}
                  className="absolute top-0 -right-4 bg-[#6fffd9] text-[#003829] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
            </div>

            {/* Image Preview */}
            <div className="hidden lg:block relative group min-w-0">
              <div className="glass-card rounded-[2rem] p-4 border border-outline-variant shadow-2xl relative overflow-hidden">
                <img
                  alt="Hero Preview"
                  className="w-full h-[500px] object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity"
                  src={formData.imageUrl}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/800x500/1c2026/6fffd9?text=Invalid+Image+URL";
                  }}
                />
              </div>
              <button
                onClick={() => focusInput("imageUrl")}
                className="absolute top-8 right-8 bg-[#6fffd9] text-[#003829] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-20"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

