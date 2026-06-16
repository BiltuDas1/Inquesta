import { useState, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// --- GraphQL Operations ---
const GET_ENROLLED_COURSES = gql`
  query GetEnrolledCourses {
    enrolledCourses {
      success
      message
      data {
        id
        title
        instructorName
        status
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
        date
        status
      }
    }
  }
`;

// --- Types ---
type AttendanceStatus = "Present" | "Absent";

interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
}

interface Course {
  id: string;
  title: string;
  instructorName: string;
}

export default function StudentAttendancePage() {
  // --- States for Date Filters ---
  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [tempEndDate, setTempEndDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // --- GraphQL Queries ──
  const { data: coursesData, loading: coursesLoading } = useQuery<{
    enrolledCourses: { success: boolean; message: string; data: Course[] | null };
  }>(GET_ENROLLED_COURSES);

  const { data: attendanceData, loading: attendanceLoading } = useQuery<{
    getStudentAttendance: { success: boolean; message: string; data: AttendanceRecord[] | null };
  }>(GET_STUDENT_ATTENDANCE);

  const coursesList = useMemo(
    () => (coursesData?.enrolledCourses?.data || []).filter((c: any) => c.status === "verified"),
    [coursesData],
  );
  const attendanceList = useMemo(() => attendanceData?.getStudentAttendance?.data || [], [attendanceData]);

  // --- Calculate filtered attendance for each subject ---
  const tableData = useMemo(() => {
    return coursesList.map((course: Course) => {
      // Find all records for this course
      const allCourseRecords = attendanceList.filter((r: AttendanceRecord) => r.courseId === course.id);

      // Filter by start and end dates
      const filteredRecords = allCourseRecords.filter((r: AttendanceRecord) => {
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
        return true;
      });

      const total = filteredRecords.length;
      const attended = filteredRecords.filter((r: AttendanceRecord) => r.status === "Present").length;
      const missed = total - attended;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        instructor: course.instructorName,
        filteredRecords,
        total,
        attended,
        missed,
        percentage,
      };
    });
  }, [coursesList, attendanceList, startDate, endDate]);

  // --- Overall Statistics based on current date filters ---
  const overallStats = useMemo(() => {
    let totalClasses = 0;
    let presentClasses = 0;

    tableData.forEach((sub) => {
      totalClasses += sub.total;
      presentClasses += sub.attended;
    });

    const rate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    return {
      total: totalClasses,
      present: presentClasses,
      absent: totalClasses - presentClasses,
      rate,
    };
  }, [tableData]);

  const isLoading = coursesLoading || attendanceLoading;

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb] overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8 w-full">

        {/* --- Header --- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
            My Attendance
          </h1>
          <p className="text-sm text-[#b9cac3] mt-1">
            Monitor your course attendance history and statistics
          </p>
        </div>

        {/* --- Filters & Date Pickers Panel --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Start Date */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b9cac3]">
                Start Date
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] text-sm outline-none focus:border-[#6fffd9] transition-colors"
              />
            </div>

            {/* End Date */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b9cac3]">
                End Date
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] text-sm outline-none focus:border-[#6fffd9] transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto flex gap-2">
              <button
                onClick={() => {
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                }}
                className="w-full bg-[#6fffd9] hover:bg-[#5ee6c3] text-[#10141a] font-bold text-sm px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6fffd9]/50 h-[38px] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">search</span>
                Search
              </button>
              <button
                onClick={() => {
                  setTempStartDate("");
                  setTempEndDate("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="w-full bg-[#262a31] hover:bg-[#323741] text-[#dfe2eb] border border-[#3b4a44] font-bold text-sm px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b4a44]/50 h-[38px] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">restart_alt</span>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* --- Stats Cards Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Overall Attendance</span>
            <div className="text-2xl font-headline font-bold text-[#6fffd9] mt-1">{overallStats.rate}%</div>
          </div>
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Conducted Classes</span>
            <div className="text-2xl font-headline font-bold text-[#dfe2eb] mt-1">{overallStats.total}</div>
          </div>
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Classes Attended</span>
            <div className="text-2xl font-headline font-bold text-[#6fffd9] mt-1">{overallStats.present}</div>
          </div>
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Classes Missed</span>
            <div className="text-2xl font-headline font-bold text-[#ffb4ab] mt-1">{overallStats.absent}</div>
          </div>
        </div>

        {/* --- Attendance Summary Table --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#3b4a44]">
            <h3 className="font-headline font-semibold text-base text-[#dfe2eb]">
              Attendance Overview
            </h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#6fffd9]">Loading attendance data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#181c22] border-b border-[#3b4a44]">
                    <th className="p-4 text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase w-16">
                      Sl. No.
                    </th>
                    <th className="p-4 text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase">
                      Course Name
                    </th>
                    <th className="p-4 text-center font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase">
                      Total Classes
                    </th>
                    <th className="p-4 text-center font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase text-[#6fffd9]">
                      Attended
                    </th>
                    <th className="p-4 text-center font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase text-[#ffb4ab]">
                      Missed
                    </th>
                    <th className="p-4 text-center font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]">
                  {tableData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-12 text-[#b9cac3]">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    tableData.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className="group hover:bg-[#262a31]/50 transition-colors"
                      >
                        <td className="p-4 align-middle text-sm text-[#b9cac3] font-semibold">
                          {idx + 1}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="font-headline font-semibold text-sm text-[#dfe2eb] group-hover:text-[#6fffd9] transition-colors">
                            {sub.title}
                          </div>
                          <div className="text-[11px] text-[#b9cac3] mt-0.5">
                            {sub.instructor}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-center text-sm font-semibold text-[#dfe2eb]">
                          {sub.total}
                        </td>
                        <td className="p-4 align-middle text-center text-sm font-semibold text-[#6fffd9]">
                          {sub.attended}
                        </td>
                        <td className="p-4 align-middle text-center text-sm font-semibold text-[#ffb4ab]">
                          {sub.missed}
                        </td>
                        <td className="p-4 align-middle text-center">
                          <span
                            className={`text-sm font-bold font-headline ${sub.percentage >= 75 ? "text-[#6fffd9]" : "text-[#ffb4ab]"
                              }`}
                          >
                            {sub.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
