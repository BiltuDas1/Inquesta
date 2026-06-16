import { useState, useMemo, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";

// --- GraphQL Operations ---
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

const GET_COURSE_STUDENTS = gql`
  query GetCourseStudents($courseId: String!) {
    getCourseStudents(courseId: $courseId) {
      success
      message
      data {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

const SUBMIT_ATTENDANCE = gql`
  mutation SubmitAttendance($courseId: String!, $date: String!, $records: [AttendanceRecordInput!]!) {
    submitAttendance(courseId: $courseId, date: $date, records: $records) {
      success
      message
    }
  }
`;

// --- Types ---
type AttendanceStatus = "Present" | "Absent";

interface Student {
  id: string;
  firstname: string;
  lastname?: string | null;
  email: string;
}

interface Course {
  id: string;
  title: string;
  level: string;
}

export default function TeacherAttendancePage() {
  // --- States ---
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  // Track attendance status
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({});

  // ── GraphQL Queries ──
  
  // 1. Fetch Teacher Courses
  const { data: coursesData, loading: coursesLoading } = useQuery<{
    getTeacherCourses: { success: boolean; message: string; data: Course[] | null };
  }>(GET_TEACHER_COURSES);

  const coursesList = useMemo(() => coursesData?.getTeacherCourses?.data || [], [coursesData]);

  // Set initial selected course when list loads
  useEffect(() => {
    if (coursesList.length > 0 && !selectedCourseId) {
      setSelectedCourseId(coursesList[0].id);
    }
  }, [coursesList, selectedCourseId]);

  // 2. Fetch Course Students
  const { data: studentsData, loading: studentsLoading } = useQuery<{
    getCourseStudents: { success: boolean; message: string; data: Student[] | null };
  }>(GET_COURSE_STUDENTS, {
    variables: { courseId: selectedCourseId },
    skip: !selectedCourseId,
  });

  const studentsList = useMemo(() => studentsData?.getCourseStudents?.data || [], [studentsData]);

  // When students list changes, reset student attendance states to default "Present"
  useEffect(() => {
    const newState: Record<string, AttendanceStatus> = {};
    studentsList.forEach((student: Student) => {
      newState[student.id] = "Present";
    });
    setAttendanceState(newState);
  }, [studentsList]);

  // 3. Submit Attendance Mutation
  const [submitAttendanceMutation, { loading: isSubmitting }] = useMutation<{
    submitAttendance: { success: boolean; message: string };
  }>(SUBMIT_ATTENDANCE);

  // Toggle single student's status between Present and Absent
  const handleToggleStatus = (studentId: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  // Bulk actions
  const markAllStatus = (status: AttendanceStatus) => {
    const newState: Record<string, AttendanceStatus> = {};
    studentsList.forEach((student: Student) => {
      newState[student.id] = status;
    });
    setAttendanceState(newState);
    toast.success(`Marked all as ${status}`);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = studentsList.length;
    let present = 0;
    let absent = 0;

    studentsList.forEach((student: Student) => {
      const status = attendanceState[student.id] || "Present";
      if (status === "Present") present++;
      else if (status === "Absent") absent++;
    });

    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, rate };
  }, [studentsList, attendanceState]);

  // Submit attendance
  const handleSubmit = async () => {
    if (!selectedCourseId) return;

    const records = Object.entries(attendanceState).map(([userId, status]) => ({
      userId,
      status,
    }));

    try {
      const { data } = await submitAttendanceMutation({
        variables: {
          courseId: selectedCourseId,
          date: selectedDate,
          records,
        },
      });

      if (data?.submitAttendance?.success) {
        toast.success("Attendance submitted successfully!");
      } else {
        toast.error(data?.submitAttendance?.message || "Failed to submit attendance.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred while submitting attendance.");
    }
  };

  // Helper to format student full name
  const getFullName = (student: Student) => {
    return `${student.firstname} ${student.lastname || ""}`.trim();
  };

  return (
    <div className="min-h-screen bg-[#10141a] p-4 md:p-6 lg:p-8 font-body text-[#dfe2eb]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- Header Section (Contains Submit Button) --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
              Student Attendance
            </h1>
            <p className="text-sm text-[#b9cac3] mt-1">
              Click on a student's card to toggle their attendance status.
            </p>
          </div>

          {/* Submit Button Top Right */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || studentsList.length === 0}
            className="px-6 py-2.5 rounded-lg bg-[#6fffd9] text-[#00382c] font-headline font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-[#00382c] border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              "Submit Attendance"
            )}
          </button>
        </div>

        {/* --- Filters & Selection Panel --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b9cac3]">
                Select Class / Course
              </label>
              {coursesLoading ? (
                <div className="text-sm text-[#6fffd9] py-2">Loading courses...</div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] text-sm outline-none cursor-pointer focus:border-[#6fffd9] transition-colors"
                >
                  {coursesList.map((course: Course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.level})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b9cac3]">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3b4a44] rounded-lg px-3 py-2 text-[#dfe2eb] text-sm outline-none focus:border-[#6fffd9] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Total Students</span>
            <div className="text-2xl font-headline font-bold text-[#dfe2eb] mt-1">{stats.total}</div>
          </div>

          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Present Today</span>
            <div className="text-2xl font-headline font-bold text-[#6fffd9] mt-1">{stats.present}</div>
          </div>

          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Absent Today</span>
            <div className="text-2xl font-headline font-bold text-[#ffb4ab] mt-1">{stats.absent}</div>
          </div>

          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-4 text-center">
            <span className="text-xs text-[#b9cac3] font-medium">Attendance Rate</span>
            <div className="text-2xl font-headline font-bold text-[#6fffd9] mt-1">{stats.rate}%</div>
          </div>
        </div>

        {/* --- Main Attendance Grid --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          
          {/* Grid Header (Contains Bulk Actions & Legend) */}
          <div className="px-6 py-4 border-b border-[#3b4a44] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="font-headline font-semibold text-base text-[#dfe2eb]">
                Enrolled Students ({studentsList.length})
              </h3>
              
              {/* Remarks Legend */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-[#b9cac3] ml-2 border-l border-[#3b4a44] pl-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6fffd9] shadow-[0_0_8px_rgba(111,255,217,0.4)]"></span> Present
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.4)]"></span> Absent
                </span>
              </div>
            </div>

            {/* Quick Bulk Actions Above Grid */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => markAllStatus("Present")}
                disabled={studentsList.length === 0}
                className="px-3 py-1.5 rounded-lg border border-[#3b4a44] bg-[#10141a] hover:bg-[#1f2a24] text-xs font-semibold text-[#6fffd9] transition-colors disabled:opacity-50"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAllStatus("Absent")}
                disabled={studentsList.length === 0}
                className="px-3 py-1.5 rounded-lg border border-[#3b4a44] bg-[#10141a] hover:bg-[#2a1b1b] text-xs font-semibold text-[#ffb4ab] transition-colors disabled:opacity-50"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {/* Interactive Grid Layout */}
          {studentsLoading ? (
            <div className="p-12 text-center text-[#6fffd9]">Loading student list...</div>
          ) : (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {studentsList.length === 0 ? (
                <div className="col-span-full text-center py-12 text-[#b9cac3]">
                  No students enrolled in this course
                </div>
              ) : (
                studentsList.map((student: Student) => {
                  const isPresent = (attendanceState[student.id] || "Present") === "Present";
                  
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleToggleStatus(student.id)}
                      className={`h-24 p-3 rounded-md flex flex-col justify-start items-start text-left transition-all duration-200 border ${
                        isPresent 
                          ? "bg-[#0d2b20] border-[#195c43] text-[#dfe2eb] shadow-md hover:bg-[#113a2b]"  // Green styling
                          : "bg-[#331414] border-[#7a2a2a] text-[#ffb4ab] shadow-sm hover:bg-[#451b1b]"  // Red styling
                      }`}
                    >
                      <span className="font-semibold text-sm leading-tight block w-full truncate">
                        {getFullName(student)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}