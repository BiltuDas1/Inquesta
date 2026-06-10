import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";

// --- GraphQL Operations ---

const GET_ASSIGNMENT_SUBMISSIONS = gql`
  query GetAssignmentSubmissions($assignmentId: String!) {
    getAssignmentSubmissions(assignmentId: $assignmentId) {
      success
      message
      data {
        studentId
        studentName
        studentEmail
        studentPhone
        studentPhoneCountryCode
        status
        score
      }
    }
  }
`;

const UPDATE_STUDENT_SUBMISSION = gql`
  mutation UpdateStudentSubmission(
    $assignmentId: String!
    $studentId: String!
    $status: String
    $score: Int
  ) {
    updateStudentSubmission(
      assignmentId: $assignmentId
      studentId: $studentId
      status: $status
      score: $score
    ) {
      success
      message
    }
  }
`;

interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  totalSubmission: number;
  isPublished: boolean;
}

interface StudentSubmission {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  studentPhoneCountryCode: number | null;
  status: string;
  score: number;
}

interface AssignmentSubmissionsProps {
  assignment: Assignment;
  onBack: () => void;
}

interface StudentRowState {
  status: string;
  score: string;
  saving: boolean;
}

export default function AssignmentSubmissions({
  assignment,
  onBack,
}: AssignmentSubmissionsProps) {
  // Query to fetch student submissions
  const { data, loading, refetch } = useQuery<{
    getAssignmentSubmissions: { data: StudentSubmission[] };
  }>(GET_ASSIGNMENT_SUBMISSIONS, {
    variables: { assignmentId: assignment.id },
    fetchPolicy: "network-only",
  });

  const [updateSubmission] = useMutation<{
    updateStudentSubmission: { success: boolean; message: string };
  }>(UPDATE_STUDENT_SUBMISSION);

  const studentsList = data?.getAssignmentSubmissions?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = studentsList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedStudents = studentsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Track edits per student row
  const [rowStates, setRowStates] = useState<{ [key: string]: StudentRowState }>({});

  const getRowState = (student: StudentSubmission): StudentRowState => {
    if (rowStates[student.studentId]) {
      return rowStates[student.studentId];
    }
    return {
      status: student.status,
      score: String(student.score),
      saving: false,
    };
  };

  const handleRowChange = (studentId: string, field: "status" | "score", value: string) => {
    setRowStates((prev) => {
      const currentState = prev[studentId] || {
        status: "",
        score: "",
        saving: false,
      };
      // Find initial values if state not yet customized
      const student = studentsList.find((s) => s.studentId === studentId);
      const baseStatus = student ? student.status : "not started";
      const baseScore = student ? String(student.score) : "0";

      return {
        ...prev,
        [studentId]: {
          status: currentState.status || baseStatus,
          score: currentState.score || baseScore,
          saving: currentState.saving,
          [field]: value,
        },
      };
    });
  };

  const handleSaveRow = async (studentId: string) => {
    const student = studentsList.find((s) => s.studentId === studentId);
    if (!student) return;

    const currentState = getRowState(student);
    setRowStates((prev) => ({
      ...prev,
      [studentId]: { ...currentState, saving: true },
    }));

    try {
      const { data: res } = await updateSubmission({
        variables: {
          assignmentId: assignment.id,
          studentId,
          status: currentState.status,
          score: Number(currentState.score) || 0,
        },
      });

      if (res?.updateStudentSubmission?.success) {
        toast.success(`Successfully graded ${student.studentName}`);
        refetch();
      } else {
        toast.error(res?.updateStudentSubmission?.message || "Failed to update grade");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving");
    } finally {
      setRowStates((prev) => ({
        ...prev,
        [studentId]: { ...currentState, saving: false },
      }));
    }
  };

  const formatPhone = (cc: number | null, phone: string | null) => {
    if (!phone) return "—";
    return cc ? `+${cc} ${phone}` : phone;
  };


  return (
    <div className="space-y-6">
      {/* ── Sub-view Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3b4a44]/50 pb-5">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#6fffd9] hover:text-[#5cebc5] transition-colors focus:outline-none mb-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Assignments
          </button>
          <h2 className="text-xl md:text-2xl font-bold font-headline text-[#dfe2eb]">
            Grading & Submissions
          </h2>
          <p className="text-[#b9cac3] text-sm">
            Assignment: <span className="text-[#dfe2eb] font-semibold">{assignment.assignmentName}</span> (Course: {assignment.courseName})
          </p>
        </div>
      </div>

      {/* ── Students Table ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-[#6fffd9] font-medium">
              Loading student submissions...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="bg-[#181c22] text-[#b9cac3] border-b border-[#3b4a44] uppercase tracking-wider text-[0.75rem] font-bold">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6 w-[20%]">Status</th>
                  <th className="py-4 px-6 w-[15%]">Score</th>
                  <th className="py-4 px-6 text-right w-[12%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4a44]/50">
                {studentsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-[#b9cac3]">
                      No students enrolled in this course
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((row) => {
                    const rowState = getRowState(row);

                    return (
                      <tr
                        key={row.studentId}
                        className="hover:bg-[#262a31]/50 transition-colors group"
                      >
                        <td className="py-4 px-6 font-semibold text-[#dfe2eb]">
                          {row.studentName}
                        </td>
                        <td className="py-4 px-6 text-[#b9cac3]">{row.studentEmail}</td>
                        <td className="py-4 px-6 text-[#b9cac3]">
                          {formatPhone(row.studentPhoneCountryCode, row.studentPhone)}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            className="bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.75rem] py-[0.45rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9]"
                            value={rowState.status}
                            onChange={(e) => handleRowChange(row.studentId, "status", e.target.value)}
                          >
                            <option value="not started" className="bg-[#1c2026]">
                              Not Started
                            </option>
                            <option value="in progress" className="bg-[#1c2026]">
                              In Progress
                            </option>
                            <option value="completed" className="bg-[#1c2026]">
                              Submitted
                            </option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            min="0"
                            className="w-[80px] bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.75rem] py-[0.45rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9]"
                            value={rowState.score}
                            onChange={(e) => handleRowChange(row.studentId, "score", e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleSaveRow(row.studentId)}
                            disabled={rowState.saving}
                            className="bg-[#6fffd9] border-none rounded-[8px] px-4 py-1.5 text-[#00382c] font-headline font-semibold text-[0.78rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {rowState.saving ? "Saving..." : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-[#3b4a44]/50 flex items-center justify-between bg-[#1c2026]">
            <p className="text-sm text-[#84948e]">
              Showing <span className="font-semibold text-[#dfe2eb]">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
              <span className="font-semibold text-[#dfe2eb]">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-[#dfe2eb]">{totalItems}</span> results
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                      currentPage === index + 1
                        ? "bg-[#6fffd9] text-[#00382c]"
                        : "border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#3b4a44] text-[#b9cac3] hover:bg-[#262a31] hover:text-[#dfe2eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
