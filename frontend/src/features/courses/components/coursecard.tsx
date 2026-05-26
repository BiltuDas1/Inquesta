// import React from "react";

// import { Link } from "react-router";
// import type { Course } from "../types/courses";

// interface CourseCardProps {
//   course: Course;
// }

// export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//   const safeDescription = course?.description || "";
//   const truncatedDescription =
//     safeDescription.length > 121
//       ? `${safeDescription.substring(0, 121)}...`
//       : safeDescription;

//   return (
//     <div className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
//       <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded z-0">
//         <img
//           src={`${course.icon}`}
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

//       <div className="flex-1 min-w-0">
//         {/* THE CHANGE: Use course.id directly in the URL */}
//         <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
//           <Link
//             to={`/course/${course.slug}`}
//             className="outline-none before:absolute before:inset-0 before:z-10"
//           >
//             {course.title}
//           </Link>
//         </h3>

//         <p className="hidden md:block text-xs text-[#b9cac3] mt-1">
//           {truncatedDescription}
//         </p>

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

//         <div className="flex items-center gap-2 mt-2 md:hidden"></div>
//         <Link
//           to={`/course/${course.slug}`}
//           className="relative z-20 mt-3 md:hidden w-full block text-center border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors"
//         >
//           Enroll Now
//         </Link>
//       </div>

//       <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
//         <Link
//           to={`/course/${course.slug}`}
//           className="relative z-20 mt-3  w-full block text-center border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors"
//         >
//           Enroll Now
//         </Link>
//       </div>
//     </div>
//   );
// };


import React from "react";
import { Link } from "react-router";
import type { Course } from "../types/courses";

interface CourseCardProps {
  course: Course;
  // Optional: Pass a function from the parent to handle the cart logic
  // onAddToCart?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const safeDescription = course?.description || "";
  const truncatedDescription =
    safeDescription.length > 121
      ? `${safeDescription.substring(0, 121)}...`
      : safeDescription;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevents the card's outer link from triggering when clicking the button
    e.preventDefault();
    e.stopPropagation();
    
    // Add your GraphQL mutation/cart logic here
    console.log("Added to cart:", course.id);
  };

  return (
    <div className="relative flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
      <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded z-0">
        <img
          src={`${course.icon}`}
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
        <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
          <Link
            to={`/course/${course.slug}`}
            className="outline-none before:absolute before:inset-0 before:z-10"
          >
            {course.title}
          </Link>
        </h3>

        <p className="hidden md:block text-xs text-[#b9cac3] mt-1">
          {truncatedDescription}
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

        {/* --- MOBILE BUTTONS --- */}
        <div className="relative z-20 mt-3 md:hidden flex gap-2 w-full">
          <Link
            to={`/course/${course.slug}`}
            className="flex-1 block text-center bg-[#00e5bc] text-[#00382c] text-xs font-semibold py-2 rounded hover:bg-[#6fffd9] transition-colors"
          >
            Enroll
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 block text-center border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* --- DESKTOP BUTTONS --- */}
      <div className="hidden md:flex flex-col gap-2 items-end justify-start flex-shrink-0 w-24 mt-2">
        <Link
          to={`/course/${course.slug}`}
          className="relative z-20 w-full block text-center bg-[#00e5bc] text-[#00382c] text-xs font-semibold py-2 rounded hover:bg-[#6fffd9] transition-colors"
        >
          Enroll Now
        </Link>
        <button
          onClick={handleAddToCart}
          className="relative z-20 w-full block text-center border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};