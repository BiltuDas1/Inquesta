import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// --- GraphQL Query ---

const GET_STUDENT_ASSIGNMENTS = gql`
  query GetStudentAssignments {
    getStudentAssignments {
      success
      message
      data {
        id
        courseName
        assignmentTitle
        assignmentDescription
        creationDate
        dueDate
        status
        score
      }
    }
  }
`;

interface StudentAssignmentGQL {
  id: string;
  courseName: string;
  assignmentTitle: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  status: string;
  score: number;
}

interface GetStudentAssignmentsResponse {
  getStudentAssignments: {
    success: boolean;
    message: string;
    data: StudentAssignmentGQL[] | null;
  };
}

export default function GradesPage() {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("All");

  // Fetch dynamic assignments list
  const { data, loading, error } = useQuery<GetStudentAssignmentsResponse>(GET_STUDENT_ASSIGNMENTS, {
    fetchPolicy: "cache-and-network",
  });

  const assignmentsList = data?.getStudentAssignments?.data || [];

  // 1. Group assignments by course to calculate average grades
  const courseSummaries = useMemo(() => {
    const groups: Record<string, { totalScore: number; count: number; assignments: StudentAssignmentGQL[] }> = {};

    assignmentsList.forEach((asg) => {
      if (!groups[asg.courseName]) {
        groups[asg.courseName] = { totalScore: 0, count: 0, assignments: [] };
      }
      groups[asg.courseName].totalScore += asg.score;
      groups[asg.courseName].count += 1;
      groups[asg.courseName].assignments.push(asg);
    });

    return Object.entries(groups).map(([courseName, val]) => {
      const avgScore = val.count > 0 ? Math.round(val.totalScore / val.count) : 0;

      // Determine Letter Grade
      let overallGrade = "F";
      if (avgScore >= 90) overallGrade = "A";
      else if (avgScore >= 80) overallGrade = "B";
      else if (avgScore >= 70) overallGrade = "C";
      else if (avgScore >= 60) overallGrade = "D";

      return {
        courseName,
        avgScore,
        overallGrade,
        assignmentsCount: val.count,
      };
    });
  }, [assignmentsList]);

  // 2. Filter assignments for the breakdown table
  const filteredAssignments = useMemo(() => {
    if (selectedCourseFilter === "All") return assignmentsList;
    return assignmentsList.filter((a) => a.courseName === selectedCourseFilter);
  }, [assignmentsList, selectedCourseFilter]);

  // Helpers
  const getGradeBadgeStyle = (score: number) => {
    if (score >= 90) return "bg-[#6fffd9]/10 text-[#6fffd9] border border-[#6fffd9]/20";
    if (score >= 80) return "bg-[#bdc2ff]/10 text-[#bdc2ff] border border-[#bdc2ff]/20";
    if (score >= 70) return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20";
  };

  const getScoreLetter = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20";
      case "in progress":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20";
      default:
        return "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20";
    }
  };

  if (loading && assignmentsList.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#10141a] text-[#b9cac3] font-bold">
        Loading grades report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#10141a] text-[#ffb4ab] p-6 text-center">
        <p className="bg-[#2a0d10] px-4 py-2.5 rounded-lg border border-[#ffb4ab]/20">
          Failed to load grades: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb] overflow-y-auto custom-scrollbar">
      {/* ── Header ── */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">
          Grades
        </h1>
        <p className="text-[#84948e] mt-1">
          course-wise average summary and assignment grades
        </p>
      </div>

      {assignmentsList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1c2026] border border-[#3b4a44] p-12 rounded-xl text-center">
          <span className="material-symbols-outlined text-5xl text-[#84948e] mb-3">
            analytics
          </span>
          <p className="text-[#dfe2eb] font-semibold text-lg">No graded records found</p>
          <p className="text-[#84948e] text-sm mt-1">You don't have any assignments allocated to show reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Course Overview Cards (Left 5 Cols) ── */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-headline font-bold text-[#6fffd9] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">donut_large</span>
              Course Performance Summary
            </h2>
            {courseSummaries.map((summary) => (
              <div
                key={summary.courseName}
                onClick={() => setSelectedCourseFilter(summary.courseName)}
                className={`p-5 rounded-xl border transition-all cursor-pointer select-none space-y-3 ${selectedCourseFilter === summary.courseName
                    ? "bg-[#262a31] border-[#6fffd9] shadow-[0_0_15px_rgba(111,255,217,0.08)]"
                    : "bg-[#1c2026] border-[#3b4a44] hover:border-[#84948e]"
                  }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-[#dfe2eb] text-[0.95rem]">
                      {summary.courseName}
                    </h3>
                    <p className="text-xs text-[#84948e] mt-0.5">
                      Based on {summary.assignmentsCount} assignments
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${getGradeBadgeStyle(
                      summary.avgScore
                    )}`}
                  >
                    {summary.overallGrade}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#b9cac3]">
                    <span>Average Score</span>
                    <span className="font-bold">{summary.avgScore}%</span>
                  </div>
                  <div className="w-full bg-[#10141a] h-2 rounded-full overflow-hidden border border-[#3b4a44]/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-[#00e5bc] to-[#6fffd9]`}
                      style={{ width: `${summary.avgScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Assignments Grades Breakdown (Right 7 Cols) ── */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h2 className="text-lg font-headline font-bold text-[#dfe2eb] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">assignment</span>
                Assignment Wise Breakdown
              </h2>

              {/* Course Selector Filter */}
              <div className="flex items-center gap-2 bg-[#1c2026] border border-[#3b4a44] px-3.5 py-1.5 rounded-lg">
                <span className="text-xs text-[#bdc2ff] font-semibold">Filter:</span>
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-headline font-bold text-[#dfe2eb] outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#1c2026]">All Courses</option>
                  {courseSummaries.map((s) => (
                    <option key={s.courseName} value={s.courseName} className="bg-[#1c2026]">
                      {s.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#3b4a44] bg-[#1c2026] shadow-md">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#262a31] border-b border-[#3b4a44]">
                    <th className="py-3 px-4 font-headline font-semibold text-xs text-[#dfe2eb] uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="py-3 px-4 font-headline font-semibold text-xs text-[#dfe2eb] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 font-headline font-semibold text-xs text-[#dfe2eb] uppercase tracking-wider text-center">
                      Score
                    </th>
                    <th className="py-3 px-4 font-headline font-semibold text-xs text-[#dfe2eb] uppercase tracking-wider text-center">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]/40">
                  {filteredAssignments.map((asg) => (
                    <tr key={asg.id} className="hover:bg-[#262a31]/20 transition-colors">
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <p className="text-[#dfe2eb] font-medium text-[0.875rem] leading-tight">
                          {asg.assignmentTitle}
                        </p>
                        <p className="text-[0.75rem] text-[#84948e] mt-1 font-light">
                          {asg.courseName}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(asg.status)}`}>
                          {asg.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-[#dfe2eb] text-sm">
                        {asg.score} / 100
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 py-0.5 rounded-full text-[11px] font-bold ${getGradeBadgeStyle(asg.score)}`}>
                          {getScoreLetter(asg.score)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
