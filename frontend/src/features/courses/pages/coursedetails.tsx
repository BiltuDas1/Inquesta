// import { Link, useParams } from "react-router";

// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import type { Course } from "../types/courses";
// import { ExpandableDescription } from "../../../shared/components/expandabledescription";
// import { PurchaseCard } from "../components/purchascard";

// // --- GraphQL Query ---
// // Note: Adjust the query name ('courseGetById') if your backend uses a different name for fetching a single course!
// const GET_COURSE_DETAILS = gql`
//   query getCourseInfo($slug: String!) {
//     getCourseInfo(slug: $slug) {
//       success
//       message
//       data {
//         id
//         title
//         description
//         instructorName
//         duration
//         level
//         price
//         icon
//         slug
//       }
//     }
//   }
// `;

// interface GetCourseResponse {
//   getCourseInfo: {
//     success: boolean;
//     message: string;
//     data: Course;
//   };
// }

// const CourseDetails: React.FC = () => {
//   // CHANGE 2: Grab 'slug' from the URL
//   const { slug } = useParams<{ slug: string }>();

//   // 2. Fetch the course data from the backend
//   const { data, loading, error } = useQuery<GetCourseResponse>(
//     GET_COURSE_DETAILS,
//     {
//       variables: { slug },
//       skip: !slug, // Don't run the query if there's no ID in the URL
//     },
//   );

//   const course = data?.getCourseInfo?.data;

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold">
//         Loading Course Details...
//       </div>
//     );
//   }

//   // --- Error / Not Found State ---
//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-[#10141a] flex flex-col items-center justify-center text-[#dfe2eb]">
//         <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
//           error
//         </span>
//         <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
//         <p className="text-[#84948e] mb-6">
//           {error?.message || "This course doesn't exist or was removed."}
//         </p>
//         <Link
//           to="/"
//           className="bg-[#343d96] text-white px-6 py-2 rounded font-bold hover:bg-[#bdc2ff] hover:text-[#1b247f] transition-colors"
//         >
//           Back to Courses
//         </Link>
//       </div>
//     );
//   }

//   // --- Success State (Mapped to your Course interface) ---
//   return (
//     <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] text-on-surface font-headline">
//       {/* --- HERO / BANNER SECTION --- */}
//       <section className="bg-[#10141a] pt-8 pb-8 md:pt-10 md:pb-20 lg:pt-12 lg:pb-28 border-b border-[#3b4a44]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="md:w-[55%] lg:w-2/3">
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline leading-tight mb-4 text-[#dfe2eb]">
//               {course.title}
//             </h1>

//             <p className="text-sm sm:text-base lg:text-lg text-[#b9cac3] mb-6 leading-relaxed line-clamp-3">
//               {course.description}
//             </p>

//             {/* Essential Tags Row (Mapped from DB) */}
//             <div className="flex flex-wrap items-center gap-y-3 gap-x-4 mb-5 text-sm">
//               <span className="bg-[#31353c] text-[#dfe2eb] text-[10px] sm:text-xs font-black px-3 py-1.5 rounded uppercase tracking-widest border border-[#3b4a44]">
//                 {course.level}
//               </span>
//               <span className="flex items-center gap-1 text-[#84948e]">
//                 <span className="material-symbols-outlined text-base">
//                   schedule
//                 </span>
//                 {course.duration}
//               </span>
//             </div>

//             {/* Metadata Row */}
//             {/* <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#b9cac3]">
//               <p>
//                 Created by{" "}
//                 <span className="text-[#6fffd9] underline font-bold cursor-pointer hover:text-[#00e5bc] transition-colors">
//                   {course.instructorName}
//                 </span>
//               </p>
//             </div> */}
//           </div>
//         </div>
//       </section>

//       {/* --- MAIN LAYOUT --- */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
//         <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start relative">
//           {/* --- LEFT COLUMN / BOTTOM CONTENT --- */}
//           <main className="flex-1 min-w-0 order-2 md:order-1 w-full">
//             {/* Description Section */}
//             <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed bg-[#1c2026] border border-[#3b4a44] p-6 lg:p-8 rounded-xl">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-headline text-[#dfe2eb] mb-4">
//                 About This Course
//               </h2>
//               {/* Wrap the content in our new component! */}
//               <ExpandableDescription>
//                 <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap pb-4">
//                   {course.description}
//                 </div>
//               </ExpandableDescription>
//             </div>
//           </main>

//           {/* --- RIGHT COLUMN (Sticky Purchase Card) --- */}
//           <PurchaseCard course={course}></PurchaseCard>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

// import { useState } from 'react';
// import { Link, useParams } from "react-router";
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import type { Course } from "../types/courses";

// // --- GraphQL Query ---
// const GET_COURSE_DETAILS = gql`
//   query getCourseInfo($slug: String!) {
//     getCourseInfo(slug: $slug) {
//       success
//       message
//       data {
//         id
//         title
//         description
//         instructorName
//         duration
//         level
//         price
//         icon
//         slug
//       }
//     }
//   }
// `;

// interface GetCourseResponse {
//   getCourseInfo: {
//     success: boolean;
//     message: string;
//     data: Course;
//   };
// }

// // --- Hardcoded Fallback Data ---
// // Data that is not provided by the GraphQL query remains hardcoded here.
// const fallbackData = {
//   organizationName: "TechMastery Institute",
//   courseSeries: "Tech Mastery Series 2026",
//   programmeType: "Bootcamp",
//   tagline: "Build scalable web applications from scratch to production.",
//   durationSubLabel: "Saturdays & Sundays (10AM - 2PM)",
//   eligibilityDetail: "Basic knowledge of HTML, CSS, and JavaScript required.",
//   deliveryMode: "Hybrid (Online & In-person)",
//   keyTakeaways: [
//     "Master React, TypeScript, and Tailwind CSS",
//     "Build robust RESTful and GraphQL APIs with Node.js",
//     "Deploy scalable applications to AWS and Vercel"
//   ],
//   modules: [
//     {
//       title: "Frontend Fundamentals & UI/UX Design",
//       description: "Dive deep into advanced HTML5, CSS3, and modern JavaScript (ES6+). Learn core UI/UX principles to build highly responsive, accessible, and pixel-perfect layouts using Tailwind CSS."
//     },
//     {
//       title: "Advanced React & State Management",
//       description: "Master React functional components, custom hooks, and the Context API. Handle complex application state globally using Redux Toolkit and optimize component rendering performance."
//     },
//     {
//       title: "Backend Architecture with Node.js",
//       description: "Build robust and scalable server-side applications using Node.js and Express. Understand the Repository Pattern, middleware architecture, and RESTful API design standards."
//     },
//     {
//       title: "Database Design (SQL & NoSQL)",
//       description: "Model data effectively using PostgreSQL and MongoDB. Master database normalization, indexing strategies, relationships, and advanced query optimization techniques."
//     },
//     {
//       title: "Authentication & Security",
//       description: "Implement secure user authentication using JWT and OAuth2. Protect your applications against common web vulnerabilities like XSS, CSRF, and SQL injection."
//     },
//     {
//       title: "Microservices & API Gateways",
//       description: "Learn how to break down monolithic applications into scalable microservices. Understand service orchestration, message brokers (RabbitMQ/Kafka), and API gateway routing."
//     },
//     {
//       title: "CI/CD Pipelines & Testing",
//       description: "Automate your workflow using GitHub Actions. Write comprehensive unit, integration, and end-to-end tests using tools like Jest, React Testing Library, and Cypress."
//     },
//     {
//       title: "Final Capstone Project & Deployment",
//       description: "Synthesize everything by building a complete, production-ready full-stack application. Deploy your frontend to Vercel/Cloudflare Pages and backend services to AWS."
//     }
//   ],
//   instructorCredentialsSuffix: "alongside Senior Engineers with 10+ years at top tech companies.",
//   registrationLink: "https://example.com/register",
//   venue: "Behala, South Kolkata",
//   city: "West Bengal, India — 700 034",
//   email: "inquestasolutions@gmail.com",
//   phone: "+91 8119061110",
//   website: "https://inquesta.org",
//   notes: "Early bird discount of 10% applies if registered before August 1st."
// };

// export default function CourseDetails() {
//   const { slug } = useParams<{ slug: string }>();
//   const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);

//   // Fetch the course data from the backend
//   const { data, loading, error } = useQuery<GetCourseResponse>(
//     GET_COURSE_DETAILS,
//     {
//       variables: { slug },
//       skip: !slug,
//     },
//   );

//   const course = data?.getCourseInfo?.data;

//   const toggleModule = (index: number) => {
//     setOpenModuleIndex(openModuleIndex === index ? null : index);
//   };

//   const handleDownloadBrochure = () => {
//     // Placeholder function for downloading the brochure
//     alert("Downloading Brochure...");
//   };

//   // --- Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold text-xl font-['Plus_Jakarta_Sans',_sans-serif]">
//         <span className="material-symbols-outlined animate-spin mr-3">progress_activity</span>
//         Loading Course Details...
//       </div>
//     );
//   }

//   // --- Error / Not Found State ---
//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-[#10141a] flex flex-col items-center justify-center text-[#dfe2eb] font-['Inter',_sans-serif]">
//         <span className="material-symbols-outlined text-[#ffb4ab] text-6xl mb-4">
//           error
//         </span>
//         <h2 className="text-3xl font-bold mb-2 font-['Plus_Jakarta_Sans',_sans-serif]">Course Not Found</h2>
//         <p className="text-[#84948e] mb-8 text-lg">
//           {error?.message || "This course doesn't exist or was removed."}
//         </p>
//         <Link
//           to="/"
//           className="bg-[#343d96] text-[#dfe2eb] px-8 py-3 rounded-xl font-bold hover:bg-[#bdc2ff] hover:text-[#1b247f] transition-colors"
//         >
//           Back to Courses
//         </Link>
//       </div>
//     );
//   }

//   // --- Success State ---
//   return (
//     <div className="min-h-screen bg-[#10141a] text-[#dfe2eb] font-['Inter',_sans-serif] selection:bg-[#6fffd9] selection:text-[#00382c]">

//       {/* Main Content Container */}
//       <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

//         {/* Split Hero Section with Image */}
//         <div className="bg-[#1c2026] rounded-3xl shadow-xl border border-[#3b4a44] overflow-hidden mb-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2">

//             {/* Hero Text Content */}
//             <div className="p-10 lg:p-14 flex flex-col justify-center relative z-10">
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="bg-[#343d96]/30 text-[#bdc2ff] border border-[#343d96] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
//                   {fallbackData.programmeType}
//                 </span>
//                 <span className="text-[#b9cac3] text-sm font-medium tracking-wide flex items-center gap-1">
//                   {/* Dynamic Icon if provided by backend, fallback to terminal */}
//                   <span className="material-symbols-outlined text-sm">{'terminal'}</span>
//                   {fallbackData.courseSeries}
//                 </span>
//               </div>

//               {/* Dynamic Title */}
//               <h1 className="font-['Plus_Jakarta_Sans',_sans-serif] text-4xl sm:text-5xl font-extrabold text-[#dfe2eb] mb-5 leading-tight">
//                 {course.title}
//               </h1>

//               <p className="text-lg text-[#6fffd9] mb-8 leading-relaxed font-medium">
//                 {fallbackData.tagline}
//               </p>

//               <div className="mt-auto border-t border-[#3b4a44] pt-6 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#b9cac3] font-medium mb-1">Cost Per Student</p>
//                   {/* Dynamic Price */}
//                   <p className="font-['Plus_Jakarta_Sans',_sans-serif] text-3xl font-bold text-[#bdc2ff]">
//                     {course.price}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={handleDownloadBrochure}
//                         className="text-[#bdc2ff] hover:text-[#a8afff] font-medium text-sm flex items-center gap-1 transition-colors"
//                     >
//                         <span className="material-symbols-outlined text-sm">download</span>
//                         Brochure
//                     </button>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Image */}
//             <div className="relative h-64 lg:h-auto hidden sm:block bg-[#181c22]">
//               <img
//                 src={`${course.icon}`}
//                 alt="Students collaborating on code"
//                 className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-[#1c2026] via-[#1c2026]/80 to-transparent"></div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
//           {[
//             { icon: "calendar_today", title: course.duration, sub: fallbackData.durationSubLabel },
//             { icon: "pin_drop", title: fallbackData.deliveryMode, sub: fallbackData.city },
//             { icon: "verified", title: `Lvl: ${course.level}`, sub: fallbackData.eligibilityDetail },
//             { icon: "library_books", title: `${fallbackData.modules.length} Modules`, sub: "Comprehensive Curriculum" }
//           ].map((item, idx) => (
//             <div key={idx} className="bg-[#1c2026] p-6 rounded-2xl border border-[#3b4a44] shadow-md flex flex-row md:flex-col items-center md:items-start gap-4 hover:bg-[#262a31] transition-colors duration-300">
//               <span className="material-symbols-outlined text-3xl text-[#6fffd9]">{item.icon}</span>
//               <div>
//                 <p className="text-base font-bold text-[#dfe2eb] font-['Plus_Jakarta_Sans',_sans-serif]">{item.title}</p>
//                 <p className="text-sm text-[#b9cac3] mt-1">{item.sub}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Two-Column Content Area */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

//           {/* Main Left Column (Overview & Curriculum) */}
//           <div className="lg:col-span-8">
//             <section className="mb-12 bg-[#1c2026] p-8 rounded-3xl shadow-md border border-[#3b4a44]">
//               <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-2xl font-bold text-[#dfe2eb] mb-6 pb-4 border-b border-[#3b4a44] flex items-center gap-3">
//                 <span className="material-symbols-outlined text-[#bdc2ff]">subject</span>
//                 Programme Overview
//               </h2>
//               {/* Dynamic Description */}
//               <p className="text-[#b9cac3] leading-relaxed text-lg mb-8 whitespace-pre-wrap">
//                 {course.description}
//               </p>

//               <div className="bg-[#262a31] p-6 rounded-2xl border border-[#3b4a44]">
//                 <h3 className="text-sm font-bold text-[#dfe2eb] uppercase tracking-wider mb-2 flex items-center gap-2">
//                   <span className="material-symbols-outlined text-[#6fffd9] text-lg">workspace_premium</span>
//                   Instructor Credentials
//                 </h3>
//                 {/* Dynamic Instructor Name */}
//                 <p className="text-[#b9cac3]">
//                   Led by <strong className="text-[#dfe2eb]">{course.instructorName}</strong>, {fallbackData.instructorCredentialsSuffix}
//                 </p>
//               </div>
//             </section>

//             {/* Accordion Curriculum Section */}
//             <section className="bg-[#1c2026] p-8 rounded-3xl shadow-md border border-[#3b4a44]">
//               <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-2xl font-bold text-[#dfe2eb] mb-6 pb-4 border-b border-[#3b4a44] flex items-center gap-3">
//                 <span className="material-symbols-outlined text-[#bdc2ff]">view_list</span>
//                 Curriculum Modules
//               </h2>

//               <div className="space-y-4">
//                 {fallbackData.modules.map((module, index) => {
//                   const isOpen = openModuleIndex === index;

//                   return (
//                     <div
//                       key={index}
//                       className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
//                         isOpen
//                           ? 'border-[#6fffd9] bg-[#262a31] shadow-[0_0_15px_rgba(111,255,217,0.05)]'
//                           : 'border-[#3b4a44] bg-[#181c22] hover:border-[#84948e]'
//                       }`}
//                     >
//                       <button
//                         onClick={() => toggleModule(index)}
//                         className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
//                       >
//                         <div className="flex items-center gap-4 pr-4">
//                           <div className={`font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
//                             isOpen
//                               ? 'bg-[#6fffd9] text-[#00382c]'
//                               : 'bg-[#262a31] text-[#6fffd9] border border-[#3b4a44]'
//                           }`}>
//                             {String(index + 1).padStart(2, '0')}
//                           </div>
//                           <span className={`font-medium sm:text-lg transition-colors duration-300 ${
//                             isOpen ? 'text-[#6fffd9]' : 'text-[#dfe2eb]'
//                           }`}>
//                             {module.title}
//                           </span>
//                         </div>
//                         <span className={`material-symbols-outlined text-[#bdc2ff] flex-shrink-0 transition-transform duration-300 ${
//                           isOpen ? 'rotate-180' : 'rotate-0'
//                         }`}>
//                           expand_more
//                         </span>
//                       </button>

//                       <div
//                         className={`grid transition-all duration-300 ease-in-out ${
//                           isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
//                         }`}
//                       >
//                         <div className="overflow-hidden">
//                           <p className="p-5 pt-0 text-[#b9cac3] leading-relaxed pl-[4.5rem] border-t border-[#3b4a44]/50 mt-2">
//                             {module.description}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
//           </div>

//           {/* Right Sidebar (Takeaways & Registration) */}
//           <div className="lg:col-span-4 space-y-6">

//             <div className="bg-[#262a31] text-[#dfe2eb] p-8 rounded-3xl shadow-lg border border-[#3b4a44] relative overflow-hidden">
//               <div className="absolute -top-4 -right-4 p-4 opacity-5">
//                 <span className="material-symbols-outlined text-9xl text-[#bdc2ff]">lightbulb</span>
//               </div>
//               <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
//                 <span className="material-symbols-outlined text-[#bdc2ff]">psychology</span>
//                 Key Takeaways
//               </h2>
//               <ul className="space-y-5 relative z-10">
//                 {fallbackData.keyTakeaways.map((takeaway, index) => (
//                   <li key={index} className="flex items-start gap-3">
//                     <span className="material-symbols-outlined text-[#6fffd9] mt-0.5">check_circle</span>
//                     <span className="text-[#b9cac3] text-sm leading-relaxed">{takeaway}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div id="register" className="bg-[#1c2026] p-8 rounded-3xl shadow-lg border border-[#3b4a44]">
//               <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-xl font-bold text-[#dfe2eb] mb-2">
//                 Secure Your Spot
//               </h2>
//               <p className="text-sm text-[#b9cac3] mb-6 pb-6 border-b border-[#3b4a44]">
//                 {fallbackData.notes}
//               </p>

//               <div className="space-y-4 mb-8">
//                 {[
//                   { icon: "mail", text: fallbackData.email },
//                   { icon: "phone", text: fallbackData.phone },
//                   { icon: "language", text: fallbackData.website },
//                   { icon: "location_on", text: fallbackData.venue }
//                 ].map((contact, idx) => (
//                   <div key={idx} className="flex items-center gap-3 text-sm text-[#dfe2eb]">
//                     <span className="material-symbols-outlined text-[#bdc2ff] text-[20px]">{contact.icon}</span>
//                     <span className="truncate">{contact.text}</span>
//                   </div>
//                 ))}
//               </div>

//               <a
//                 href={fallbackData.registrationLink}
//                 className="w-full flex items-center justify-center gap-2 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] font-['Plus_Jakarta_Sans',_sans-serif] font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(111,255,217,0.15)] hover:shadow-[0_0_25px_rgba(111,255,217,0.3)]"
//               >
//                 Register Now
//                 <span className="material-symbols-outlined text-sm">arrow_outward</span>
//               </a>

//                <button
//                   onClick={handleDownloadBrochure}
//                   className="w-full mt-4 flex items-center justify-center gap-2 bg-[#262a31] hover:bg-[#31353c] text-[#bdc2ff] border border-[#3b4a44] font-['Plus_Jakarta_Sans',_sans-serif] font-bold py-4 px-6 rounded-xl transition-all duration-300"
//                 >
//                   <span className="material-symbols-outlined text-sm">download</span>
//                   Download Brochure
//                 </button>

//               <div className="mt-8 pt-6 border-t border-[#3b4a44] text-center">
//                 <div className="bg-[#dfe2eb] inline-block p-3 rounded-xl mb-3">
//                   <span className="material-symbols-outlined text-[100px] text-[#10141a] block leading-none opacity-90">qr_code_2</span>
//                 </div>
//                 <p className="text-[#6fffd9] font-['Plus_Jakarta_Sans',_sans-serif] font-semibold text-xs uppercase tracking-widest">
//                   Scan to Register
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { Link, useParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import type { Course } from "../types/courses";

// --- GraphQL Query ---
const GET_COURSE_DETAILS = gql`
  query getCourseInfo($slug: String!) {
    getCourseInfo(slug: $slug) {
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
        slug
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

// --- Hardcoded Fallback Data ---
const fallbackData = {
  organizationName: "Inquesta Solutions LLP",
  organizationLogo: "/favicon.svg", // Placeholder Logo
  courseSeries: "TECHNICAL TRAINING PROGRAM",
  programmeType: "Bootcamp",
  tagline: "Build scalable web applications from scratch to production.",
  durationSubLabel: "Saturdays & Sundays (10AM - 2PM)",
  eligibilityDetail: "Basic knowledge of HTML, CSS, and JavaScript required.",
  deliveryMode: "Hybrid (Online & In-person)",
  keyTakeaways: [
    "Master React, TypeScript, and Tailwind CSS",
    "Build robust RESTful and GraphQL APIs with Node.js",
    "Deploy scalable applications to AWS and Vercel",
    "Master database indexing and relationships",
    "Implement secure user authentication",
  ],
  modules: [
    {
      title: "Frontend Fundamentals & UI/UX Design",
      description:
        "Dive deep into advanced HTML5, CSS3, and modern JavaScript (ES6+). Learn core UI/UX principles to build highly responsive, accessible, and pixel-perfect layouts using Tailwind CSS.",
    },
    {
      title: "Advanced React & State Management",
      description:
        "Master React functional components, custom hooks, and the Context API. Handle complex application state globally using Redux Toolkit and optimize component rendering performance.",
    },
    {
      title: "Backend Architecture with Node.js",
      description:
        "Build robust and scalable server-side applications using Node.js and Express. Understand the Repository Pattern, middleware architecture, and RESTful API design standards.",
    },
    {
      title: "Database Design (SQL & NoSQL)",
      description:
        "Model data effectively using PostgreSQL and MongoDB. Master database normalization, indexing strategies, relationships, and advanced query optimization techniques.",
    },
    {
      title: "Authentication & Security",
      description:
        "Implement secure user authentication using JWT and OAuth2. Protect your applications against common web vulnerabilities like XSS, CSRF, and SQL injection.",
    },
    {
      title: "Microservices & API Gateways",
      description:
        "Learn how to break down monolithic applications into scalable microservices. Understand service orchestration, message brokers (RabbitMQ/Kafka), and API gateway routing.",
    },
    {
      title: "CI/CD Pipelines & Testing",
      description:
        "Automate your workflow using GitHub Actions. Write comprehensive unit, integration, and end-to-end tests using tools like Jest, React Testing Library, and Cypress.",
    },
    {
      title: "Final Capstone Project & Deployment",
      description:
        "Synthesize everything by building a complete, production-ready full-stack application. Deploy your frontend to Vercel/Cloudflare Pages and backend services to AWS.",
    },
  ],
  instructorCredentialsSuffix:
    "alongside Senior Engineers with 10+ years at top tech companies.",
  registrationLink: "https://example.com/register",
  venue: "Behala, South Kolkata",
  city: "West Bengal, India — 700 034",
  email: "inquestasolutions@gmail.com",
  phone: "+91 8119061110",
  website: "https://inquesta.org",
  notes: "Early bird discount of 10% applies if registered before August 1st.",
};

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery<GetCourseResponse>(
    GET_COURSE_DETAILS,
    { variables: { slug }, skip: !slug },
  );

  const course = data?.getCourseInfo?.data;

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const getBulletPoints = (text: string) => {
    return text
      .split(". ")
      .filter((sentence) => sentence.trim().length > 0)
      .map((sentence) => sentence + ".");
  };

  // --- PERFECT PAGINATION PDF LOGIC ---
  const handleDownloadBrochure = async () => {
    if (!pdfContainerRef.current || !course) return;

    setIsGeneratingPDF(true);
    try {
      // Unhide the container so html2canvas can read it
      pdfContainerRef.current.style.display = "block";

      const pages = pdfContainerRef.current.querySelectorAll(".pdf-page");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        let imgWidth = pdfWidth;
        let imgHeight = (canvas.height * pdfWidth) / canvas.width;

        if (imgHeight > pdfHeight) {
          const ratio = pdfHeight / imgHeight;
          imgHeight = pdfHeight;
          imgWidth = pdfWidth * ratio;
        }

        const xOffset = (pdfWidth - imgWidth) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", xOffset, 0, imgWidth, imgHeight);
      }

      pdf.save(`${course.slug || "course"}-brochure.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to download the brochure. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
      if (pdfContainerRef.current)
        pdfContainerRef.current.style.display = "none";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold text-xl">
        <span className="material-symbols-outlined animate-spin mr-3">
          progress_activity
        </span>
        Loading Course Details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#10141a] flex flex-col items-center justify-center text-[#dfe2eb]">
        <span className="material-symbols-outlined text-[#ffb4ab] text-6xl mb-4">
          error
        </span>
        <h2 className="text-3xl font-bold mb-2">Course Not Found</h2>
        <p className="text-[#84948e] mb-8 text-lg">
          {error?.message || "This course doesn't exist."}
        </p>
        <Link
          to="/"
          className="bg-[#343d96] text-[#dfe2eb] px-8 py-3 rounded-xl font-bold hover:bg-[#bdc2ff] transition-colors"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  // --- REUSABLE PDF COMPONENTS ---
  const PdfHeader = () => (
    <header className="h-[180px] bg-blue-900 text-white px-16 flex justify-between items-center shrink-0 border-b-[8px] border-blue-500 w-full box-border">
      <div className="flex items-center gap-6">
        {fallbackData.organizationLogo && (
          <img
            src={fallbackData.organizationLogo}
            alt="Company Logo"
            className="h-16 w-auto object-contain rounded bg-white p-1"
            crossOrigin="anonymous"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold m-0 tracking-tight">
            {fallbackData.organizationName}
          </h1>
          <p className="text-blue-300 text-sm mt-2 tracking-widest uppercase font-semibold">
            Enterprise Education Division
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold m-0">Course Brochure</p>
        <p className="text-gray-300 text-base mt-2">
          {fallbackData.courseSeries}
        </p>
      </div>
    </header>
  );

  const PdfFooter = () => (
    <footer className="h-[220px] bg-gray-50 border-t-[4px] border-gray-200 px-16 flex justify-between items-center mt-auto w-full box-border">
      <div>
        <h3 className="font-extrabold text-[#0f172a] text-2xl mb-4 uppercase tracking-wide">
          Contact & Enrollment
        </h3>
        <div className="space-y-2 text-[#475569] text-lg">
          <p className="flex items-center gap-4">
            <strong className="text-[#0f172a] w-24">Email:</strong>{" "}
            {fallbackData.email}
          </p>
          <p className="flex items-center gap-4">
            <strong className="text-[#0f172a] w-24">Phone:</strong>{" "}
            {fallbackData.phone}
          </p>
          <p className="flex items-center gap-4">
            <strong className="text-[#0f172a] w-24">Website:</strong>{" "}
            {fallbackData.website}
          </p>
          <p className="flex items-center gap-4">
            <strong className="text-[#0f172a] w-24">Location:</strong>{" "}
            {fallbackData.venue}, {fallbackData.city}
          </p>
        </div>
      </div>
      <div className="text-right max-w-sm flex flex-col items-end">
        <div className="bg-white p-3 rounded-2xl border-4 border-gray-200 mb-4 shadow-sm flex items-center justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            <path d="M9 14v1c0 .6.4 1 1 1h1"></path>
            <path d="M10 14h1v1h-1z"></path>
            <path d="M14 9h1v1h-1z"></path>
            <path d="M9 9h1v1H9z"></path>
          </svg>
        </div>
        <p className="font-bold text-blue-600 text-lg">
          Apply via our website to secure your spot.
        </p>
      </div>
    </footer>
  );

  return (
    <>
      {/* =========================================================================
          VISIBLE WEB LAYOUT (Untouched dark mode UI)
          ========================================================================= */}
      <div className="min-h-screen bg-[#10141a] text-[#dfe2eb] font-['Inter',_sans-serif] selection:bg-[#6fffd9] selection:text-[#00382c]">
        <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1c2026] rounded-3xl shadow-xl border border-[#3b4a44] overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#343d96]/30 text-[#bdc2ff] border border-[#343d96] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {fallbackData.programmeType}
                  </span>
                  <span className="text-[#b9cac3] text-sm font-medium tracking-wide flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      {"terminal"}
                    </span>
                    {fallbackData.courseSeries}
                  </span>
                </div>

                <h1 className="font-['Plus_Jakarta_Sans',_sans-serif] text-4xl sm:text-5xl font-extrabold text-[#dfe2eb] mb-5 leading-tight">
                  {course.title}
                </h1>

                <p className="text-lg text-[#6fffd9] mb-8 leading-relaxed font-medium">
                  {fallbackData.tagline}
                </p>

                <div className="mt-auto border-t border-[#3b4a44] pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#b9cac3] font-medium mb-1">
                      Cost Per Student
                    </p>
                    <p className="font-['Plus_Jakarta_Sans',_sans-serif] text-3xl font-bold text-[#bdc2ff]">
                      {course.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleDownloadBrochure}
                      disabled={isGeneratingPDF}
                      className="text-[#bdc2ff] hover:text-[#a8afff] font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isGeneratingPDF ? "hourglass_empty" : "download"}
                      </span>
                      {isGeneratingPDF ? "Generating..." : "Brochure"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative h-64 lg:h-auto hidden sm:block bg-[#181c22]">
                <img
                  src={`${course.icon}`}
                  alt="Course Visual"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1c2026] via-[#1c2026]/80 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: "calendar_today",
                title: course.duration,
                sub: fallbackData.durationSubLabel,
              },
              {
                icon: "pin_drop",
                title: fallbackData.deliveryMode,
                sub: fallbackData.city,
              },
              {
                icon: "verified",
                title: `Lvl: ${course.level}`,
                sub: fallbackData.eligibilityDetail,
              },
              {
                icon: "library_books",
                title: `${fallbackData.modules.length} Modules`,
                sub: "Comprehensive Curriculum",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#1c2026] p-6 rounded-2xl border border-[#3b4a44] shadow-md flex flex-row md:flex-col items-center md:items-start gap-4 hover:bg-[#262a31] transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-3xl text-[#6fffd9]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-base font-bold text-[#dfe2eb] font-['Plus_Jakarta_Sans',_sans-serif]">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#b9cac3] mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-8">
              <section className="mb-12 bg-[#1c2026] p-8 rounded-3xl shadow-md border border-[#3b4a44]">
                <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-2xl font-bold text-[#dfe2eb] mb-6 pb-4 border-b border-[#3b4a44] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#bdc2ff]">
                    subject
                  </span>
                  Programme Overview
                </h2>
                <p className="text-[#b9cac3] leading-relaxed text-lg mb-8 whitespace-pre-wrap">
                  {course.description}
                </p>

                <div className="bg-[#262a31] p-6 rounded-2xl border border-[#3b4a44]">
                  <h3 className="text-sm font-bold text-[#dfe2eb] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6fffd9] text-lg">
                      workspace_premium
                    </span>
                    Instructor Credentials
                  </h3>
                  <p className="text-[#b9cac3]">
                    Led by{" "}
                    <strong className="text-[#dfe2eb]">
                      {course.instructorName}
                    </strong>
                    , {fallbackData.instructorCredentialsSuffix}
                  </p>
                </div>
              </section>

              <section className="bg-[#1c2026] p-8 rounded-3xl shadow-md border border-[#3b4a44]">
                <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-2xl font-bold text-[#dfe2eb] mb-6 pb-4 border-b border-[#3b4a44] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#bdc2ff]">
                    view_list
                  </span>
                  Curriculum Modules
                </h2>

                <div className="space-y-4">
                  {fallbackData.modules.map((module, index) => {
                    const isOpen = openModuleIndex === index;
                    return (
                      <div
                        key={index}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-[#6fffd9] bg-[#262a31]" : "border-[#3b4a44] bg-[#181c22]"}`}
                      >
                        <button
                          onClick={() => toggleModule(index)}
                          className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-4 pr-4">
                            <div
                              className={`font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? "bg-[#6fffd9] text-[#00382c]" : "bg-[#262a31] text-[#6fffd9] border border-[#3b4a44]"}`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <span
                              className={`font-medium sm:text-lg ${isOpen ? "text-[#6fffd9]" : "text-[#dfe2eb]"}`}
                            >
                              {module.title}
                            </span>
                          </div>
                          <span
                            className={`material-symbols-outlined text-[#bdc2ff] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                          >
                            expand_more
                          </span>
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                        >
                          <div className="overflow-hidden">
                            <p className="p-5 pt-0 text-[#b9cac3] leading-relaxed pl-[4.5rem] border-t border-[#3b4a44]/50 mt-2">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#262a31] text-[#dfe2eb] p-8 rounded-3xl shadow-lg border border-[#3b4a44] relative overflow-hidden">
                <div className="absolute -top-4 -right-4 p-4 opacity-5">
                  <span className="material-symbols-outlined text-9xl text-[#bdc2ff]">
                    lightbulb
                  </span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#bdc2ff]">
                    psychology
                  </span>
                  Key Takeaways
                </h2>
                <ul className="space-y-5 relative z-10">
                  {fallbackData.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#6fffd9] mt-0.5">
                        check_circle
                      </span>
                      <span className="text-[#b9cac3] text-sm leading-relaxed">
                        {takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                id="register"
                className="bg-[#1c2026] p-8 rounded-3xl shadow-lg border border-[#3b4a44]"
              >
                <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-xl font-bold text-[#dfe2eb] mb-2">
                  Secure Your Spot
                </h2>
                <p className="text-sm text-[#b9cac3] mb-6 pb-6 border-b border-[#3b4a44]">
                  {fallbackData.notes}
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: "mail", text: fallbackData.email },
                    { icon: "phone", text: fallbackData.phone },
                    { icon: "language", text: fallbackData.website },
                    { icon: "location_on", text: fallbackData.venue },
                  ].map((contact, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm text-[#dfe2eb]"
                    >
                      <span className="material-symbols-outlined text-[#bdc2ff] text-[20px]">
                        {contact.icon}
                      </span>
                      <span className="truncate">{contact.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleDownloadBrochure}
                  disabled={isGeneratingPDF}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] font-['Plus_Jakarta_Sans',_sans-serif] font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isGeneratingPDF ? "hourglass_empty" : "download"}
                  </span>
                  {isGeneratingPDF ? "Generating PDF..." : "Download Brochure"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          HIDDEN A4 PDF LAYOUT 
          ========================================================================= */}
      <div
        ref={pdfContainerRef}
        className="absolute top-[200vh] left-[-9999px] z-[-50] flex flex-col gap-10"
        style={{ display: "none" }}
      >
        {/* === PDF PAGE 1: Hero & Specs === */}
        <div
          className="pdf-page bg-white text-gray-900 font-sans flex flex-col relative box-border"
          style={{ width: "1190px", height: "1684px" }}
        >
          <PdfHeader />
          <div className="px-16 py-12 flex-1 flex flex-col z-10 box-border">
            <div className="mb-12 border-l-[8px] border-blue-600 pl-6">
              <h2 className="text-[4rem] font-black text-gray-900 uppercase mb-4 leading-tight tracking-tight">
                {course.title}
              </h2>
              <p className="text-3xl text-gray-600 font-medium italic m-0">
                "{fallbackData.tagline}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 bg-gray-50 p-10 rounded-2xl mb-12 border border-gray-200 shadow-sm">
              <div>
                <p className="text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Duration
                </p>
                <p className="text-2xl font-bold">
                  {course.duration}{" "}
                  <span className="text-lg text-gray-500 font-normal">
                    ({fallbackData.durationSubLabel})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Delivery Mode
                </p>
                <p className="text-2xl font-bold">
                  {fallbackData.deliveryMode}
                </p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Eligibility
                </p>
                <p className="text-2xl font-bold">{course.level}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Fee
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {course.price}
                </p>
              </div>
            </div>

            <section>
              <h3 className="text-3xl font-bold text-blue-900 border-b-2 border-gray-200 pb-4 mb-6 uppercase tracking-wide">
                Program Overview
              </h3>
              <p className="text-2xl leading-relaxed text-gray-700">
                {course.description}
              </p>
            </section>
          </div>
          <PdfFooter />
        </div>

        {/* === PDF PAGE 2: Curriculum Modules 1 to 5 === */}
        <div
          className="pdf-page bg-white text-gray-900 font-sans flex flex-col relative box-border"
          style={{ width: "1190px", height: "1684px" }}
        >
          <PdfHeader />
          <div className="px-16 py-12 flex-1 flex flex-col z-10 box-border">
            <section className="flex-grow">
              <h3 className="text-3xl font-bold text-blue-900 border-b-2 border-gray-200 pb-4 mb-8 uppercase tracking-wide">
                Curriculum Modules (Part 1)
              </h3>
              <div className="space-y-8">
                {fallbackData.modules.slice(0, 5).map((module, idx) => {
                  const bulletPoints = getBulletPoints(module.description);
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
                    >
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        <span className="text-blue-600 mr-2">
                          Module {idx + 1}:
                        </span>{" "}
                        {module.title}
                      </h4>
                      <ul className="list-disc pl-8 text-gray-700 text-xl leading-relaxed space-y-2 marker:text-blue-500">
                        {bulletPoints.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <PdfFooter />
        </div>

        {/* === PDF PAGE 3: Modules 6-8, Instructor, Takeaways === */}
        <div
          className="pdf-page bg-white text-gray-900 font-sans flex flex-col relative box-border"
          style={{ width: "1190px", height: "1684px" }}
        >
          <PdfHeader />
          <div className="px-16 py-12 flex-1 flex flex-col z-10 gap-10 box-border">
            <section>
              <h3 className="text-3xl font-bold text-blue-900 border-b-2 border-gray-200 pb-4 mb-8 uppercase tracking-wide">
                Curriculum Modules (Part 2)
              </h3>
              <div className="space-y-8">
                {fallbackData.modules.slice(5).map((module, idx) => {
                  const bulletPoints = getBulletPoints(module.description);
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
                    >
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        <span className="text-blue-600 mr-2">
                          Module {idx + 6}:
                        </span>{" "}
                        {module.title}
                      </h4>
                      <ul className="list-disc pl-8 text-gray-700 text-xl leading-relaxed space-y-2 marker:text-blue-500">
                        {bulletPoints.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-xl border border-blue-100">
              <p className="text-lg font-bold text-blue-900 uppercase tracking-wider mb-2">
                Lead Instructor
              </p>
              <p className="text-2xl text-gray-800">
                <strong>{course.instructorName}</strong>,{" "}
                {fallbackData.instructorCredentialsSuffix}
              </p>
            </section>

            <section>
              <h3 className="text-3xl font-bold text-blue-900 border-b-2 border-gray-200 pb-4 mb-8 uppercase tracking-wide">
                Key Takeaways
              </h3>
              <ul className="space-y-4 text-gray-700 text-2xl leading-relaxed">
                {fallbackData.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-blue-500 font-bold text-2xl leading-none mt-1">
                      ✓
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <PdfFooter />
        </div>
      </div>
    </>
  );
}
