import { useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "../../auth/context/authcontext";
import StudentCourseTable from "../components/studentscoursetable";
import type { Course } from "../../courses/types/courses";

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

const GET_STUDENT_ASSIGNMENTS = gql`
  query GetStudentAssignments {
    getStudentAssignments {
      success
      message
      data {
        id
        courseName
        assignmentTitle
        status
        score
      }
    }
  }
`;

const GET_STUDENT_ATTENDANCE = gql`
  query GetStudentAttendance {
    getStudentAttendance {
      success
      message
      data {
        id
        courseId
        status
      }
    }
  }
`;

interface EnrolledCoursesResponse {
  enrolledCourses: {
    data: Course[];
  };
}

interface StudentAssignmentGQL {
  id: string;
  courseName: string;
  assignmentTitle: string;
  status: string;
  score: number;
}

interface GetStudentAssignmentsResponse {
  getStudentAssignments: {
    data: StudentAssignmentGQL[] | null;
  };
}

interface AttendanceRecordGQL {
  id: string;
  courseId: string;
  status: string;
}

interface GetStudentAttendanceResponse {
  getStudentAttendance: {
    data: AttendanceRecordGQL[] | null;
  };
}

export default function StudentDashboardPage() {
  const { user } = useAuth();

  // 1. Fetch Enrolled Courses
  const { data: coursesData, loading: coursesLoading } =
    useQuery<EnrolledCoursesResponse>(GET_ENROLLED_COURSES, {
      fetchPolicy: "cache-and-network",
    });

  // 2. Fetch Assignments
  const { data: assignmentsData, loading: assignmentsLoading } =
    useQuery<GetStudentAssignmentsResponse>(GET_STUDENT_ASSIGNMENTS, {
      fetchPolicy: "cache-and-network",
    });

  // 3. Fetch Attendance
  const { data: attendanceData, loading: attendanceLoading } =
    useQuery<GetStudentAttendanceResponse>(GET_STUDENT_ATTENDANCE, {
      fetchPolicy: "cache-and-network",
    });

  const courses = coursesData?.enrolledCourses?.data || [];
  const assignments = assignmentsData?.getStudentAssignments?.data || [];
  const attendanceList = attendanceData?.getStudentAttendance?.data || [];

  // --- Dynamic Stats Calculations ---

  // Attendance Rate
  const attendanceStats = useMemo(() => {
    if (attendanceList.length === 0) return { percent: 100, label: "No logs yet" };
    const presentCount = attendanceList.filter((r) => r.status.toLowerCase() === "present").length;
    const rate = Math.round((presentCount / attendanceList.length) * 100);
    return {
      percent: rate,
      label: `${presentCount} of ${attendanceList.length} classes present`,
    };
  }, [attendanceList]);

  // Assignments Progress
  const assignmentStats = useMemo(() => {
    if (assignments.length === 0) return { completed: 0, total: 0, label: "No tasks assigned" };
    const completedCount = assignments.filter((a) => a.status.toLowerCase() === "completed").length;
    return {
      completed: completedCount,
      total: assignments.length,
      label: `${completedCount} of ${assignments.length} assignments finished`,
    };
  }, [assignments]);

  // Average Score / Grade
  const gradeStats = useMemo(() => {
    if (assignments.length === 0) return { avgScore: 100, letter: "A", label: "Excellent standing" };
    const totalScore = assignments.reduce((acc, a) => acc + a.score, 0);
    const avg = Math.round(totalScore / assignments.length);

    let letter = "F";
    if (avg >= 90) letter = "A";
    else if (avg >= 80) letter = "B";
    else if (avg >= 70) letter = "C";
    else if (avg >= 60) letter = "D";

    return {
      avgScore: avg,
      letter,
      label: `Overall Grade: ${letter} (${avg}%)`,
    };
  }, [assignments]);

  const stats = [
    {
      title: "Enrolled Courses",
      value: `${courses.length}`,
      subtext: courses.length === 1 ? "Active course" : "Active courses",
      icon: "menu_book",
      iconBg: "bg-[#bdc2ff]/10",
      iconColor: "text-[#bdc2ff]",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceStats.percent}%`,
      subtext: attendanceStats.label,
      icon: "co_present",
      iconBg: "bg-[#6fffd9]/10",
      iconColor: "text-[#6fffd9]",
    },
    {
      title: "Assignments",
      value: assignmentStats.total > 0 ? `${assignmentStats.completed}/${assignmentStats.total}` : "0/0",
      subtext: assignmentStats.label,
      icon: "assignment",
      iconBg: "bg-[#f59e0b]/10",
      iconColor: "text-[#f59e0b]",
    },
    {
      title: "Overall Score",
      value: `${gradeStats.avgScore}%`,
      subtext: gradeStats.label,
      icon: "grading",
      iconBg: "bg-[#ffb4ab]/10",
      iconColor: "text-[#ffb4ab]",
    },
  ];

  const isLoading = coursesLoading || assignmentsLoading || attendanceLoading;

  if (isLoading && courses.length === 0) {
    return (
      <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full flex items-center justify-center text-[#b9cac3] font-bold">
        Loading dashboard details...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 font-body bg-[#10141a] min-h-full space-y-8">
      {/* ── Welcome Header ── */}
      <div>
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb] mb-1">
          Welcome back, {user?.firstname}!
        </h1>
        <p className="text-[#b9cac3] text-sm">
          Here is your learning summary and dynamic performance report
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1c2026] p-5 rounded-2xl border border-[#3b4a44] shadow-md flex items-center gap-4 hover:bg-[#262a31]/60 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
              <span className={`material-symbols-outlined text-[26px] ${item.iconColor}`}>
                {item.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#84948e] font-semibold uppercase tracking-wider">
                {item.title}
              </p>
              <h2 className="text-2xl font-headline font-bold text-[#dfe2eb] mt-0.5">
                {item.value}
              </h2>
              <p className="text-xs text-[#b9cac3] mt-1 truncate">
                {item.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Courses Table Section ── */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#dfe2eb] font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">list_alt</span>
          My Registered Courses
        </h3>
        <StudentCourseTable courses={courses} />
      </div>
    </div>
  );
}
