import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/context/authcontext";

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
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsAssignment, setStatsAssignment] = useState<Assignment | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    isPublished: false,
  });

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

  const handleOpenCreate = () => {
    setFormData({
      courseId: myCourses[0]?.courseId || "",
      title: "",
      description: "",
      dueDate: "",
      isPublished: false,
    });
    setModalOpen("create");
  };

  const handleOpenEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      courseId: "", // Update mutation doesn't change courseId
      title: assignment.assignmentName,
      description: assignment.assignmentDescription,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split("T")[0] : "",
      isPublished: assignment.isPublished,
    });
    setModalOpen("edit");
  };

  const handleOpenStats = (assignment: Assignment) => {
    setStatsAssignment(assignment);
    setStatsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const { data } = await deleteAssignment({ variables: { id } });
        if (data?.deleteAssignment?.success) {
          toast.success("Assignment deleted successfully");
          refetchAssignments();
        } else {
          toast.error(data?.deleteAssignment?.message || "Failed to delete assignment");
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e] disabled:opacity-50";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

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

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap items-center gap-3">
        {["All", "Published", "Draft"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
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

      {/* ── Table ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-4">
        <div className="overflow-x-auto custom-scrollbar">
          {assignmentsLoading ? (
            <div className="text-center py-12 text-[#6fffd9] font-medium">
              Loading assignments...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="bg-[#181c22] text-[#b9cac3] border-b border-[#3b4a44] uppercase tracking-wider text-[0.75rem] font-bold">
                  <th className="py-4 px-6">Course Name</th>
                  <th className="py-4 px-6">Assignment Title</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4a44]/50">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-[#b9cac3]">
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#262a31]/50 transition-colors group"
                    >
                      <td className="py-4 px-6 font-semibold text-[#dfe2eb]">
                        {row.courseName}
                      </td>
                      <td className="py-4 px-6 text-[#dfe2eb] font-medium">
                        {row.assignmentName}
                      </td>
                      <td className="py-4 px-6 text-[#b9cac3]">
                        {formatDate(row.creationDate)}
                      </td>
                      <td className="py-4 px-6 text-[#b9cac3]">
                        {formatDate(row.dueDate)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-bold ${
                            row.isPublished
                              ? "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"
                              : "bg-[#84948e]/10 text-[#84948e] border border-[#84948e]/20"
                          }`}
                        >
                          {row.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenStats(row)}
                            className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#6fffd9] cursor-pointer hover:bg-[#6fffd9]/10 transition-colors"
                          >
                            Statistic
                          </button>
                          <button
                            onClick={() => handleOpenEdit(row)}
                            disabled={row.isPublished}
                            className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#3b4a44]/50 transition-colors disabled:opacity-40"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[12px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#ffb4ab]/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {modalOpen !== null && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(null)}
        >
          <div
            className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[600px] max-h-[90vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible font-body shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
              {modalOpen === "create" ? "Create Assignment" : "Edit Assignment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalOpen === "create" && (
                <div>
                  <label className={labelClass}>Course *</label>
                  <select
                    className={inputClass}
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    required
                  >
                    {myCourses.map((c) => (
                      <option key={c.courseId} value={c.courseId} className="bg-[#1c2026]">
                        {c.courseTitle}
                      </option>
                    ))}
                    {myCourses.length === 0 && (
                      <option value="" className="bg-[#1c2026]">
                        No courses allocated to you
                      </option>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Assignment Title *</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Geometry Homework - Circles"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the tasks and requirements..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Due Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  className="w-4 h-4 rounded border-[#3b4a44] bg-[#262a31] text-[#6fffd9] focus:ring-0 cursor-pointer"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <label htmlFor="isPublished" className="text-[#dfe2eb] text-sm cursor-pointer select-none">
                  Publish assignment immediately (Draft if unchecked)
                </label>
              </div>

              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
                <button
                  type="button"
                  onClick={() => setModalOpen(null)}
                  className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:bg-[#3b4a44]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading || updateLoading || (modalOpen === "create" && myCourses.length === 0)}
                  className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {addLoading || updateLoading ? "Saving..." : modalOpen === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STATS MODAL ── */}
      {statsModalOpen && statsAssignment && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setStatsModalOpen(false)}
        >
          <div
            className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[450px] max-h-[90vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible font-body shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb]">
                Assignment Statistics
              </h2>
              <p className="text-[#b9cac3] text-sm mt-1">
                {statsAssignment.assignmentName}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#262a31] border border-[#3b4a44] p-5 rounded-xl flex flex-col justify-between">
                <span className="text-[#b9cac3] text-xs font-semibold uppercase tracking-wider">
                  Total Submissions
                </span>
                <span className="text-4xl font-bold text-[#6fffd9] my-2">
                  {statsAssignment.totalSubmission}
                </span>
                <span className="text-[#84948e] text-xs">
                  Submitted by students of {statsAssignment.courseName}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStatsModalOpen(false)}
                className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
