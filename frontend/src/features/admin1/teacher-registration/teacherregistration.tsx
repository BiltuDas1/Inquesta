import React, { useState, useMemo } from "react";
import TeacherTable, {
  type Teacher,
} from "../../../components/admin/teacher-registration/teachertable";
import type { TeacherFormData } from "../../../components/admin/teacher-registration/addteachermodal";
import AddTeacherModal from "../../../components/admin/teacher-registration/addteachermodal";
import DeleteConfirmationModal from "../../../components/ui/dialog";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast, { Toaster } from "react-hot-toast";
import EditTeacherModal, {
  type EditTeacherFormData,
} from "../../../components/admin/teacher-registration/editteachermodal";

// ── GraphQL Definitions ──
const GET_TEACHERS_QUERY = gql`
  query GetTeachers {
    getTeachers {
      success
      data {
        id
        firstname
        lastname
        email
        qualification
        is_active
      }
    }
  }
`;

const ADD_TEACHER_MUTATION = gql`
  mutation AddTeacher(
    $firstname: String!
    $lastname: String!
    $email: String!
  ) {
    addTeacher(firstname: $firstname, lastname: $lastname, email: $email) {
      success
      message
      data {
        link
      }
    }
  }
`;

// ── Types ──
interface GetTeachersResponse {
  getTeachers: {
    success: boolean;
    data:
      | {
          id: string;
          firstname: string;
          lastname: string | null;
          email: string;
          qualification: string | null;
          is_active: boolean;
        }[]
      | null;
  };
}

interface AddTeacherResponse {
  addTeacher: {
    success: boolean;
    message: string;
    data?: {
      link: string;
    } | null;
  };
}

const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacherByAdmin(
    $teacherId: String!
    $firstname: String
    $lastname: String
    $email: String
    $qualification: String
    $isActive: Boolean
  ) {
    updateTeacherByAdmin(
      teacherId: $teacherId
      firstname: $firstname
      lastname: $lastname
      email: $email
      qualification: $qualification
      isActive: $isActive
    ) {
      success
      message
    }
  }
`;

interface UpdateTeacherResponse {
  updateTeacherByAdmin: {
    success: boolean;
    message: string;
  };
}

const DELETE_TEACHER_MUTATION = gql`
  mutation DeleteTeacher($teacherId: String!) {
    deleteTeacher(teacherId: $teacherId) {
      success
      message
    }
  }
`;

// Add these under your other interfaces
interface DeleteTeacherResponse {
  deleteTeacher: {
    success: boolean;
    message: string;
  };
}

export default function TeacherRegistration() {
  // ── State ──
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [teacherToDeleteId, setTeacherToDeleteId] = useState<string | null>(
    null,
  );

  // ── Apollo Client Hooks ──
  const { data, loading, refetch } =
    useQuery<GetTeachersResponse>(GET_TEACHERS_QUERY);
  const [addTeacherMutation, { loading: isAddingTeacher }] =
    useMutation<AddTeacherResponse>(ADD_TEACHER_MUTATION);

  // ── Format Backend Data for the Table ──
  const teachersList: Teacher[] = useMemo(() => {
    if (!data?.getTeachers?.data) return [];

    return data.getTeachers.data.map((t: any) => ({
      id: t.id,
      name: `${t.firstname} ${t.lastname || ""}`.trim(),
      email: t.email,
      qualification: t.qualification || "Pending",
      status: t.is_active ? "Approved" : "Pending",
    }));
  }, [data]);

  // ── Handlers ──
  const handleAddTeacher = async (formData: TeacherFormData) => {
    try {
      const response = await addTeacherMutation({
        variables: {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
        },
      });

      if (response.data?.addTeacher?.success) {
        refetch(); // Refresh the table instantly

        // Custom Styled Success Toast
        toast.success("Teacher added successfully!", {
          style: {
            background: "#1c2026",
            color: "#dfe2eb",
            border: "1px solid #3b4a44",
          },
          iconTheme: {
            primary: "#6fffd9",
            secondary: "#00382c",
          },
        });

        // Show the success link UI inside the modal
        const link = response.data.addTeacher.data?.link;
        if (link) {
          setGeneratedLink(link);
        } else {
          setIsAddModalOpen(false);
        }
      } else {
        toast.error(
          response.data?.addTeacher?.message || "Failed to add teacher",
          {
            style: {
              background: "#1c2026",
              color: "#ffb4ab",
              border: "1px solid #93000a",
            },
          },
        );
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("An error occurred while communicating with the server.", {
        style: {
          background: "#1c2026",
          color: "#ffb4ab",
          border: "1px solid #93000a",
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => setGeneratedLink(null), 200); // Clean up after fade out
  };

  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [updateTeacherMutation, { loading: isUpdatingTeacher }] =
    useMutation<UpdateTeacherResponse>(UPDATE_TEACHER_MUTATION);

  // 3. Update your handleEdit function
  const handleEdit = (id: string) => {
    setEditingTeacherId(id); // Opens the modal for this specific teacher
  };

  // 4. Create the update handler
  const handleUpdateTeacher = async (formData: EditTeacherFormData) => {
    if (!editingTeacherId) return;

    try {
      const response = await updateTeacherMutation({
        variables: {
          teacherId: editingTeacherId,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          qualification: formData.qualification,
          isActive: formData.isActive,
        },
      });

      if (response.data?.updateTeacherByAdmin?.success) {
        toast.success("Teacher updated successfully!", {
          style: {
            background: "#1c2026",
            color: "#dfe2eb",
            border: "1px solid #3b4a44",
          },
          iconTheme: { primary: "#6fffd9", secondary: "#00382c" },
        });
        setEditingTeacherId(null);
        refetch(); // Instantly update the table
      } else {
        toast.error(
          response.data?.updateTeacherByAdmin?.message || "Update failed",
          {
            style: {
              background: "#1c2026",
              color: "#ffb4ab",
              border: "1px solid #93000a",
            },
          },
        );
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("An error occurred.", {
        style: {
          background: "#1c2026",
          color: "#ffb4ab",
          border: "1px solid #93000a",
        },
      });
    }
  };

  // 5. Helper to get the current data of the teacher being edited
  const currentEditData = useMemo(() => {
    if (!editingTeacherId || !data?.getTeachers?.data) return null;
    const rawTeacher = data.getTeachers.data.find(
      (t: any) => t.id === editingTeacherId,
    );
    if (!rawTeacher) return null;

    return {
      firstname: rawTeacher.firstname,
      lastname: rawTeacher.lastname || "",
      email: rawTeacher.email,
      qualification: rawTeacher.qualification || "",
      isActive: rawTeacher.is_active,
    };
  }, [editingTeacherId, data]);

  const [deleteTeacherMutation] =
    useMutation<DeleteTeacherResponse>(DELETE_TEACHER_MUTATION);
  const handleDeleteClick = (id: string) => {
    setTeacherToDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDeleteId) return;

    try {
      const response = await deleteTeacherMutation({
        variables: { teacherId: teacherToDeleteId },
      });

      if (response.data?.deleteTeacher?.success) {
        toast.success("Teacher deleted successfully", {
          style: {
            background: "#1c2026",
            color: "#dfe2eb",
            border: "1px solid #3b4a44",
          },
          iconTheme: { primary: "#6fffd9", secondary: "#00382c" },
        });

        refetch(); // Instantly remove the teacher from the UI table
      } else {
        toast.error(
          response.data?.deleteTeacher?.message || "Failed to delete teacher",
          {
            style: {
              background: "#1c2026",
              color: "#ffb4ab",
              border: "1px solid #93000a",
            },
          },
        );
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("An error occurred while deleting.", {
        style: {
          background: "#1c2026",
          color: "#ffb4ab",
          border: "1px solid #93000a",
        },
      });
    } finally {
      // Always close the modal, whether it succeeded or failed
      setTeacherToDeleteId(null);
    }
  };

  const teacherToDeleteName = teachersList.find(
    (t) => t.id === teacherToDeleteId,
  )?.name;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // ── Derived State (Filter & Pagination) ──
  const filteredTeachers = useMemo(() => {
    return teachersList.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.qualification.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teachersList, searchQuery]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const currentTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-body text-[#dfe2eb]">
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-[#dfe2eb]">
            Teacher Registration
          </h1>
          <p className="text-sm text-[#84948e] mt-1">
            Manage your teaching staff, their qualifications, and status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] px-4 py-2.5 rounded-lg font-headline font-semibold transition-colors shadow-[0_0_15px_rgba(111,255,217,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#10141a]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Teacher
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-[#1c2026] p-4 rounded-xl border border-[#3b4a44] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#84948e] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or qualification..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[#6fffd9] transition-colors placeholder:text-[#84948e]"
          />
        </div>
      </div>

      {/* ── Data Table Component ── */}
      {loading ? (
        <div className="text-center py-10 text-[#84948e] flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-[32px] text-[#6fffd9]">
            progress_activity
          </span>
          <p>Loading teachers...</p>
        </div>
      ) : (
        <TeacherTable
          teachers={currentTeachers}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTeachers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* ── Modals ── */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        isLoading={isAddingTeacher}
        generatedLink={generatedLink}
        onClose={handleCloseModal}
        onAdd={handleAddTeacher}
      />

      <EditTeacherModal
        isOpen={editingTeacherId !== null}
        isLoading={isUpdatingTeacher}
        initialData={currentEditData}
        onClose={() => setEditingTeacherId(null)}
        onSave={handleUpdateTeacher}
      />

      <DeleteConfirmationModal
        isOpen={teacherToDeleteId !== null}
        onClose={() => setTeacherToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        teacherName={teacherToDeleteName}
      />
    </div>
  );
}
