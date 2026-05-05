// import React from 'react';

// // --- Types ---
// interface CourseData {
//   title: string;
//   subtitle: string;
//   instructor: string;
//   lastUpdated: string;
//   language: string;
//   rating: number;
//   reviews: number;
//   students: number;
//   price: number;
//   originalPrice: number;
//   discount: string;
// }

// const CourseDetails: React.FC = () => {
//   const course: CourseData = {
//     title: "Data Analysis with Pandas and Python [2026]",
//     subtitle: "Analyze data quickly and easily with Python's powerful pandas library! All datasets included --- beginners welcome!",
//     instructor: "Boris Paskhaver",
//     lastUpdated: "4/2026",
//     language: "English",
//     rating: 4.7,
//     reviews: 26234,
//     students: 222698,
//     price: 619.00,
//     originalPrice: 4269.00,
//     discount: "86% off"
//   };

//   return (
//     <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb]">
//       {/* --- BANNER SECTION --- */}
//       <section className="bg-[#10141a] pt-8 pb-12 lg:pb-24 border-b border-[#3b4a44]">
//         <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-12 lg:gap-8">
//           <div className="lg:col-span-8">
//             {/* Breadcrumbs */}
//             <nav className="flex items-center gap-2 text-sm font-bold text-[#6fffd9] mb-6">
//               <span className="hover:underline cursor-pointer">Development</span>
//               <span className="material-symbols-outlined text-xs">chevron_right</span>
//               <span className="hover:underline cursor-pointer">Data Science</span>
//               <span className="material-symbols-outlined text-xs">chevron_right</span>
//               <span className="hover:underline cursor-pointer">Data Analysis</span>
//             </nav>

//             <h1 className="text-3xl lg:text-4xl font-black font-headline mb-4 leading-tight">
//               {course.title}
//             </h1>
//             <p className="text-lg lg:text-xl text-[#b9cac3] mb-6 max-w-3xl">
//               {course.subtitle}
//             </p>

//             <div className="flex flex-wrap items-center gap-4 mb-6">
//               <span className="bg-[#00e5bc] text-[#00382c] text-xs font-black px-2 py-1 rounded">
//                 Bestseller
//               </span>
//               <div className="flex items-center gap-1">
//                 <span className="text-[#6fffd9] font-bold">{course.rating}</span>
//                 <div className="flex text-yellow-400">
//                   {/* Dummy Stars */}
//                   {[...Array(5)].map((_, i) => (
//                     <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                   ))}
//                 </div>
//                 <span className="text-[#6fffd9] underline text-sm">({course.reviews.toLocaleString()} ratings)</span>
//               </div>
//               <span className="text-sm">{course.students.toLocaleString()} students</span>
//             </div>

//             <p className="text-sm mb-4">
//               Created by <span className="text-[#6fffd9] underline cursor-pointer">{course.instructor}</span>
//             </p>

//             <div className="flex items-center gap-6 text-sm">
//               <span className="flex items-center gap-1">
//                 <span className="material-symbols-outlined text-base">new_releases</span>
//                 Last updated {course.lastUpdated}
//               </span>
//               <span className="flex items-center gap-1">
//                 <span className="material-symbols-outlined text-base">language</span>
//                 {course.language}
//               </span>
//             </div>

//             {/* Premium Plan Highlight */}
//             <div className="mt-8 bg-[#1c2026] border border-[#3b4a44] rounded-lg overflow-hidden flex flex-col sm:flex-row items-stretch max-w-2xl">
//               <div className="bg-[#343d96] p-4 flex flex-col items-center justify-center min-w-[120px]">
//                  <span className="material-symbols-outlined text-[#bdc2ff] mb-1">verified</span>
//                  <span className="text-[#bdc2ff] font-black text-xs uppercase tracking-widest">Premium</span>
//               </div>
//               <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-4">
//                 <p className="text-sm font-medium">Access 28,000+ top-rated courses with Luminary Personal Plan.</p>
//                 <div className="text-center sm:text-right border-l border-[#3b4a44] pl-4">
//                    <p className="text-xl font-black leading-none">{course.rating}</p>
//                    <p className="text-[10px] text-[#84948e] underline">26,234 ratings</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- MAIN CONTENT & SIDEBAR GRID --- */}
//       <div className="max-w-7xl mx-auto px-4 relative">
//         <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
//           {/* Main Content Area */}
//           <main className="lg:col-span-8 py-12">
//             <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-6 lg:p-8 mb-12">
//               <h2 className="text-2xl font-black font-headline mb-6">What you'll learn</h2>
//               <div className="grid sm:grid-cols-2 gap-4">
//                 {[
//                   "Understand the structure and power of the pandas library",
//                   "Sorting and filtering data within Series and DataFrames",
//                   "Analyzing datasets with over 500,000 rows of data",
//                   "Strong knowledge of data types (strings, integers, etc.)"
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex gap-3 text-sm text-[#b9cac3]">
//                     <span className="material-symbols-outlined text-[#00e5bc] text-base">check</span>
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="prose prose-invert max-w-none">
//               <h2 className="text-2xl font-black font-headline text-[#dfe2eb]">Description</h2>
//               <p className="text-[#b9cac3]">** Newly recorded in 2026 for the release of Pandas 3 **</p>
//               <p className="text-[#b9cac3]">Student Testimonials:</p>
//               <ul className="list-disc pl-5 text-[#b9cac3] italic">
//                 <li>"The instructor knows the material, and has detailed explanation on every topic..." - Diana</li>
//                 <li>"This is excellent, and I cannot complement the instructor enough..." - Michael</li>
//               </ul>
//               <p className="text-[#b9cac3] mt-6">
//                 Welcome to the most comprehensive Pandas course available on Udemy! An excellent choice for both beginners and experts...
//               </p>
//             </div>
//           </main>

//           {/* --- STICKY SIDEBAR --- */}
//           <aside className="lg:col-span-4">
//             <div className="lg:sticky lg:top-8 bg-[#262a31] border border-[#3b4a44] rounded-xl shadow-2xl overflow-hidden -mt-24 lg:-mt-64 relative z-10">
              
//               {/* Video Preview Area */}
//               <div className="relative aspect-video group cursor-pointer">
//                 <img 
//                   src="https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=600" 
//                   alt="Course Preview" 
//                   className="w-full h-full object-cover opacity-50"
//                 />
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#10141a] group-hover:scale-110 transition-transform">
//                     <span className="material-symbols-outlined text-4xl">play_arrow</span>
//                   </div>
//                   <p className="mt-4 font-black text-sm">Preview this course</p>
//                 </div>
//               </div>

//               {/* Pricing & Options */}
//               <div className="p-6">
//                 {/* Subscription Option */}
//                 <label className="flex items-start gap-4 p-4 border-2 border-[#343d96] bg-[#1c2026] rounded-lg cursor-pointer mb-4">
//                   <div className="mt-1 w-5 h-5 rounded-full border-2 border-[#343d96] flex items-center justify-center bg-[#343d96]">
//                     <div className="w-2 h-2 rounded-full bg-white"></div>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-bold text-sm">Subscribe and save</p>
//                     <p className="text-xl font-black mt-1">From ₹450.00 <span className="text-sm font-normal text-[#84948e] line-through">₹500.00</span> <span className="text-sm font-normal">/month</span></p>
//                     <ul className="mt-3 space-y-2">
//                       <li className="flex items-center gap-2 text-xs text-[#b9cac3]">
//                         <span className="material-symbols-outlined text-sm">subscriptions</span> Access 28,000+ top courses
//                       </li>
//                       <li className="flex items-center gap-2 text-xs text-[#b9cac3]">
//                         <span className="material-symbols-outlined text-sm">event_repeat</span> Cancel anytime
//                       </li>
//                     </ul>
//                     <button className="w-full mt-6 bg-[#343d96] hover:bg-[#a8afff] hover:text-[#1b247f] text-white font-black py-3 rounded-lg transition-colors">
//                       Start subscription
//                     </button>
//                   </div>
//                 </label>

//                 {/* Individual Purchase Option */}
//                 <label className="flex items-center gap-4 p-4 border border-[#3b4a44] rounded-lg cursor-pointer mb-6 group hover:bg-[#181c22] transition-colors">
//                   <div className="w-5 h-5 rounded-full border-2 border-[#84948e]"></div>
//                   <div className="flex-1">
//                     <p className="font-bold text-sm">Buy individual course</p>
//                     <p className="text-lg font-black">₹{course.price} <span className="text-sm font-normal text-[#84948e] line-through">₹{course.originalPrice}</span></p>
//                     <p className="text-[10px] text-red-400 font-bold flex items-center gap-1">
//                       <span className="material-symbols-outlined text-xs">alarm</span> 3 days left at this price!
//                     </p>
//                   </div>
//                 </label>

//                 {/* Coupon Section */}
//                 <div className="pt-6 border-t border-[#3b4a44]">
//                    <div className="flex justify-between items-center mb-4">
//                       <button className="text-sm font-black underline underline-offset-4 decoration-[#84948e]">Apply Coupon</button>
//                       <div className="flex gap-2 text-[#84948e]">
//                          <span className="material-symbols-outlined cursor-pointer hover:text-[#6fffd9]">featured_seasonal_and_gifts</span>
//                          <span className="material-symbols-outlined cursor-pointer hover:text-[#6fffd9]">share</span>
//                       </div>
//                    </div>
//                    <div className="flex gap-2">
//                       <input 
//                         type="text" 
//                         placeholder="Enter Coupon" 
//                         className="bg-[#1c2026] border border-[#3b4a44] rounded px-3 py-2 text-sm flex-1 outline-none focus:border-[#6fffd9]"
//                       />
//                       <button className="bg-transparent border border-[#343d96] text-[#bdc2ff] px-4 py-2 rounded font-black text-sm hover:bg-[#343d96]">
//                         Apply
//                       </button>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           </aside>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

// import React, { useState } from 'react';

// // --- Types ---
// interface CourseData {
//   title: string;
//   subtitle: string;
//   instructor: string;
//   lastUpdated: string;
//   language: string;
//   rating: number;
//   reviews: number;
//   students: number;
//   price: number;
//   originalPrice: number;
// }

// const CourseDetails: React.FC = () => {
//   const [selectedPlan, setSelectedPlan] = useState<'sub' | 'buy'>('sub');

//   const course: CourseData = {
//     title: "Data Analysis with Pandas and Python [2026]",
//     subtitle: "Analyze data quickly and easily with Python's powerful pandas library! All datasets included --- beginners welcome!",
//     instructor: "Boris Paskhaver",
//     lastUpdated: "4/2026",
//     language: "English",
//     rating: 4.7,
//     reviews: 26234,
//     students: 222698,
//     price: 619,
//     originalPrice: 4269
//   };

//   return (
//     <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb]">
      
//       {/* --- HERO / BANNER SECTION --- */}
//       <section className="bg-[#10141a] pt-8 pb-8 md:pt-10 md:pb-20 lg:pt-12 lg:pb-28 border-b border-[#3b4a44]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="md:w-[55%] lg:w-2/3">
            
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline leading-tight mb-4 text-[#dfe2eb]">
//               {course.title}
//             </h1>
            
//             <p className="text-sm sm:text-base lg:text-lg text-[#b9cac3] mb-6 leading-relaxed">
//               {course.subtitle}
//             </p>

//             {/* Ratings & Stats Row */}
//             <div className="flex flex-wrap items-center gap-y-3 gap-x-4 mb-5 text-sm">
//               <span className="bg-[#00e5bc] text-[#00382c] text-[10px] sm:text-xs font-black px-2 py-1 rounded uppercase tracking-tighter">
//                 Bestseller
//               </span>
//               <div className="flex items-center gap-1">
//                 <span className="text-[#6fffd9] font-bold">{course.rating}</span>
//                 <div className="flex text-[#00e5bc]">
//                   {[...Array(5)].map((_, i) => (
//                     <span key={i} className="material-symbols-outlined text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                   ))}
//                 </div>
//               </div>
//               <span className="text-[#6fffd9] underline cursor-pointer hover:text-[#00e5bc] transition-colors">
//                 ({course.reviews.toLocaleString()} ratings)
//               </span>
//               <span className="text-[#dfe2eb]">{course.students.toLocaleString()} students</span>
//             </div>

//             {/* Metadata Row */}
//             <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#b9cac3]">
//               <p>Created by <span className="text-[#6fffd9] underline cursor-pointer hover:text-[#00e5bc] transition-colors">{course.instructor}</span></p>
//               <span className="flex items-center gap-1">
//                 <span className="material-symbols-outlined text-base">new_releases</span> {course.lastUpdated}
//               </span>
//               <span className="flex items-center gap-1">
//                 <span className="material-symbols-outlined text-base">language</span> {course.language}
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- MAIN LAYOUT --- */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
//         <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start relative">
          
//           {/* --- LEFT COLUMN / BOTTOM CONTENT --- */}
//           <main className="flex-1 min-w-0 order-2 md:order-1 w-full">
            
//             {/* What you'll learn */}
//             <div className="border border-[#3b4a44] bg-[#1c2026] rounded-xl p-5 sm:p-6 lg:p-8 mb-8 md:mb-10">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-headline text-[#dfe2eb] mb-5 sm:mb-6">What you'll learn</h2>
//               <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
//                 {[
//                   "Master Pandas for complex Data Analysis",
//                   "Handle massive datasets with 500k+ rows",
//                   "Visualization techniques with Matplotlib",
//                   "Cleaning and preparing real-world data",
//                   "Building advanced pivot tables and merges",
//                   "Extracting value from messy datasets"
//                 ].map((text, i) => (
//                   <div key={i} className="flex gap-3 text-sm text-[#b9cac3]">
//                     <span className="material-symbols-outlined text-[#00e5bc] flex-shrink-0">check</span>
//                     <span className="leading-snug">{text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Description Section */}
//             <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-headline text-[#dfe2eb] mb-4">Description</h2>
//               <div className="space-y-4">
//                 <p className="font-bold text-[#dfe2eb]">** Newly recorded in 2026 for the release of Pandas 3 **</p>
//                 <p>Welcome to the most comprehensive Pandas course available. We start from absolute zero and build your skills until you're performing professional-grade data analysis.</p>
                
//                 <h3 className="text-base sm:text-lg font-bold text-[#dfe2eb] mt-6 mb-3">Student Testimonials:</h3>
//                 <div className="border-l-2 border-[#343d96] pl-4 italic bg-[#181c22] p-4 rounded-r-lg mb-4 text-sm sm:text-base">
//                   "This is excellent, and I cannot complement the instructor enough. Extremely clear, relevant, and high quality." — Michael
//                 </div>
//                 <div className="border-l-2 border-[#343d96] pl-4 italic bg-[#181c22] p-4 rounded-r-lg text-sm sm:text-base">
//                   "The instructor knows the material, and has detailed explanation on every topic he discusses. Highly recommend." — Diana
//                 </div>

//                 <p className="mt-8">This course offers 19+ hours of in-depth video tutorials on the most powerful data analysis toolkit available today. You will learn everything you need to know about:</p>
//                 <ul className="list-disc pl-5 mt-2 space-y-2">
//                   <li>Installing and setting up Python environments</li>
//                   <li>Sorting and filtering complex DataFrames</li>
//                   <li>Grouping data for advanced aggregation metrics</li>
//                 </ul>
//                 <p className="mt-8 pb-12">See you inside the course!</p>
//               </div>
//             </div>
//           </main>

//           {/* --- RIGHT COLUMN (Sticky Purchase Card) --- */}
//           {/* THE FIX: md:sticky and negative margins are applied directly to the <aside> tag so it correctly tracks the flex container */}
//           <aside className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-6 lg:top-8 md:-mt-[180px] lg:-mt-[280px]">
            
//             {/* Inner styling container */}
//             <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl p-5 lg:p-8">
              
//               <div className="space-y-4">
//                 {/* Option 1: Subscribe and Save */}
//                 <div 
//                   onClick={() => setSelectedPlan('sub')}
//                   className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
//                     selectedPlan === 'sub' 
//                       ? 'border-[#343d96] bg-[#181c22]' 
//                       : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
//                   }`}
//                 >
//                   <div className="flex items-start gap-3 sm:gap-4">
//                     <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
//                       selectedPlan === 'sub' ? 'border-[#343d96]' : 'border-[#84948e]'
//                     }`}>
//                       {selectedPlan === 'sub' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
//                     </div>
                    
//                     <div className="flex-1">
//                       <p className="font-bold text-[#dfe2eb] text-sm sm:text-base">Subscribe and save</p>
//                       <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
//                         From ₹450.00 <span className="text-xs sm:text-sm font-normal text-[#84948e] line-through ml-1">₹500.00</span>
//                       </p>
//                       <ul className="mt-3 lg:mt-4 space-y-2 lg:space-y-3 text-xs sm:text-sm text-[#b9cac3]">
//                         <li className="flex items-start sm:items-center gap-2 sm:gap-3">
//                           <span className="material-symbols-outlined text-[14px] sm:text-base mt-0.5 sm:mt-0">verified_user</span> 
//                           28,000+ top courses included
//                         </li>
//                         <li className="flex items-start sm:items-center gap-2 sm:gap-3">
//                           <span className="material-symbols-outlined text-[14px] sm:text-base mt-0.5 sm:mt-0">sync</span> 
//                           Cancel anytime
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Option 2: Buy Individual Course */}
//                 <div 
//                   onClick={() => setSelectedPlan('buy')}
//                   className={`p-4 lg:p-5 border rounded-xl cursor-pointer transition-all duration-300 ${
//                     selectedPlan === 'buy' 
//                       ? 'border-[#343d96] bg-[#181c22]' 
//                       : 'border-[#3b4a44] bg-[#1c2026] hover:bg-[#181c22]'
//                   }`}
//                 >
//                   <div className="flex items-start gap-3 sm:gap-4">
//                     <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
//                       selectedPlan === 'buy' ? 'border-[#343d96]' : 'border-[#84948e]'
//                     }`}>
//                       {selectedPlan === 'buy' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
//                     </div>
                    
//                     <div className="flex-1">
//                       <p className="font-bold text-[#dfe2eb] text-sm sm:text-base">Buy individual course</p>
//                       <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
//                         ₹{course.price} <span className="text-xs sm:text-sm font-normal text-[#84948e] line-through ml-1">₹{course.originalPrice}</span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <button className="w-full mt-6 bg-[#343d96] hover:bg-[#bdc2ff] hover:text-[#1b247f] text-white font-black py-3.5 lg:py-4 rounded-lg transition-colors shadow-lg text-base lg:text-lg">
//                 {selectedPlan === 'sub' ? 'Start Free Trial' : 'Buy Now'}
//               </button>
              
//               <p className="text-center text-[10px] sm:text-xs text-[#84948e] mt-4">30-Day Money-Back Guarantee</p>
//             </div>
//           </aside>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetails

import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Course } from '../../types/courses';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ExpandableDescription } from '../ui/expandabledescription';

// --- GraphQL Query ---
// Note: Adjust the query name ('courseGetById') if your backend uses a different name for fetching a single course!
const GET_COURSE_DETAILS = gql`
  query getCourseInfo($courseID : String!) {
    getCourseInfo(courseID : $courseID ) {
      success
      message
      data {
        id
        title
        description
        instructorName
        duration
        level
        price
        icon
      }
    }
  }
`;

interface GetCourseResponse {
  getCourseInfo: {
    success: boolean;
    message: string;
    data: Course;
  };
}

const CourseDetails: React.FC = () => {
  // 1. Grab the course ID from the URL (e.g., /course/12345)
  const { courseID } = useParams<{ courseID : string }>();

  const [selectedPlan, setSelectedPlan] = useState<'sub' | 'buy'>('sub');

  // 2. Fetch the course data from the backend
  const { data, loading, error } = useQuery<GetCourseResponse>(GET_COURSE_DETAILS, {
    variables: {courseID  },
    skip: !courseID , // Don't run the query if there's no ID in the URL
  });

  const course = data?.getCourseInfo?.data;

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold">
        Loading Course Details...
      </div>
    );
  }

  // --- Error / Not Found State ---
  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#10141a] flex flex-col items-center justify-center text-[#dfe2eb]">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-[#84948e] mb-6">{error?.message || "This course doesn't exist or was removed."}</p>
        <Link to="/" className="bg-[#343d96] text-white px-6 py-2 rounded font-bold hover:bg-[#bdc2ff] hover:text-[#1b247f] transition-colors">
          Back to Courses
        </Link>
      </div>
    );
  }

  // --- Success State (Mapped to your Course interface) ---
  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb]">
      
      {/* --- HERO / BANNER SECTION --- */}
      <section className="bg-[#10141a] pt-8 pb-8 md:pt-10 md:pb-20 lg:pt-12 lg:pb-28 border-b border-[#3b4a44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-[55%] lg:w-2/3">
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline leading-tight mb-4 text-[#dfe2eb]">
              {course.title}
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-[#b9cac3] mb-6 leading-relaxed line-clamp-3">
              {course.description}
            </p>

            {/* Essential Tags Row (Mapped from DB) */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-4 mb-5 text-sm">
              <span className="bg-[#31353c] text-[#dfe2eb] text-[10px] sm:text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest border border-[#3b4a44]">
                {course.level}
              </span>
              <span className="flex items-center gap-1 text-[#84948e]">
                <span className="material-symbols-outlined text-base">schedule</span> 
                {course.duration}
              </span>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#b9cac3]">
              <p>Created by <span className="text-[#6fffd9] underline font-bold cursor-pointer hover:text-[#00e5bc] transition-colors">{course.instructorName}</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start relative">
          
          {/* --- LEFT COLUMN / BOTTOM CONTENT --- */}
          <main className="flex-1 min-w-0 order-2 md:order-1 w-full">
            
            {/* Description Section */}
            <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed bg-[#1c2026] border border-[#3b4a44] p-6 lg:p-8 rounded-xl">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-headline text-[#dfe2eb] mb-4">About This Course</h2>
                {/* Wrap the content in our new component! */}
              <ExpandableDescription>
                <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap pb-4">
                  {course.description}
                </div>
              </ExpandableDescription>
            </div>
          </main>

          {/* --- RIGHT COLUMN (Sticky Purchase Card) --- */}
          <aside className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0 order-1 md:order-2 z-10 md:sticky md:top-6 lg:top-8 md:-mt-[180px] lg:-mt-[280px]">
            
            {/* Inner styling container */}
            <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-2xl p-5 lg:p-8">
              
              {/* Image Thumbnail fetched from DB */}
              <div className="w-full h-40 sm:h-48 mb-6 rounded-lg overflow-hidden border border-[#3b4a44]">
                <img 
                  src={course.icon} 
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
                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedPlan === 'sub' ? 'border-[#343d96]' : 'border-[#84948e]'
                    }`}>
                      {selectedPlan === 'sub' && <div className="w-2.5 h-2.5 rounded-full bg-[#343d96]"></div>}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-[#dfe2eb] text-sm sm:text-base">Subscribe and save</p>
                      <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
                        From ₹450.00
                      </p>
                      <ul className="mt-3 lg:mt-4 space-y-2 lg:space-y-3 text-xs sm:text-sm text-[#b9cac3]">
                        <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                          <span className="material-symbols-outlined text-[14px] sm:text-base mt-0.5 sm:mt-0">verified_user</span> 
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
                      <p className="font-bold text-[#dfe2eb] text-sm sm:text-base">Buy individual course</p>
                      <p className="text-xl sm:text-2xl font-black text-[#dfe2eb] mt-1 font-headline">
                        ₹{course.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full mt-6 bg-[#343d96] hover:bg-[#bdc2ff] hover:text-[#1b247f] text-white font-black py-3.5 lg:py-4 rounded-lg transition-colors shadow-lg text-base lg:text-lg">
                {selectedPlan === 'sub' ? 'Start Free Trial' : 'Enroll Now'}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;