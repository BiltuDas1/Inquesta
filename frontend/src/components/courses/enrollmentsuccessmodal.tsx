import React from "react";
import { useNavigate } from "react-router";

interface EnrollmentSuccessProps {
  onClose: () => void;
  courseTitle: string;
}

export const EnrollmentSuccess: React.FC<EnrollmentSuccessProps> = ({ onClose, courseTitle }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
      {/* Animated Icon Container */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-[#6fffd9] blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-full h-full bg-[#1c2026] border-2 border-[#6fffd9]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(111,255,217,0.15)]">
          <span className="material-symbols-outlined text-[#6fffd9] text-5xl animate-bounce">
            verified
          </span>
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-[1.5rem] font-black text-[#dfe2eb] mb-3 font-headline leading-tight">
        Payment Submitted!
      </h3>
      
      <p className="text-[#b9cac3] text-sm mb-2 px-4">
        We've received your transaction details for:
      </p>
      <p className="text-[#6fffd9] font-bold text-base mb-6 px-4 italic">
        "{courseTitle}"
      </p>

      <div className="bg-[#10141a]/50 border border-[#3b4a44] rounded-xl p-4 mb-8 mx-2 text-left">
        <div className="flex gap-3 items-start">
          <span className="material-symbols-outlined text-[#ffb4ab] text-xl">info</span>
          <p className="text-[#84948e] text-[0.8rem] leading-relaxed">
            Our team is verifying your UTR ID. Your course will be activated automatically within 
            <span className="text-[#dfe2eb] font-bold"> 2 to 4 hours</span>.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => {
            onClose();
            navigate("/courses");
          }} 
          className="w-full bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-black py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(111,255,217,0.2)] active:scale-95"
        >
          Go to My Dashboard
        </button>
        
        <button 
          onClick={onClose}
          className="text-[#84948e] text-xs font-bold uppercase tracking-widest hover:text-[#dfe2eb] transition-colors py-2"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};