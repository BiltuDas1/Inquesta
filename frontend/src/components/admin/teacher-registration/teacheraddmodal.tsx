import React, { useState, useEffect } from "react";

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: TeacherFormData) => void;
}

export default function AddTeacherModal({ isOpen, onClose, onAdd }: AddTeacherModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Clear form fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [isOpen]);

  // Prevent rendering if not open
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ firstName, lastName, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* ── Background Overlay ── */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* ── Modal Box ── */}
      <div className="relative w-full max-w-md bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b4a44] bg-[#262a31]/30">
          <h2 className="text-xl font-headline font-bold text-[#dfe2eb]">
            Add New Teacher
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors focus:outline-none"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-body">
          
          {/* Name Row (Stacks on mobile, side-by-side on sm screens) */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
            <div className="flex-1 space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-semibold text-[#b9cac3]">
                First Name <span className="text-[#ffb4ab]">*</span>
              </label>
              <input 
                id="firstName"
                required
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e]"
                placeholder="e.g. Eleanor"
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-semibold text-[#b9cac3]">
                Last Name <span className="text-[#ffb4ab]">*</span>
              </label>
              <input 
                id="lastName"
                required
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e]"
                placeholder="e.g. Vance"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#b9cac3]">
              Email Address <span className="text-[#ffb4ab]">*</span>
            </label>
            <input 
              id="email"
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all placeholder:text-[#84948e]"
              placeholder="e.g. eleanor.v@luminary.edu"
            />
          </div>

          {/* Actions Footer */}
          <div className="pt-2 mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-headline font-semibold text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-headline font-semibold bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] transition-colors shadow-[0_0_15px_rgba(111,255,217,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#1c2026]"
            >
              Save Teacher
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}