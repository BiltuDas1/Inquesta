// // import React, { useState } from 'react';
// // import type { Course } from '../../types/courses';

// // interface PurchaseCardProps {
// //   course: Course;
// // }

// // export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
// //   // State for toggling between Subscription and Individual Purchase
// //   const [selectedPlan, setSelectedPlan] = useState<'sub' | 'buy'>('buy');

// //   const handleEnroll = () => {
// //     console.log(`Enrolling via: ${selectedPlan}`);
// //     // Add your checkout or enrollment logic here
// //   };

// //   return (
// //     <aside className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-24 lg:top-28 md:-mt-[180px] lg:-mt-[280px]">
// //       {/* Inner styling container - Surface Container Color */}
// //       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl p-5 lg:p-8 font-body">

// //         {/* Course Thumbnail with Fallback */}
// //         <div className="w-full h-40 sm:h-48 mb-6 rounded-lg overflow-hidden border border-[#3b4a44] bg-[#181c22]">
// //           <img
// //               src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
// //             alt={course.title}
// //             className="w-full h-full object-cover"
// //             onError={(e) => {
// //               e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600";
// //             }}
// //           />
// //         </div>

// //         <div className="space-y-4">
// //           {/* Option 1: Subscribe and Save */}
// //           {/* <div
// //             onClick={() => setSelectedPlan('sub')}
// //             className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
// //               selectedPlan === 'sub'
// //                 ? 'border-[#343d96] bg-[#181c22]'
// //                 : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
// //             }`}
// //           >
// //             <div className="flex items-start gap-3 sm:gap-4">

// //               <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
// //                 selectedPlan === 'sub' ? 'border-[#343d96]' : 'border-[#84948e]'
// //               }`}>
// //                 {selectedPlan === 'sub' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
// //               </div>

// //               <div className="flex-1">
// //                 <p className="font-bold text-[#dfe2eb] text-sm sm:text-base font-headline">Subscribe and save</p>
// //                 <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
// //                   From ₹450.00
// //                 </p>
// //                 <ul className="mt-3 lg:mt-4 space-y-2 lg:space-y-3 text-xs sm:text-sm text-[#b9cac3]">
// //                   <li className="flex items-start sm:items-center gap-2 sm:gap-3">
// //                     <span className="material-symbols-outlined text-[14px] sm:text-base mt-0.5 sm:mt-0 text-[#6fffd9]">verified_user</span>
// //                     Full Platform Access
// //                   </li>
// //                 </ul>
// //               </div>
// //             </div>
// //           </div> */}

// //           {/* Option 2: Buy Individual Course */}
// //           <div
// //             onClick={() => setSelectedPlan('buy')}
// //             className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
// //               selectedPlan === 'buy'
// //                 ? 'border-[#343d96] bg-[#181c22]'
// //                 : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
// //             }`}
// //           >
// //             <div className="flex items-start gap-3 sm:gap-4">
// //               <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
// //                 selectedPlan === 'buy' ? 'border-[#343d96]' : 'border-[#84948e]'
// //               }`}>
// //                 {selectedPlan === 'buy' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
// //               </div>

// //               <div className="flex-1">
// //                 <p className="font-bold text-[#dfe2eb] text-sm sm:text-base font-headline">Buy individual course</p>
// //                 <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
// //                   ₹{course.price}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* CTA Button - Secondary Container Color */}
// //         <button
// //           onClick={handleEnroll}
// //           className="w-full mt-6 bg-[#343d96] hover:bg-[#bdc2ff] hover:text-[#1b247f] text-[#dfe2eb] font-black py-3.5 rounded-lg transition-all shadow-lg text-base lg:text-lg font-headline active:scale-[0.98]"
// //         >
// //           {selectedPlan === 'sub' ? 'Start Free Trial' : 'Enroll Now'}
// //         </button>

// //         <p className="text-center text-[10px] text-[#84948e] mt-4 uppercase tracking-widest font-headline">
// //           30-Day Money-Back Guarantee
// //         </p>
// //       </div>
// //     </aside>
// //   );
// // };

// import React from 'react';
// import type { Course } from '../../types/courses';

// interface PurchaseCardProps {
//   course: Course;
// }

// export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
//   const handleEnroll = () => {
//     console.log(`Enrolling in: ${course.title}`);
//     // Add your checkout or enrollment logic here
//   };

//   return (
//     <aside className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-24 lg:top-28 md:-mt-[180px] lg:-mt-[280px]">
//       <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl p-5 font-body">

//         {/* Course Image - Scaled down height for a more compact card */}
//         <div className="w-full h-40 mb-5 rounded-xl overflow-hidden border border-[#2a342f] bg-[#181c22]">
//           <img
//             src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
//             alt={course.title}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600";
//             }}
//           />
//         </div>

//         {/* Clean Price Display - Scaled down text to match new card size */}
//         <div className="mb-5 px-1">
//           <p className="text-[#84948e] text-sm font-headline font-semibold mb-1">Buy individual course</p>
//           <div className="flex items-baseline gap-1">
//             <span className="text-xl font-bold text-[#6fffd9]">₹</span>
//             <span className="text-3xl font-black text-[#dfe2eb] tracking-tight">{course.price}</span>
//           </div>
//         </div>

//         {/* Beautiful Enroll Button - Slightly shorter padding to match */}
//         <button
//           onClick={handleEnroll}
//           className="w-full bg-gradient-to-r from-[#343d96] to-[#4a55c2] hover:from-[#4a55c2] hover:to-[#5c68d6] text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-base font-headline active:scale-[0.98]"
//         >
//           Enroll Now
//         </button>

//       </div>
//     </aside>
//   );
// };

import React, { useState } from "react";
import type { Course } from "../../types/courses";

interface PurchaseCardProps {
  course: Course;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ course }) => {
  // State for the modal and the transaction input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const handleEnroll = () => {
    setIsModalOpen(true);
  };

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      alert("Please enter a valid Transaction / UTR ID.");
      return;
    }

    console.log(
      `Verifying payment for: ${course.title} | ID: ${transactionId}`,
    );
    // Add your actual backend API call here to save the enrollment request

    alert(
      "Payment details submitted successfully! We will verify and activate your course.",
    );
    setIsModalOpen(false);
    setTransactionId(""); // Reset the input
  };

  return (
    <>
      <aside className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-24 lg:top-28 md:-mt-[180px] lg:-mt-[280px]">
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl p-5 font-body relative">
          {/* Course Image */}
          <div className="w-full h-40 mb-5 rounded-xl overflow-hidden border border-[#2a342f] bg-[#181c22]">
            <img
              src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600";
              }}
            />
          </div>

          {/* Clean Price Display */}
          <div className="mb-5 px-1">
            <p className="text-[#84948e] text-sm font-headline font-semibold mb-1">
              Buy individual course
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#6fffd9]">₹</span>
              <span className="text-3xl font-black text-[#dfe2eb] tracking-tight">
                {course.price}
              </span>
            </div>
          </div>

          {/* Enroll Button */}
          <button
            onClick={handleEnroll}
            className="w-full bg-gradient-to-r from-[#343d96] to-[#4a55c2] hover:from-[#4a55c2] hover:to-[#5c68d6] text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-base font-headline active:scale-[0.98]"
          >
            Enroll Now
          </button>
        </div>
      </aside>

      {/* --- PAYMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-body">
          {/* Dark Blur Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 z-10 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#84948e] hover:text-[#ffb4ab] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-[#dfe2eb] mb-1 font-headline">
              Complete Payment
            </h3>
            <p className="text-[#b9cac3] text-sm mb-6">
              Scan the QR code to pay{" "}
              <span className="text-[#6fffd9] font-bold">₹{course.price}</span>
            </p>

            {/* QR Code Scanner Area */}
            <div className="bg-white p-3 rounded-xl flex items-center justify-center mx-auto mb-6 w-48 h-48 border-4 border-[#3b4a44] shadow-inner">
              {/* NOTE: Replace 'your_upi_id@bank' with your actual UPI ID below to generate a real working QR code */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your_upi_id@bank&pn=Inquesta&am=${course.price}&cu=INR`}
                alt="Payment QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Transaction ID Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#84948e] uppercase tracking-wider mb-2">
                Transaction / UTR ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 312345678901"
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-xl px-4 py-3 text-[#dfe2eb] text-sm focus:outline-none focus:border-[#6fffd9] transition-colors placeholder:text-[#3b4a44]"
              />
            </div>

            {/* Submit Payment Button */}
            <button
              onClick={handleSubmitPayment}
              className="w-full bg-[#6fffd9] hover:bg-[#5cebc5] text-[#00382c] font-black py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(111,255,217,0.2)] text-base font-headline active:scale-[0.98]"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      )}
    </>
  );
};
