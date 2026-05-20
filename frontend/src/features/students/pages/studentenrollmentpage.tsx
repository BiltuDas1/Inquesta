import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import StudentCourseTable from "../components/studentscoursetable";
import type { Course } from "../../courses/types/courses";

const GET_ENROLLED_COURSES = gql`
  query enrolledCourses {
    enrolledCourses {
      data {
        id
        title
        instructorName
        level
        duration
        slug
      }
    }
  }
`;

export interface EnrolledCoursesResponse {
  enrolledCourses: {
    data: Course[];
  };
}

export default function StudentEnrollmentsTablePage() {
  const { loading, error, data } =
    useQuery<EnrolledCoursesResponse>(GET_ENROLLED_COURSES);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full flex items-center justify-center">
        <p className="text-[#b9cac3] text-sm animate-pulse">
          Loading your curriculum...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full flex items-center justify-center">
        <p className="text-[#ffb4ab] text-sm bg-[#2a0d10] px-4 py-2 rounded-lg border border-[#ffb4ab]/20">
          Failed to load courses: {error.message}
        </p>
      </div>
    );
  }

  const courses = data?.enrolledCourses?.data || [];

  return (
    <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full">
      {/* Header Section */}
      <div className="mb-8  pb-6">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb] mb-2">
          My Enrollments
        </h1>
        <p className="text-[#b9cac3] text-sm">
          You are enrolled in {courses.length} courses.
        </p>
      </div>

      {/* Table Section */}
      <StudentCourseTable courses={courses} />
    </div>
  );
}
