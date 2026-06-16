import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// --- GraphQL Queries ---

const GET_ENROLLED_COURSES = gql`
  query EnrolledCourses {
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

const GET_CURRICULUM_UNITS = gql`
  query GetCurriculumUnits($courseId: String!) {
    getCurriculumUnits(courseId: $courseId) {
      success
      message
      data {
        id
        courseId
        title
        description
        completed
      }
    }
  }
`;

interface Course {
  id: string;
  title: string;
  instructorName: string;
  level: string;
  duration: string;
  slug: string;
}

interface UnitRecord {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface EnrolledCoursesResponse {
  enrolledCourses: {
    data: Course[];
  };
}

export default function StudentCourseReportPage() {
  const [searchParams] = useSearchParams();
  const queryCourseId = searchParams.get("courseId") || "";
  const [selectedCourseId, setSelectedCourseId] = useState<string>(queryCourseId);

  // 1. Fetch enrolled courses
  const { data: coursesData, loading: coursesLoading, error: coursesError } =
    useQuery<EnrolledCoursesResponse>(GET_ENROLLED_COURSES);

  const coursesList = coursesData?.enrolledCourses?.data || [];

  // Auto-select first course when courses are loaded
  useEffect(() => {
    if (coursesList.length > 0) {
      if (queryCourseId && coursesList.some((c) => c.id === queryCourseId)) {
        setSelectedCourseId(queryCourseId);
      } else if (!selectedCourseId) {
        setSelectedCourseId(coursesList[0].id);
      }
    }
  }, [coursesList, queryCourseId, selectedCourseId]);

  // 2. Fetch curriculum units for selected course
  const { data: unitsData, loading: unitsLoading, error: unitsError } = useQuery<{
    getCurriculumUnits: { data: UnitRecord[] };
  }>(GET_CURRICULUM_UNITS, {
    variables: { courseId: selectedCourseId },
    skip: !selectedCourseId,
    fetchPolicy: "cache-and-network",
  });

  const unitsList = unitsData?.getCurriculumUnits?.data || [];

  if (coursesLoading) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full flex items-center justify-center">
        <p className="text-[#b9cac3] text-sm animate-pulse">
          Loading report details...
        </p>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full flex items-center justify-center">
        <p className="text-[#ffb4ab] text-sm bg-[#2a0d10] px-4 py-2 rounded-lg border border-[#ffb4ab]/20">
          Failed to load courses: {coursesError.message}
        </p>
      </div>
    );
  }

  if (coursesList.length === 0) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full text-center space-y-4">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">Course Report</h1>
        <p className="text-[#84948e] text-sm">You are not currently enrolled in any courses.</p>
      </div>
    );
  }

  const selectedCourse = coursesList.find((c) => c.id === selectedCourseId) || coursesList[0];

  // Calculate stats
  const totalUnits = unitsList.length;
  const completedUnits = unitsList.filter((u) => u.completed).length;
  const progressPercent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full space-y-6">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#dfe2eb] mb-1">
            Course Report
          </h1>
          <p className="text-[#b9cac3] text-sm">
            Track your progress and completed units
          </p>
        </div>

        {coursesList.length > 1 && (
          <div className="flex items-center gap-3 bg-[#1c2026] border border-[#3b4a44] px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-[#bdc2ff]">Select Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-transparent border-none text-xs font-headline font-bold text-[#dfe2eb] outline-none cursor-pointer"
            >
              {coursesList.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1c2026]">
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Selected Course Label ── */}
      <div className="text-[13px] font-semibold text-[#bdc2ff] uppercase tracking-wide">
        Current Course: {selectedCourse.title}
      </div>

      {/* ── Progress Statistics Card ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#dfe2eb]">Course Completion</h3>
            <p className="text-xs text-[#84948e]">Dynamic progress calculated from curriculum units</p>
          </div>
          <span className="text-2xl font-headline font-bold text-[#6fffd9]">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#262a31] h-3.5 rounded-full overflow-hidden border border-[#3b4a44]/55">
          <div
            className="bg-gradient-to-r from-[#00e5bc] to-[#6fffd9] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(111,255,217,0.3)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-[#b9cac3] font-semibold">
          <span>{completedUnits} Completed</span>
          <span>{totalUnits - completedUnits} Remaining</span>
          <span>{totalUnits} Total Units</span>
        </div>
      </div>

      {/* ── Units Status List ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#dfe2eb] font-headline">Units Syllabus Status</h3>

        {unitsLoading ? (
          <p className="text-[#84948e] text-xs animate-pulse italic">Loading syllabus units...</p>
        ) : unitsError ? (
          <p className="text-[#ffb4ab] text-xs">Error loading units: {unitsError.message}</p>
        ) : unitsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitsList.map((unit, index) => (
              <div
                key={unit.id}
                className={`bg-[#1c2026] border p-5 rounded-xl flex items-start gap-4 shadow-sm transition-all ${
                  unit.completed
                    ? "border-[#00e5bc]/40 bg-[#1c2026]/90"
                    : "border-[#3b4a44]/80"
                }`}
              >
                {/* Visual Checkmark Indicator */}
                <div className="shrink-0 mt-0.5 select-none">
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      unit.completed ? "text-[#00e5bc]" : "text-[#84948e]"
                    }`}
                  >
                    {unit.completed ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-base text-[#dfe2eb]">
                      Unit-{index + 1}: {unit.title}
                    </h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        unit.completed
                          ? "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"
                          : "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20"
                      }`}
                    >
                      {unit.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                  {unit.description && (
                    <p className="text-sm leading-relaxed font-light text-[#b9cac3]">
                      {unit.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-[#1c2026] border border-[#3b4a44] p-10 rounded-xl text-[#84948e] text-sm italic">
            No units added to this course's syllabus yet.
          </div>
        )}
      </div>
    </div>
  );
}
