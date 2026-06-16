import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/context/authcontext";

const GET_TEACHER_COURSES = gql`
  query GetTeacherCourses {
    getTeacherCourses {
      success
      message
      data {
        id
        title
        level
      }
    }
  }
`;

const GET_TEACHER_ASSIGNMENTS = gql`
  query GetTeacherAssignments {
    getTeacherAssignments {
      success
      message
      data {
        id
        courseName
        assignmentName
        creationDate
        dueDate
        totalSubmission
        isPublished
      }
    }
  }
`;

interface Course {
  id: string;
  title: string;
  level: string;
}

interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  creationDate: string;
  dueDate: string | null;
  totalSubmission: number;
  isPublished: boolean;
}

interface TeacherCoursesData {
  getTeacherCourses: {
    success: boolean;
    data: Course[];
  };
}

interface TeacherAssignmentsData {
  getTeacherAssignments: {
    success: boolean;
    data: Assignment[];
  };
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: coursesData, loading: coursesLoading } = useQuery<TeacherCoursesData>(GET_TEACHER_COURSES, {
    fetchPolicy: "cache-and-network",
  });

  const { data: assignmentsData, loading: assignmentsLoading } = useQuery<TeacherAssignmentsData>(GET_TEACHER_ASSIGNMENTS, {
    fetchPolicy: "cache-and-network",
  });

  const coursesList = coursesData?.getTeacherCourses?.data || [];
  const assignmentsList = assignmentsData?.getTeacherAssignments?.data || [];

  // Calculate stats
  const totalCourses = coursesList.length;
  const totalAssignments = assignmentsList.length;
  const totalSubmissions = assignmentsList.reduce((sum, item) => sum + (item.totalSubmission || 0), 0);
  const activeAssignments = assignmentsList.filter(item => item.isPublished).length;

  const isLoading = coursesLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold text-xl">
        <span className="material-symbols-outlined animate-spin mr-3">
          progress_activity
        </span>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Welcome back, {user?.firstname || "Teacher"} 👋🏼
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          You have {totalCourses} allocated course{totalCourses !== 1 ? "s" : ""} and {totalSubmissions} student submission{totalSubmissions !== 1 ? "s" : ""} to manage.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Allocated Courses",
            value: totalCourses,
            subtext: "Active teaching programs",
            icon: "book",
            link: "/teacher/curriculum"
          },
          {
            label: "Total Assignments",
            value: totalAssignments,
            subtext: "Tasks created",
            icon: "assignment",
            link: "/teacher/assignments"
          },
          {
            label: "Total Submissions",
            value: totalSubmissions,
            subtext: "Awaiting grading",
            icon: "school",
            link: "/teacher/assignments"
          },
          {
            label: "Active Assignments",
            value: activeAssignments,
            subtext: "Currently published",
            icon: "published_with_changes",
            link: "/teacher/assignments"
          }
        ].map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex items-center justify-between shadow-sm transition-all hover:border-[#6fffd9] hover:bg-[#262a31]/50 group"
          >
            <div className="flex flex-col">
              <span className="text-[#b9cac3] text-sm font-medium">
                {stat.label}
              </span>
              <span className="text-3xl font-bold text-[#dfe2eb] mt-2 group-hover:text-[#6fffd9] transition-colors">
                {stat.value}
              </span>
              <span className="text-[#84948e] text-xs mt-1">{stat.subtext}</span>
            </div>
            <span className="material-symbols-outlined text-3xl text-[#3b4a44] group-hover:text-[#6fffd9] transition-colors shrink-0">
              {stat.icon}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocated Courses List (Span 2) */}
        <div className="lg:col-span-2 bg-[#1c2026] border border-[#3b4a44] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-[#3b4a44]/50 mb-4">
            <h2 className="text-[#dfe2eb] text-lg font-bold font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6fffd9]">menu_book</span>
              My Allocated Courses
            </h2>
            <Link to="/teacher/curriculum" className="text-xs text-[#bdc2ff] hover:text-[#a8afff] font-semibold flex items-center gap-1">
              Curriculum Manager <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>

          {coursesList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <span className="material-symbols-outlined text-5xl text-[#3b4a44] mb-3">auto_stories</span>
              <p className="text-[#b9cac3] text-sm">No courses currently allocated to you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursesList.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#10141a]/40 p-4 rounded-xl border border-[#3b4a44]/50 flex flex-wrap items-center justify-between gap-4 hover:border-[#84948e]/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#dfe2eb] truncate text-base">{course.title}</h3>
                    <p className="text-[#84948e] text-xs mt-1">Level: {course.level || "All Levels"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/teacher/attendance", { state: { selectCourseId: course.id } })}
                      className="text-xs bg-[#262a31] hover:bg-[#343d96]/30 text-[#bdc2ff] border border-[#3b4a44] font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">co_present</span>
                      Attendance
                    </button>
                    <button
                      onClick={() => navigate("/teacher/curriculum", { state: { selectCourseId: course.id } })}
                      className="text-xs bg-[#262a31] hover:bg-[#6fffd9]/15 text-[#6fffd9] border border-[#3b4a44] font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      Syllabus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Assignments (Span 1) */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-[#3b4a44]/50 mb-4">
            <h2 className="text-[#dfe2eb] text-lg font-bold font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6fffd9]">assignment_late</span>
              Recent Assignments
            </h2>
            <Link to="/teacher/assignments" className="text-xs text-[#bdc2ff] hover:text-[#a8afff] font-semibold">
              View All
            </Link>
          </div>

          {assignmentsList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <span className="material-symbols-outlined text-5xl text-[#3b4a44] mb-3">assignment</span>
              <p className="text-[#b9cac3] text-sm">No assignments created yet.</p>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-[#3b4a44]/30 space-y-3">
              {assignmentsList.slice(0, 4).map((assignment) => (
                <div key={assignment.id} className="pt-3 first:pt-0 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="text-[#dfe2eb] font-semibold block text-sm truncate">
                        {assignment.assignmentName}
                      </span>
                      <span className="text-[#84948e] text-xs block truncate mt-0.5">
                        {assignment.courseName}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider shrink-0 border ${
                        assignment.isPublished
                          ? "bg-[#6fffd9]/10 text-[#6fffd9] border-[#6fffd9]/20"
                          : "bg-[#84948e]/10 text-[#84948e] border-[#3b4a44]"
                      }`}
                    >
                      {assignment.isPublished ? "Active" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#b9cac3] mt-2">
                    <span>Submissions: <strong className="text-[#dfe2eb]">{assignment.totalSubmission || 0}</strong></span>
                    {assignment.dueDate && (
                      <span className="text-xs text-[#ffb4ab]">
                        Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
