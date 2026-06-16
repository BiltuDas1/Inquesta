import { useState } from "react";
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
        status
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
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "rejected">("verified");

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

  const allCourses = data?.enrolledCourses?.data || [];
  const pendingCourses = allCourses.filter((c: any) => c.status === "pending");
  const acceptedCourses = allCourses.filter((c: any) => c.status === "verified");
  const rejectedCourses = allCourses.filter((c: any) => c.status === "rejected");

  const displayedCourses =
    activeTab === "pending"
      ? pendingCourses
      : activeTab === "verified"
        ? acceptedCourses
        : rejectedCourses;

  return (
    <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full">
      {/* Header Section */}
      <div className="mb-8 pb-4">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb] mb-2">
          My Enrollments
        </h1>
        <p className="text-[#b9cac3] text-sm">
          Track and access your course enrollments
        </p>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-2 border-b border-[#3b4a44] pb-4 mb-6 overflow-x-auto">
        {[
          { key: "verified", label: "Accepted / Active", count: acceptedCourses.length },
          { key: "pending", label: "Pending Verification", count: pendingCourses.length },
          { key: "rejected", label: "Rejected", count: rejectedCourses.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold font-headline rounded-lg transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#262a31] text-[#6fffd9] border border-[#6fffd9]/20 shadow-[0_0_15px_rgba(111,255,217,0.1)]"
                  : "text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31]/50"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-[#6fffd9]/20 text-[#6fffd9]"
                    : "bg-[#1c2026] text-[#84948e] border border-[#3b4a44]/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Section */}
      <StudentCourseTable courses={displayedCourses} />
    </div>
  );
}
