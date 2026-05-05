import React, { useState } from 'react';
import type { Course } from '../../types/courses';

interface PurchaseCardProps {
  course: Course;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
  // State for toggling between Subscription and Individual Purchase
  const [selectedPlan, setSelectedPlan] = useState<'sub' | 'buy'>('buy');

  const handleEnroll = () => {
    console.log(`Enrolling via: ${selectedPlan}`);
    // Add your checkout or enrollment logic here
  };

  return (
    <aside className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-24 lg:top-28 md:-mt-[180px] lg:-mt-[280px]">
      {/* Inner styling container - Surface Container Color */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl p-5 lg:p-8 font-body">
        
        {/* Course Thumbnail with Fallback */}
        <div className="w-full h-40 sm:h-48 mb-6 rounded-lg overflow-hidden border border-[#3b4a44] bg-[#181c22]">
          <img 
              src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
            alt={course.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600";
            }}
          />
        </div>

        <div className="space-y-4">
          {/* Option 1: Subscribe and Save */}
          <div 
            onClick={() => setSelectedPlan('sub')}
            className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
              selectedPlan === 'sub' 
                ? 'border-[#343d96] bg-[#181c22]' 
                : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Custom Radio Button */}
              <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'sub' ? 'border-[#343d96]' : 'border-[#84948e]'
              }`}>
                {selectedPlan === 'sub' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-[#dfe2eb] text-sm sm:text-base font-headline">Subscribe and save</p>
                <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
                  From ₹450.00
                </p>
                <ul className="mt-3 lg:mt-4 space-y-2 lg:space-y-3 text-xs sm:text-sm text-[#b9cac3]">
                  <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                    <span className="material-symbols-outlined text-[14px] sm:text-base mt-0.5 sm:mt-0 text-[#6fffd9]">verified_user</span> 
                    Full Platform Access
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Option 2: Buy Individual Course */}
          <div 
            onClick={() => setSelectedPlan('buy')}
            className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
              selectedPlan === 'buy' 
                ? 'border-[#343d96] bg-[#181c22]' 
                : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPlan === 'buy' ? 'border-[#343d96]' : 'border-[#84948e]'
              }`}>
                {selectedPlan === 'buy' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-[#dfe2eb] text-sm sm:text-base font-headline">Buy individual course</p>
                <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
                  ₹{course.price}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Secondary Container Color */}
        <button 
          onClick={handleEnroll}
          className="w-full mt-6 bg-[#343d96] hover:bg-[#bdc2ff] hover:text-[#1b247f] text-[#dfe2eb] font-black py-3.5 rounded-lg transition-all shadow-lg text-base lg:text-lg font-headline active:scale-[0.98]"
        >
          {selectedPlan === 'sub' ? 'Start Free Trial' : 'Enroll Now'}
        </button>

        <p className="text-center text-[10px] text-[#84948e] mt-4 uppercase tracking-widest font-headline">
          30-Day Money-Back Guarantee
        </p>
      </div>
    </aside>
  );
};