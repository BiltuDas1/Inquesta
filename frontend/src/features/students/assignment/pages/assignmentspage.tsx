import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import type { Assignment, AssignmentStatus } from "../components/assignmenttable";
import AssignmentTable from "../components/assignmenttable";

type FilterOption = "All" | AssignmentStatus;

// --- GraphQL Response Interfaces ---
interface StudentAssignmentGQL {
  id: string;
  courseName: string;
  assignmentTitle: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  status: string;
}

interface GetStudentAssignmentsResponseData {
  getStudentAssignments: {
    success: boolean;
    message: string;
    data: StudentAssignmentGQL[] | null;
  };
}

interface UpdateStudentAssignmentStatusResponseData {
  updateStudentAssignmentStatus: {
    success: boolean;
    message: string;
  };
}

// --- GraphQL Queries and Mutations ---

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
      }
    }
  }
`;

const UPDATE_STUDENT_ASSIGNMENT_STATUS = gql`
  mutation UpdateStudentAssignmentStatus($assignmentId: String!, $status: String!) {
    updateStudentAssignmentStatus(assignmentId: $assignmentId, status: $status) {
      success
      message
    }
  }
`;

export default function AssignmentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Fetch student assignments with type safety
  const { data, loading, refetch } = useQuery<GetStudentAssignmentsResponseData>(GET_STUDENT_ASSIGNMENTS, {
    fetchPolicy: "cache-and-network",
  });

  // Mutation to update assignment status with type safety
  const [updateStatus] = useMutation<UpdateStudentAssignmentStatusResponseData>(UPDATE_STUDENT_ASSIGNMENT_STATUS);

  const assignmentsData: Assignment[] = useMemo(() => {
    const rawData = data?.getStudentAssignments?.data || [];
    return rawData.map((item: StudentAssignmentGQL) => ({
      id: item.id,
      subject: item.courseName,
      title: item.assignmentTitle,
      description: item.assignmentDescription,
      creationDate: item.creationDate,
      dueDate: item.dueDate,
      status: item.status as AssignmentStatus,
    }));
  }, [data]);

  const filters: { value: FilterOption; label: string }[] = [
    { value: "All", label: "All" },
    { value: "not started", label: "Not Started" },
    { value: "in progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  // --- Filtering Logic ---
  const filteredAssignments = useMemo(() => {
    if (activeFilter === "All") return assignmentsData;
    return assignmentsData.filter((assignment) => assignment.status === activeFilter);
  }, [activeFilter, assignmentsData]);

  // Paginated Assignments
  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAssignments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAssignments, currentPage, itemsPerPage]);

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
    setCurrentPage(1); // reset page on filter change
  };

  // Handle status update
  const handleStatusChange = async (assignmentId: string, newStatus: AssignmentStatus) => {
    try {
      const response = await updateStatus({
        variables: {
          assignmentId,
          status: newStatus,
        },
      });

      if (response.data?.updateStudentAssignmentStatus?.success) {
        toast.success("Assignment status updated successfully!");
        refetch();
      } else {
        toast.error(
          response.data?.updateStudentAssignmentStatus?.message || "Failed to update assignment status."
        );
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating status.");
    }
  };

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb]">
      {/* --- Header Section --- */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">
          Assignments
        </h1>
        <p className="text-[#84948e] mt-1">
          All assignments — track your learning progress and updates
        </p>
      </div>

      {/* --- Filters Section --- */}
      <div className="flex flex-wrap gap-3 mb-6 shrink-0">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeFilter === filter.value
                ? "bg-[#262a31] border-[#6fffd9] text-[#6fffd9] shadow-[0_0_10px_rgba(111,255,217,0.1)]"
                : "bg-transparent border-[#3b4a44] text-[#b9cac3] hover:bg-[#1c2026] hover:text-[#dfe2eb] hover:border-[#84948e]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* --- Assignment Table / Loading / Empty states --- */}
      {loading && assignmentsData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#84948e]">
          Loading assignments...
        </div>
      ) : (
        <AssignmentTable
          assignments={paginatedAssignments}
          onStatusChange={handleStatusChange}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAssignments.length}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
