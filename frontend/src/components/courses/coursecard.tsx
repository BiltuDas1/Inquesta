// import type { Course } from "../../dummydata/courses";

// interface CourseCardProps {
//   course: Course;
// }
// interface StarRatingProps {
//   rating: number;
// }

// interface BadgePillProps {
//   label: string;
// }

// export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
//   const full = Math.floor(rating);
//   const half = rating % 1 >= 0.5;

//   return (
//     <div className="flex items-center gap-0.5">
//       {[...Array(5)].map((_, i) => {
//         const isFull = i < full;
//         const isHalf = i === full && half;
//         const iconName = isHalf ? "star_half" : "star";

//         // Yellow for full/half stars, dark gray for empty stars
//         const colorClass =
//           isFull || isHalf ? "text-yellow-400" : "text-[#3b4a44]";

//         return (
//           <span
//             key={i}
//             className={`material-symbols-outlined ${colorClass}`}
//             style={{
//               fontSize: "16px",
//               fontVariationSettings: "'FILL' 1",
//             }}
//           >
//             {iconName}
//           </span>
//         );
//       })}
//     </div>
//   );
// };

// export const BadgePill: React.FC<BadgePillProps> = ({ label }) => {
//   const styles: Record<string, string> = {
//     Premium: "bg-[#343d96] text-[#bdc2ff]",
//     Bestseller: "bg-[#00e5bc] text-[#00382c]",
//     "Highest Rated": "bg-[#6fffd9] text-[#00382c]",
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${styles[label] || "bg-[#31353c] text-[#dfe2eb]"}`}
//     >
//       {label === "Premium" && (
//         <span
//           className="material-symbols-outlined"
//           style={{ fontSize: "18px" }}
//         >
//           verified
//         </span>
//       )}
//       {label}
//     </span>
//   );
// };

// export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//   return (
//     <div className="flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
//       {/* Thumbnail */}
//       <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded">
//         <img
//           src={course.image}
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

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
//           {course.title}
//         </h3>
//         <p className="hidden md:block text-xs text-[#b9cac3] mt-1 line-clamp-2">
//           {course.description}
//         </p>
//         <p className="text-xs text-[#b9cac3] mt-1">{course.instructor}</p>

//         <div className="flex items-center gap-1.5 mt-1">
//           <span className="text-xs font-bold text-[#6fffd9]">
//             {course.rating}
//           </span>
//           <StarRating rating={course.rating} />
//           <span className="text-xs text-[#84948e]">
//             ({course.reviews.toLocaleString()})
//           </span>
//         </div>

//         <p className="text-xs text-[#84948e] mt-0.5">
//           {course.hours} total hours · {course.lectures} lectures ·{" "}
//           {course.level}
//         </p>

//         {/* Price row - mobile shows here */}
//         <div className="flex items-center gap-2 mt-1 md:hidden">
//           <span className="text-sm font-bold text-[#dfe2eb]">
//             ₹{course.price}
//           </span>
//           <span className="text-xs text-[#84948e] line-through">
//             ₹{course.originalPrice}
//           </span>
//         </div>

//         <div className="flex flex-wrap gap-1.5 mt-2">
//           {course.badges.map((b: string) => (
//             <BadgePill key={b} label={b} />
//           ))}
//         </div>

//         {/* Add to cart - mobile */}
//         <button className="mt-3 md:hidden w-full border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors">
//           Add to cart
//         </button>
//       </div>

//       {/* Price - desktop */}
//       <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
//         <span className="text-lg font-bold text-[#dfe2eb]">
//           ₹{course.price}
//         </span>
//         <span className="text-sm text-[#84948e] line-through">
//           ₹{course.originalPrice}
//         </span>
//       </div>
//     </div>
//   );
// };

import React from "react";
import type { Course } from "../../types/courses";


interface CourseCardProps {
  course: Course;
}
interface StarRatingProps {
  rating: number;
}
interface BadgePillProps {
  label: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        const iconName = isHalf ? "star_half" : "star";
        const colorClass = isFull || isHalf ? "text-yellow-400" : "text-[#3b4a44]";

        return (
          <span
            key={i}
            className={`material-symbols-outlined ${colorClass}`}
            style={{
              fontSize: "16px",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {iconName}
          </span>
        );
      })}
    </div>
  );
};

export const BadgePill: React.FC<BadgePillProps> = ({ label }) => {
  const styles: Record<string, string> = {
    Premium: "bg-[#343d96] text-[#bdc2ff]",
    Bestseller: "bg-[#00e5bc] text-[#00382c]",
    "Highest Rated": "bg-[#6fffd9] text-[#00382c]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${styles[label] || "bg-[#31353c] text-[#dfe2eb]"}`}
    >
      {label === "Premium" && (
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
          verified
        </span>
      )}
      {label}
    </span>
  );
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Setup safe defaults for missing backend fields
//  const rating = course?.rating ?? 0;
// const reviews = course?.reviews ?? 0;
// const badges = course?.badges ?? [];
// const originalPrice = course?.originalPrice ?? course?.price ?? 0;
// const lectures = course?.lectures ?? 0;
  return (
    <div className="flex gap-3 md:gap-4 py-4 border-b border-[#3b4a44] group cursor-pointer hover:bg-[#181c22] rounded-lg px-2 -mx-2 transition-colors">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-16 sm:w-28 sm:h-20 md:w-65 md:h-38 overflow-hidden rounded">
        <img
          src={course.icon}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-[#dfe2eb] leading-snug line-clamp-2 group-hover:text-[#6fffd9] transition-colors font-headline">
          {course.title}
        </h3>
        <p className="hidden md:block text-xs text-[#b9cac3] mt-1 line-clamp-2">
          {course.description}
        </p>
        <p className="text-xs text-[#b9cac3] mt-1">{course.instructorName}</p>

        <div className="flex items-center gap-1.5 mt-1">
          {/* <span className="text-xs font-bold text-[#6fffd9]">{rating}</span>
          <StarRating rating={rating} />
          <span className="text-xs text-[#84948e]">
            ({reviews.toLocaleString()})
          </span> */}
        </div>

        <p className="text-xs text-[#84948e] mt-0.5">
          {/* {course.duration} total hours · {lectures} lectures · {course.level} */}
        </p>

        {/* Price row - mobile shows here */}
        <div className="flex items-center gap-2 mt-1 md:hidden">
          {/* <span className="text-sm font-bold text-[#dfe2eb]">₹{course.price}</span>
          {originalPrice > course.price && (
            <span className="text-xs text-[#84948e] line-through">₹{originalPrice}</span>
          )} */}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {/* {badges.map((b: string) => (
            <BadgePill key={b} label={b} />
          ))} */}
        </div>

        {/* Add to cart - mobile */}
        <button className="mt-3 md:hidden w-full border border-[#00e5bc] text-[#00e5bc] text-xs font-semibold py-2 rounded hover:bg-[#00e5bc] hover:text-[#00382c] transition-colors">
          Add to cart
        </button>
      </div>

      {/* Price - desktop */}
      <div className="hidden md:flex flex-col items-end justify-start flex-shrink-0 w-24">
        <span className="text-lg font-bold text-[#dfe2eb]">₹{course.price}</span>
        {/* {originalPrice > course.price && (
          <span className="text-sm text-[#84948e] line-through">₹{originalPrice}</span>
        )} */}
      </div>
    </div>
  );
};