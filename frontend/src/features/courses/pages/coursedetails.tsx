import { Link, useParams } from "react-router";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Course } from "../types/courses";
import { ExpandableDescription } from "../../../shared/components/expandabledescription";
import { PurchaseCard } from "../components/purchascard";

// --- GraphQL Query ---
// Note: Adjust the query name ('courseGetById') if your backend uses a different name for fetching a single course!
const GET_COURSE_DETAILS = gql`
  query getCourseInfo($courseID: String!) {
    getCourseInfo(courseID: $courseID) {
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
  const { courseID } = useParams<{ courseID: string }>();

  // 2. Fetch the course data from the backend
  const { data, loading, error } = useQuery<GetCourseResponse>(
    GET_COURSE_DETAILS,
    {
      variables: { courseID },
      skip: !courseID, // Don't run the query if there's no ID in the URL
    },
  );

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
        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
          error
        </span>
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-[#84948e] mb-6">
          {error?.message || "This course doesn't exist or was removed."}
        </p>
        <Link
          to="/"
          className="bg-[#343d96] text-white px-6 py-2 rounded font-bold hover:bg-[#bdc2ff] hover:text-[#1b247f] transition-colors"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  // --- Success State (Mapped to your Course interface) ---
  return (
    <div className="min-h-screen bg-[#10141a] font-body text-[#dfe2eb] text-on-surface font-headline">
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
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                {course.duration}
              </span>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#b9cac3]">
              <p>
                Created by{" "}
                <span className="text-[#6fffd9] underline font-bold cursor-pointer hover:text-[#00e5bc] transition-colors">
                  {course.instructorName}
                </span>
              </p>
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
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-headline text-[#dfe2eb] mb-4">
                About This Course
              </h2>
              {/* Wrap the content in our new component! */}
              <ExpandableDescription>
                <div className="prose prose-invert max-w-none text-[#b9cac3] text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap pb-4">
                  {course.description}
                </div>
              </ExpandableDescription>
            </div>
          </main>

          {/* --- RIGHT COLUMN (Sticky Purchase Card) --- */}
          <PurchaseCard course={course}></PurchaseCard>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
