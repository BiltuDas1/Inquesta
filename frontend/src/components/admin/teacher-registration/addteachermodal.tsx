// import React, { useState, useEffect } from "react";

// export interface TeacherFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// interface AddTeacherModalProps {
//   isOpen: boolean;
//   isLoading?: boolean; // 1. Added isLoading prop
//   onClose: () => void;
//   onAdd: (data: TeacherFormData) => void;
// }

// export default function AddTeacherModal({ isOpen, isLoading = false, onClose, onAdd }: AddTeacherModalProps) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");

//   // Clear form fields whenever the modal is opened
//   useEffect(() => {
//     if (isOpen) {
//       setFirstName("");
//       setLastName("");
//       setEmail("");
//     }
//   }, [isOpen]);

//   // Prevent rendering if not open
//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAdd({ firstName, lastName, email });
//     // 2. Removed onClose() here! The parent handles closing it when the API succeeds.
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
//       {/* ── Background Overlay ── */}
//       <div 
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
//         onClick={!isLoading ? onClose : undefined} // Prevent clicking backdrop while loading
//       />
      
//       {/* ── Modal Box ── */}
//       <div className="relative w-full max-w-md bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b4a44] bg-[#262a31]/30">
//           <h2 className="text-xl font-headline font-bold text-[#dfe2eb]">
//             Add New Teacher
//           </h2>
//           <button 
//             onClick={onClose}
//             disabled={isLoading}
//             className="w-8 h-8 flex items-center justify-center rounded-full text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors focus:outline-none disabled:opacity-50"
//             title="Close"
//           >
//             <span className="material-symbols-outlined text-[20px]">close</span>
//           </button>
//         </div>

//         {/* Form Content */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5 font-body">
          
//           {/* Name Row */}
//           <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
//             <div className="flex-1 space-y-1.5">
//               <label htmlFor="firstName" className="text-sm font-semibold text-[#b9cac3]">
//                 First Name <span className="text-[#ffb4ab]">*</span>
//               </label>
//               <input 
//                 id="firstName"
//                 required
//                 disabled={isLoading}
//                 type="text" 
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
//                 placeholder="e.g. Eleanor"
//               />
//             </div>

//             <div className="flex-1 space-y-1.5">
//               <label htmlFor="lastName" className="text-sm font-semibold text-[#b9cac3]">
//                 Last Name <span className="text-[#ffb4ab]">*</span>
//               </label>
//               <input 
//                 id="lastName"
//                 disabled={isLoading}
//                 type="text" 
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
//                 placeholder="e.g. Vance"
//               />
//             </div>
//           </div>

//           {/* Email Field */}
//           <div className="space-y-1.5">
//             <label htmlFor="email" className="text-sm font-semibold text-[#b9cac3]">
//               Email Address <span className="text-[#ffb4ab]">*</span>
//             </label>
//             <input 
//               id="email"
//               required
//               disabled={isLoading}
//               type="email" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
//               placeholder="e.g. eleanor.v@luminary.edu"
//             />
//           </div>

//           {/* Actions Footer */}
//           <div className="pt-2 mt-2 flex items-center justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="px-5 py-2.5 rounded-lg font-headline font-semibold text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors focus:outline-none disabled:opacity-50"
//             >
//               Cancel
//             </button>
            
//             {/* 3. Updated Save Button with Loading State */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`px-5 py-2.5 rounded-lg font-headline font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#1c2026] ${
//                 isLoading 
//                   ? "bg-[#6fffd9]/60 text-[#00382c]/60 cursor-not-allowed" 
//                   : "bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] shadow-[0_0_15px_rgba(111,255,217,0.15)]"
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="material-symbols-outlined animate-spin text-[18px]">
//                     progress_activity
//                   </span>
//                   Saving...
//                 </>
//               ) : (
//                 "Save Teacher"
//               )}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface AddTeacherModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  generatedLink?: string | null;
  onClose: () => void;
  onAdd: (data: TeacherFormData) => void;
}

export default function AddTeacherModal({ isOpen, isLoading = false, generatedLink, onClose, onAdd }: AddTeacherModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Clear form fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ firstName, lastName, email });
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        style: { background: '#1c2026', color: '#dfe2eb', border: '1px solid #3b4a44' },
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* ── Background Overlay ── */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading && !generatedLink ? onClose : undefined} 
      />
      
      {/* ── Modal Box ── */}
      <div className="relative w-full max-w-md bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Conditional Rendering: Success Screen vs Entry Form */}
        {generatedLink ? (
          
          /* ── SUCCESS SCREEN ── */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#00e5bc]/10 rounded-full flex items-center justify-center text-[#6fffd9] mb-4 shadow-[0_0_20px_rgba(111,255,217,0.15)]">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            
            <h2 className="text-xl font-headline font-bold text-[#dfe2eb] mb-2">
              Invitation Ready!
            </h2>
            <p className="text-sm text-[#84948e] mb-6">
              Share this secure invitation link with {firstName} so they can set up their profile.
            </p>

            <div className="w-full flex items-center gap-2 bg-[#10141a] border border-[#3b4a44] p-1.5 rounded-lg mb-6">
              <input 
                readOnly 
                value={generatedLink} 
                className="w-full bg-transparent border-none text-[#dfe2eb] text-sm focus:outline-none px-3 font-mono truncate"
              />
              <button 
                onClick={handleCopy}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  copied 
                    ? "bg-[#6fffd9] text-[#00382c]" 
                    : "bg-[#262a31] hover:bg-[#3b4a44] text-[#dfe2eb]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full px-5 py-2.5 rounded-lg font-headline font-semibold bg-[#262a31] hover:bg-[#3b4a44] text-[#dfe2eb] transition-colors focus:outline-none"
            >
              Done
            </button>
          </div>

        ) : (

          /* ── ORIGINAL FORM ── */
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b4a44] bg-[#262a31]/30">
              <h2 className="text-xl font-headline font-bold text-[#dfe2eb]">
                Add New Teacher
              </h2>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors focus:outline-none disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 font-body">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="firstName" className="text-sm font-semibold text-[#b9cac3]">
                    First Name <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input 
                    id="firstName"
                    required
                    disabled={isLoading}
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label htmlFor="lastName" className="text-sm font-semibold text-[#b9cac3]">
                    Last Name <span className="text-[#ffb4ab]">*</span>
                  </label>
                  <input 
                    id="lastName"
                    required
                    disabled={isLoading}
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-[#b9cac3]">
                  Email Address <span className="text-[#ffb4ab]">*</span>
                </label>
                <input 
                  id="email"
                  required
                  disabled={isLoading}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e] disabled:opacity-50"
                />
              </div>

              <div className="pt-2 mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg font-headline font-semibold text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors focus:outline-none disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 py-2.5 rounded-lg font-headline font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#1c2026] ${
                    isLoading 
                      ? "bg-[#6fffd9]/60 text-[#00382c]/60 cursor-not-allowed" 
                      : "bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] shadow-[0_0_15px_rgba(111,255,217,0.15)]"
                  }`}
                >
                  {isLoading ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Saving...</>
                  ) : "Save Teacher"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}