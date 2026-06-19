import { useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router";
import { useAuth } from "../../auth/context/authcontext";
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
        status
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

const GET_TIMETABLE = gql`
  query GetTimetable {
    getTimetable {
      success
      message
      data {
        id
        subject
        day
        startHour
        durationHours
        room
        colorClass
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
        completed
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

interface TimetableEntryGQL {
  id: string;
  subject: string;
  day: string;
  startHour: number;
  durationHours: number;
  room?: string | null;
  colorClass?: string | null;
}

interface GetTimetableResponse {
  getTimetable: {
    success: boolean;
    message: string;
    data: TimetableEntryGQL[] | null;
  };
}

interface UnitRecordGQL {
  id: string;
  completed: boolean;
}

interface GetCurriculumUnitsResponse {
  getCurriculumUnits: {
    success: boolean;
    message: string;
    data: UnitRecordGQL[] | null;
  };
}

// ── Subcomponent to fetch curriculum units per course and render progress ──
function CourseProgressCard({ course }: { course: Course }) {
  const { data, loading } = useQuery<GetCurriculumUnitsResponse>(GET_CURRICULUM_UNITS, {
    variables: { courseId: course.id },
    fetchPolicy: "cache-and-network",
  });

  const unitsList = data?.getCurriculumUnits?.data || [];
  const totalUnits = unitsList.length;
  const completedUnits = unitsList.filter((u: any) => u.completed).length;
  const progressPercent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  if (loading && unitsList.length === 0) {
    return (
      <div className="bg-[#1c2026] border border-[#3b4a44] p-4 rounded-xl flex items-center justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-[#262a31]/50 rounded w-28"></div>
          <div className="h-3 bg-[#262a31]/50 rounded w-20"></div>
        </div>
        <div className="w-10 h-4 bg-[#262a31]/50 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#10141a]/60 border border-[#3b4a44]/60 p-4 rounded-xl flex flex-col gap-3 hover:bg-[#262a31]/50 hover:border-[#3b4a44] transition-all duration-200">
      <div className="flex justify-between items-center gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-headline font-bold text-[#dfe2eb] text-sm truncate" title={course.title}>
            {course.title}
          </h4>
          <p className="text-xs text-[#84948e] mt-0.5">
            {completedUnits} of {totalUnits} units completed
          </p>
        </div>
        <span className="text-sm font-headline font-bold text-[#6fffd9] shrink-0">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1c2026] h-2 rounded-full overflow-hidden border border-[#3b4a44]/45">
        <div
          className="bg-gradient-to-r from-[#00e5bc] to-[#6fffd9] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(111,255,217,0.25)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
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

  // 4. Fetch Timetable
  const { data: timetableData, loading: timetableLoading } =
    useQuery<GetTimetableResponse>(GET_TIMETABLE, {
      fetchPolicy: "cache-and-network",
    });

  const allCourses = coursesData?.enrolledCourses?.data || [];
  const assignments = assignmentsData?.getStudentAssignments?.data || [];
  const attendanceList = attendanceData?.getStudentAttendance?.data || [];
  const timetableList = timetableData?.getTimetable?.data || [];

  // Filter for verified (active) courses
  const verifiedCourses = useMemo(() => {
    return allCourses.filter((c: any) => c.status === "verified");
  }, [allCourses]);

  // Filter today's classes
  const todayClasses = useMemo(() => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = dayNames[new Date().getDay()];
    
    const filtered = timetableList.filter((item) => item.day.toLowerCase() === todayName.toLowerCase());
    return [...filtered].sort((a, b) => a.startHour - b.startHour);
  }, [timetableList]);

  // Attendance Rate
  const attendanceStats = useMemo(() => {
    if (attendanceList.length === 0) return { percent: 0, label: "No logs yet" };
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
    if (assignments.length === 0) return { avgScore: 0, letter: "N/A", label: "No assignments graded yet" };
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
      value: `${verifiedCourses.length}`,
      subtext: verifiedCourses.length === 1 ? "Active course" : "Active courses",
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

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${formattedHour} ${ampm}`;
  };

  const isLoading = coursesLoading || assignmentsLoading || attendanceLoading || timetableLoading;

  if (isLoading && allCourses.length === 0) {
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
            className="bg-[#1c2026] p-5 rounded-2xl border border-[#3b4a44] shadow-md flex items-center gap-4 hover:bg-[#262a31]/60 transition-all duration-300"
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

      {/* ── Dashboard Content Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Today's Classes & Course Completion Progress (7/12 width) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Today's Schedule Card */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#dfe2eb] font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#bdc2ff]">calendar_today</span>
                Today's Classes
              </h3>
              <Link
                to="/students/schedule"
                className="text-xs font-semibold text-[#6fffd9] hover:underline flex items-center gap-0.5 transition-colors"
              >
                Full Timetable <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayClasses.length > 0 ? (
                todayClasses.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#10141a]/60 border border-[#3b4a44]/60 hover:bg-[#262a31]/50 hover:border-[#3b4a44] p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 group relative overflow-hidden"
                  >
                    {/* Left accent color strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.colorClass?.split(" ")[0] || "bg-[#1e619b]"}`} />
                    <div className="pl-2">
                      <h4 className="font-headline font-bold text-[#dfe2eb] text-sm leading-snug truncate max-w-[140px] sm:max-w-[180px]">
                        {item.subject}
                      </h4>
                      <p className="text-[11px] text-[#84948e] mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {formatHour(item.startHour)} ({item.durationHours} {item.durationHours === 1 ? "hr" : "hrs"})
                      </p>
                    </div>
                    {item.room && (
                      <div className="bg-[#1c2026] text-[#bdc2ff] border border-[#3b4a44]/80 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0">
                        R-{item.room}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-[#10141a]/40 border border-[#3b4a44]/40 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                  <span className="material-symbols-outlined text-3xl text-[#84948e] opacity-60">weekend</span>
                  <div>
                    <h4 className="font-headline font-bold text-[#dfe2eb] text-sm">
                      Rest Day / Weekend
                    </h4>
                    <p className="text-xs text-[#84948e] mt-1">
                      No classes scheduled for today. Rest up or review your notes!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Syllabus Course Completion Progress Widget */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#dfe2eb] font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#6fffd9]">analytics</span>
                Syllabus Completion
              </h3>
              <Link
                to="/students/course-report"
                className="text-xs font-semibold text-[#6fffd9] hover:underline flex items-center gap-0.5 transition-colors"
              >
                View Reports <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedCourses.length > 0 ? (
                verifiedCourses.map((course) => (
                  <CourseProgressCard key={course.id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-[#10141a]/40 border border-[#3b4a44]/40 rounded-xl text-[#84948e] text-xs italic">
                  You are not enrolled in any active courses yet.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recent Assignments Panel (5/12 width) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Assignments Panel */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-2xl p-6 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#dfe2eb] font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#f59e0b]">assignment</span>
                Assignments & Tasks
              </h3>
              <Link
                to="/students/assignments"
                className="text-xs font-semibold text-[#6fffd9] hover:underline flex items-center gap-0.5 transition-colors"
              >
                View All <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>

            <div className="space-y-3">
              {assignments.length > 0 ? (
                assignments.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#10141a]/60 border border-[#3b4a44]/60 hover:bg-[#262a31]/50 hover:border-[#3b4a44] p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline font-bold text-[#dfe2eb] text-sm truncate" title={item.assignmentTitle}>
                        {item.assignmentTitle}
                      </h4>
                      <p className="text-xs text-[#84948e] mt-1 truncate">
                        {item.courseName}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 shrink-0">
                      {item.status.toLowerCase() === "completed" ? (
                        <div className="flex flex-col items-end">
                          <span className="bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Done
                          </span>
                          {item.score !== null && (
                            <span className="text-[11px] text-[#dfe2eb] font-semibold mt-1">
                              {item.score}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-[#10141a]/40 border border-[#3b4a44]/40 rounded-xl text-[#84948e] text-xs italic">
                  No assignments created yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
