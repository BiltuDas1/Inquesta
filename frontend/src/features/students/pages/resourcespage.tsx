import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// --- GraphQL Queries ---
const GET_ENROLLED_COURSES = gql`
  query EnrolledCourses {
    enrolledCourses {
      data {
        id
        title
        status
      }
    }
  }
`;

const GET_RESOURCES = gql`
  query GetResources($courseId: String) {
    getResources(courseId: $courseId) {
      success
      message
      data {
        id
        courseId
        title
        type
        url
        description
      }
    }
  }
`;

interface Course {
  id: string;
  title: string;
  status: string;
}

interface Resource {
  id: string;
  courseId: string | null;
  title: string;
  type: "pdf" | "video" | "link" | "document";
  url: string;
  description: string | null;
}

export default function StudentResourcesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // Fetch student's enrolled courses
  const { data: coursesData, loading: coursesLoading } = useQuery<{
    enrolledCourses: { data: Course[] };
  }>(GET_ENROLLED_COURSES, {
    fetchPolicy: "cache-and-network",
  });

  const enrolledList = coursesData?.enrolledCourses?.data || [];
  // Only show resources for verified/active enrollments
  const activeCourses = enrolledList.filter((c) => c.status === "verified");

  // Auto-select "all" or specific course on load
  useEffect(() => {
    if (activeCourses.length > 0 && selectedCourseId === "all") {
      // Keep "all" or optionally default to the first course if desired.
      // We will keep "all" as the default so they see everything first.
    }
  }, [activeCourses]);

  // Fetch resources
  const { data: resourcesData, loading: resourcesLoading } = useQuery<{
    getResources: { data: Resource[] };
  }>(GET_RESOURCES, {
    variables: { courseId: selectedCourseId === "all" ? null : selectedCourseId },
    fetchPolicy: "cache-and-network",
  });

  const allResources = resourcesData?.getResources?.data || [];

  // Filter resources to ONLY those belonging to the student's active enrolled courses
  const studentResources = allResources.filter((r) => {
    // If the resource is global (courseId is null) or belongs to one of their active courses:
    return r.courseId === null || activeCourses.some((c) => c.id === r.courseId);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "picture_as_pdf";
      case "video":
        return "play_circle";
      case "link":
        return "link";
      case "document":
      default:
        return "description";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "pdf":
        return {
          bg: "bg-[#ffb4ab]/10 border-[#ffb4ab]/20",
          text: "text-[#ffb4ab]",
          glow: "shadow-[0_0_15px_rgba(255,180,171,0.1)]"
        };
      case "video":
        return {
          bg: "bg-[#bdc2ff]/10 border-[#bdc2ff]/20",
          text: "text-[#bdc2ff]",
          glow: "shadow-[0_0_15px_rgba(189,194,255,0.1)]"
        };
      case "link":
        return {
          bg: "bg-[#6fffd9]/10 border-[#6fffd9]/20",
          text: "text-[#6fffd9]",
          glow: "shadow-[0_0_15px_rgba(111,255,217,0.1)]"
        };
      case "document":
      default:
        return {
          bg: "bg-[#84948e]/10 border-[#3b4a44]",
          text: "text-[#dfe2eb]",
          glow: "shadow-none"
        };
    }
  };

  const isLoading = coursesLoading || resourcesLoading;

  if (isLoading && studentResources.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-[#b9cac3]">
        <span className="material-symbols-outlined animate-spin mr-3">progress_activity</span>
        Loading course resources...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Course Resources
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Access lecture slides, syllabus documents, videos, and links shared by your instructors.
          </p>
        </div>

        {activeCourses.length > 0 && (
          <div className="flex items-center gap-3 bg-[#1c2026] border border-[#3b4a44] px-4 py-2 rounded-xl shrink-0 self-start md:self-auto">
            <span className="text-xs font-semibold text-[#bdc2ff]">Select Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-transparent border-none text-xs font-headline font-bold text-[#dfe2eb] outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1c2026]">All Enrolled Courses</option>
              {activeCourses.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1c2026]">
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* --- Grid Layout --- */}
      {activeCourses.length === 0 ? (
        <div className="text-center bg-[#1c2026] border border-[#3b4a44] p-16 rounded-2xl text-[#84948e] max-w-xl mx-auto shadow-sm">
          <span className="material-symbols-outlined text-5xl mb-3 text-[#3b4a44]">menu_book</span>
          <p className="text-[#b9cac3] text-sm">You are not enrolled in any active courses.</p>
          <p className="text-xs mt-1 text-[#84948e]">Enroll in a course to view reference documents and resources.</p>
        </div>
      ) : studentResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentResources.map((res) => {
            const styles = getTypeStyles(res.type);
            const course = activeCourses.find((c) => c.id === res.courseId);
            const courseTitle = course ? course.title : "Global / Shared Reference";

            return (
              <div
                key={res.id}
                className={`bg-[#1c2026] border border-[#3b4a44] p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all hover:border-[#6fffd9] hover:bg-[#262a31]/30 relative overflow-hidden group ${styles.glow}`}
              >
                {/* Resource Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-[#10141a] border border-[#3b4a44] p-2.5 rounded-xl flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-2xl ${styles.text}`}>
                        {getIcon(res.type)}
                      </span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${styles.bg} ${styles.text}`}>
                      {res.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base md:text-lg text-[#dfe2eb] line-clamp-1" title={res.title}>
                      {res.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#bdc2ff] tracking-wide block mt-0.5 truncate">
                      {courseTitle}
                    </span>
                    <p className="text-sm text-[#b9cac3] mt-2 line-clamp-2 leading-relaxed">
                      {res.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-[#3b4a44]/55 mt-5 pt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#6fffd9] hover:underline font-semibold flex items-center gap-1 w-full justify-between"
                  >
                    <span>View / Open Material</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center bg-[#1c2026] border border-[#3b4a44] p-16 rounded-2xl text-[#84948e] max-w-xl mx-auto shadow-sm">
          <span className="material-symbols-outlined text-5xl mb-3 text-[#3b4a44]">folder_open</span>
          <p className="text-[#b9cac3] text-sm">No resources uploaded for this course yet.</p>
          <p className="text-xs mt-1 text-[#84948e]">Check back later for syllabus documents, slides, and class notes.</p>
        </div>
      )}
    </div>
  );
}
