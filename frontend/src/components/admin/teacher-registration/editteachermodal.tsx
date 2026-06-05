import React, { useState, useEffect } from "react";

export interface EditTeacherFormData {
  firstname: string;
  lastname: string;
  email: string;
  qualification: string;
  isActive: boolean;
}

interface EditTeacherModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  initialData: EditTeacherFormData | null;
  onClose: () => void;
  onSave: (data: EditTeacherFormData) => void;
}

export default function EditTeacherModal({ isOpen, isLoading = false, initialData, onClose, onSave }: EditTeacherModalProps) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Pre-fill the form whenever the modal opens with new data
  useEffect(() => {
    if (isOpen && initialData) {
      setFirstname(initialData.firstname || "");
      setLastname(initialData.lastname || "");
      setEmail(initialData.email || "");
      setQualification(initialData.qualification || "");
      setIsActive(initialData.isActive);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstname, lastname, email, qualification, isActive });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* ── Background Overlay ── */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* ── Modal Box ── */}
      <div className="relative w-full max-w-lg bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b4a44] bg-[#262a31]/30">
          <h2 className="text-xl font-headline font-bold text-[#dfe2eb]">
            Edit Teacher Details
          </h2>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#b9cac3] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors focus:outline-none disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-body">
          
          {/* Name Row */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-semibold text-[#b9cac3]">First Name *</label>
              <input 
                required disabled={isLoading} type="text" 
                value={firstname} onChange={(e) => setFirstname(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-semibold text-[#b9cac3]">Last Name</label>
              <input 
                disabled={isLoading} type="text" 
                value={lastname} onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email Row */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#b9cac3]">Email Address *</label>
            <input 
              required disabled={isLoading} type="email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all disabled:opacity-50"
            />
          </div>

          {/* Qualification & Status Row */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
            <div className="flex-[2] space-y-1.5">
              <label className="text-sm font-semibold text-[#b9cac3]">Qualification</label>
              <input 
                disabled={isLoading} type="text" 
                value={qualification} onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. Ph.D. in Physics"
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-semibold text-[#b9cac3]">Account Status</label>
              <select 
                disabled={isLoading}
                value={isActive ? "true" : "false"} 
                onChange={(e) => setIsActive(e.target.value === "true")}
                className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all disabled:opacity-50 appearance-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-2 mt-2 flex items-center justify-end gap-3">
            <button
              type="button" onClick={onClose} disabled={isLoading}
              className="px-5 py-2.5 rounded-lg font-headline font-semibold text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg font-headline font-semibold flex items-center justify-center gap-2 transition-all ${
                isLoading ? "bg-[#6fffd9]/60 text-[#00382c]/60 cursor-not-allowed" : "bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] shadow-[0_0_15px_rgba(111,255,217,0.15)]"
              }`}
            >
              {isLoading ? (
                <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Updating...</>
              ) : "Update Teacher"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}