import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/context/authcontext";
import AddAssignmentModal from "../../../components/teacher/assignments/addassignmentmodal";
import AssignmentTable from "../../../components/teacher/assignments/assignmenttable";
import DeleteConfirmationModal from "../../../components/ui/dialog";
import AssignmentSubmissions from "../../../components/teacher/assignments/assignmentsubmissions";

import { NumberedCursorPagination } from "../../../shared/components/cursorpagination";

// --- GraphQL Queries and Mutations ---

const GET_TEACHER_ASSIGNMENTS = gql`
  query GetTeacherAssignments {
    getTeacherAssignments {
      success
      message
      data {
        id
        courseName
        assignmentName
        assignmentDescription
        creationDate
        dueDate
        totalSubmission
        isPublished
      }
    }
  }
`;

const GET_TEACHER_ALLOCATED_COURSES = gql`
  query GetTeacherAllocatedCourses {
    getTeacherAllocatedCourses {
      success
      message
      data {
        courseId
        courseTitle
        teacherId
        teacherEmail
      }
    }
  }
`;

const ADD_ASSIGNMENT = gql`
  mutation AddAssignment(
    $courseId: String!
    $title: String!
    $description: String!
    $dueDate: String
    $isPublished: Boolean
  ) {
    addAssignment(
      courseId: $courseId
      title: $title
      description: $description
      dueDate: $dueDate
      isPublished: $isPublished
    ) {
      success
      message
    }
  }
`;

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment(
    $id: String!
    $title: String
    $description: String
    $dueDate: String
    $isPublished: Boolean
  ) {
    updateAssignment(
      id: $id
      title: $title
      description: $description
      dueDate: $dueDate
      isPublished: $isPublished
    ) {
      success
      message
    }
  }
`;

const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: String!) {
    deleteAssignment(id: $id) {
      success
      message
    }
  }
`;

// --- Interfaces ---

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

interface Course {
  courseId: string;
  courseTitle: string;
  teacherId: string | null;
  teacherEmail: string | null;
}

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeView, setActiveView] = useState<"list" | "submissions">("list");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Queries
  const {
    data: assignmentsData,
    loading: assignmentsLoading,
    refetch: refetchAssignments,
  } = useQuery<{ getTeacherAssignments: { data: Assignment[] } }>(GET_TEACHER_ASSIGNMENTS, {
    fetchPolicy: "cache-and-network",
  });

  const { data: coursesData } = useQuery<{ getTeacherAllocatedCourses: { data: Course[] } }>(GET_TEACHER_ALLOCATED_COURSES);

  // Mutations
  const [addAssignment, { loading: addLoading }] = useMutation<{ addAssignment: { success: boolean; message: string } }>(ADD_ASSIGNMENT);
  const [updateAssignment, { loading: updateLoading }] = useMutation<{ updateAssignment: { success: boolean; message: string } }>(UPDATE_ASSIGNMENT);
  const [deleteAssignment] = useMutation<{ deleteAssignment: { success: boolean; message: string } }>(DELETE_ASSIGNMENT);

  const teacherEmail = user?.email;
  const rawCourses: Course[] = coursesData?.getTeacherAllocatedCourses?.data || [];
  // Filter courses allocated to the current teacher by email
  const myCourses = rawCourses.filter((c) => c.teacherEmail === teacherEmail);

  const assignmentsList: Assignment[] = assignmentsData?.getTeacherAssignments?.data || [];

  // Filter handlers
  const filteredAssignments = assignmentsList.filter((a) => {
    if (activeFilter === "Published") return a.isPublished;
    if (activeFilter === "Draft") return !a.isPublished;
    return true;
  });

  // Filter by search query
  const searchedAssignments = filteredAssignments.filter((a) => {
    const matchSearch =
      a.assignmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalItems = searchedAssignments.length;
  const hasNextPage = currentPage * itemsPerPage < totalItems;
  const hasPreviousPage = currentPage > 1;

  const paginatedAssignments = searchedAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedAssignment(null);
    setModalOpen("create");
  };

  const handleOpenEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setModalOpen("edit");
  };

  const handleOpenStats = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setActiveView("submissions");
  };

  const handleDeleteClick = (id: string) => {
    const ass = assignmentsList.find((a) => a.id === id);
    if (ass) {
      setDeleteTarget({ id: ass.id, name: ass.assignmentName });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { data } = await deleteAssignment({ variables: { id: deleteTarget.id } });
      if (data?.deleteAssignment?.success) {
        toast.success("Assignment deleted successfully");
        refetchAssignments();
      } else {
        toast.error(data?.deleteAssignment?.message || "Failed to delete assignment");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (modalOpen === "create") {
        const { data } = await addAssignment({
          variables: {
            courseId: formData.courseId || myCourses[0]?.courseId,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            isPublished: formData.isPublished,
          },
        });
        if (data?.addAssignment?.success) {
          toast.success("Assignment created successfully");
          setModalOpen(null);
          refetchAssignments();
        } else {
          toast.error(data?.addAssignment?.message || "Failed to create assignment");
        }
      } else if (modalOpen === "edit" && selectedAssignment) {
        const { data } = await updateAssignment({
          variables: {
            id: selectedAssignment.id,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            isPublished: formData.isPublished,
          },
        });
        if (data?.updateAssignment?.success) {
          toast.success("Assignment updated successfully");
          setModalOpen(null);
          refetchAssignments();
        } else {
          toast.error(data?.updateAssignment?.message || "Failed to update assignment");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  if (activeView === "submissions" && selectedAssignment) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
        <AssignmentSubmissions
          assignment={selectedAssignment}
          onBack={() => {
            setActiveView("list");
            setSelectedAssignment(null);
            refetchAssignments();
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Assignments
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Manage, create, and view statistics for class assignments
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex border gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[1.1rem]">add</span> Create new assignment
        </button>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="flex flex-wrap gap-4 items-center justify-between mt-4">
        <div className="flex flex-wrap items-center gap-3">
          {["All", "Published", "Draft"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? "bg-[#262a31] text-[#6fffd9] border border-[#6fffd9]/30"
                  : "bg-[#1c2026] text-[#b9cac3] border border-[#3b4a44] hover:bg-[#262a31] hover:text-[#dfe2eb]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[300px]">
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search assignments or courses..."
            className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <AssignmentTable
        assignments={paginatedAssignments}
        loading={assignmentsLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        onShowStats={handleOpenStats}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />

      {/* ── CREATE / EDIT MODAL ── */}
      {modalOpen !== null && (
        <AddAssignmentModal
          editing={selectedAssignment}
          onClose={() => setModalOpen(null)}
          onSave={handleSave}
          isSubmitting={addLoading || updateLoading}
          courses={myCourses}
        />
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment?"
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
