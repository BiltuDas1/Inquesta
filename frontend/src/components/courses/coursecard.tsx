// import { Link } from "react-router";
// import type { Course } from "../../types/courses";

// interface CourseCardProps {
//   course: Course;
// }

// export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//   // Logic to strictly display only 121 characters
//   const truncatedDescription =
//     course.description.length > 121
//       ? `${course.description.substring(0, 121)}...`
//       : course.description;

//   return (
//     <Link
//       to={`/course/${course.id}`}

//     >
//     <div className="flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
//       {/* Thumbnail - Layout preserved exactly */}
//       <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded">
//         <img
//           src={course.icon}
//           alt={course.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//             e.currentTarget.onerror = null;
//             e.currentTarget.style.background = "#1c2026";
//             e.currentTarget.src =
//               "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//           }}
//         />
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
//           {course.title}
//         </h3>

//         {/* Description - Strictly 121 chars */}
//         <p className="hidden md:block text-xs text-[#b9cac3] mt-1">
//           {truncatedDescription}
//         </p>

//         <p className="text-xs text-[#00e5bc] mt-1 font-medium">
//           {course.instructorName}
//         </p>

//         {/* Level and Duration Row */}
//         <div className="flex items-center gap-2 mt-2">
//           <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#31353c] text-[#dfe2eb] uppercase tracking-wider">
//             {course.level}
//           </span>
//           <span className="text-xs text-[#84948e] flex items-center gap-1">
//             <span className="material-symbols-outlined text-[14px]">
//               schedule
//             </span>
//             {course.duration}
//           </span>
//         </div>

//         {/* Mobile Price Display */}
//         <div className="flex items-center gap-2 mt-2 md:hidden">
//           <span className="text-sm font-bold text-[#dfe2eb]">
//             ₹{course.price}
//           </span>
//         </div>

//         {/* Mobile Action */}
//         <button className="mt-3 md:hidden w-full border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors">
//           Enroll Now
//         </button>
//       </div>

//       {/* Desktop Price Display - Position preserved exactly */}
//       <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
//         <span className="text-lg font-bold text-[#dfe2eb]">
//           ₹{course.price}
//         </span>
//         <button className="mt-auto border border-[#00e5bc] text-[#00e5bc] text-xs font-bold px-4 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//           Enroll
//         </button>
//       </div>
//     </div>
//     </Link>
//   );
// };

import React from "react";

import type { Course } from "../../types/courses";
import { Link } from "react-router";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const safeDescription = course?.description || "";
  const truncatedDescription =
    safeDescription.length > 121
      ? `${safeDescription.substring(0, 121)}...`
      : safeDescription;

  return (
    <div className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
      <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded z-0">
        <img
          src={`${import.meta.env.VITE_SUPERBASE_PUBLIC_URL}/${course.icon}`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.background = "#1c2026";
            e.currentTarget.src =
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* THE CHANGE: Use course.id directly in the URL */}
        <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
          <Link
            to={`/course/${course.id}`}
            className="outline-none before:absolute before:inset-0 before:z-10"
          >
            {course.title}
          </Link>
        </h3>

        <p className="hidden md:block text-xs text-[#b9cac3] mt-1">
          {truncatedDescription}
        </p>

        <p className="text-xs text-[#00e5bc] mt-1 font-medium">
          {course.instructorName}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#31353c] text-[#dfe2eb] uppercase tracking-wider">
            {course.level}
          </span>
          <span className="text-xs text-[#84948e] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            {course.duration}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 md:hidden">
          <span className="text-sm font-bold text-[#dfe2eb]">
            ₹{course.price}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(`Enrolling in ID: ${course.id}`);
          }}
          className="relative z-20 mt-3 md:hidden w-full border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors"
        >
          Enroll Now
        </button>
      </div>

      <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
        <span className="text-lg font-bold text-[#dfe2eb]">
          ₹{course.price}
        </span>
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            console.log(`Enrolling in ID: ${course.id}`);
          }}
          className="relative z-20 mt-auto border border-[#00e5bc] text-[#00e5bc] text-xs font-bold px-4 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Enroll
        </button> */}
      </div>
    </div>
  );
};
