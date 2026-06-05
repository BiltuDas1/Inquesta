// import React, { useState, useMemo } from "react";
// import TeacherTable, { type Teacher } from "../../../components/admin/teacher-registration/teachertable";
// import type { TeacherFormData } from "../../../components/admin/teacher-registration/teacheraddmodal";
// import AddTeacherModal from "../../../components/admin/teacher-registration/teacheraddmodal";
// import DeleteConfirmationModal from "../../../components/ui/dialog";


// // ── Mock Data ──
// const MOCK_TEACHERS: Teacher[] = [
//   { id: "T001", name: "Eleanor Vance", email: "eleanor.v@luminary.edu", qualification: "Ph.D. in Physics", experience: "8 Years", subject: "Advanced Physics", status: "Active" },
//   { id: "T002", name: "Marcus Thorne", email: "m.thorne@luminary.edu", qualification: "M.Sc. Mathematics", experience: "5 Years", subject: "Calculus", status: "Pending" },
//   { id: "T003", name: "Sophia Lin", email: "slin@luminary.edu", qualification: "M.A. Literature", experience: "12 Years", subject: "World Literature", status: "Active" },
//   { id: "T004", name: "David Alby", email: "david.a@luminary.edu", qualification: "B.Sc. Computer Science", experience: "3 Years", subject: "Programming", status: "Inactive" },
//   { id: "T005", name: "Rachel Green", email: "r.green@luminary.edu", qualification: "M.Sc. Chemistry", experience: "6 Years", subject: "Organic Chemistry", status: "Active" },
//   { id: "T006", name: "Arthur Dent", email: "arthur.d@luminary.edu", qualification: "B.A. History", experience: "10 Years", subject: "European History", status: "Pending" },
//   { id: "T007", name: "Nina Williams", email: "nina.w@luminary.edu", qualification: "Ph.D. Biology", experience: "15 Years", subject: "Genetics", status: "Active" },
// ];

// export default function TeacherRegistration() {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleAddTeacher = (data: TeacherFormData) => {
//     console.log("New Teacher Data:", data);
//     // Here you would trigger your API/GraphQL mutation to save the teacher
    
//     // Example: 
//     // const newTeacher = {
//     //   id: `T00${Math.floor(Math.random() * 100)}`,
//     //   name: `${data.firstName} ${data.lastName}`,
//     //   email: data.email,
//     //   // ... default other values
//     // };
//   };
//   // ── Handlers ──
//   const handleEdit = (id: string) => {
//     console.log("Edit teacher:", id);
//     // Add edit logic or open modal here
//   };

//   const handleDelete = (id: string) => {
//     console.log("Delete teacher:", id);
//     // Add delete logic here
//   };

//   const [teacherToDeleteId, setTeacherToDeleteId] = useState<string | null>(null);

//   // 3. Update the handle function to open the modal instead of deleting instantly
//   const handleDeleteClick = (id: string) => {
//     setTeacherToDeleteId(id);
//   };

//   // 4. Create the actual confirm function
//   const handleConfirmDelete = () => {
//     if (teacherToDeleteId) {
//       console.log("Permanently deleting teacher:", teacherToDeleteId);
//       // Here you trigger your API DELETE request
      
//       // Close modal and reset state
//       setTeacherToDeleteId(null);
//     }
//   };

//   // Helper to find the name of the teacher being deleted to pass to the modal
//  const teacherToDeleteName = MOCK_TEACHERS.find(t => t.id === teacherToDeleteId)?.name;
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset page to 1 when searching
//   };

//   // ── Derived State (Filter & Pagination) ──
//   const filteredTeachers = useMemo(() => {
//     return MOCK_TEACHERS.filter(
//       (teacher) =>
//         teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery]);

//   const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  
//   const currentTeachers = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredTeachers, currentPage]);

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-body text-[#dfe2eb]">
      
//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-headline font-bold text-[#dfe2eb]">
//             Teacher Registration
//           </h1>
//           <p className="text-sm text-[#84948e] mt-1">
//             Manage your teaching staff, their qualifications, and status.
//           </p>
//         </div>
        
//         <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] px-4 py-2.5 rounded-lg font-headline font-semibold transition-colors shadow-[0_0_15px_rgba(111,255,217,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#10141a]">
//           <span className="material-symbols-outlined text-[20px]">add</span>
//           Add Teacher
//         </button>
//       </div>

//       {/* ── Toolbar (Search & Filters) ── */}
//       <div className="bg-[#1c2026] p-4 rounded-xl border border-[#3b4a44] flex flex-col sm:flex-row gap-4 items-center justify-between">
//         <div className="relative w-full sm:max-w-md">
//           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#84948e] text-[20px]">
//             search
//           </span>
//           <input
//             type="text"
//             placeholder="Search by name, email, or subject..."
//             value={searchQuery}
//             onChange={handleSearch}
//             className="w-full bg-[#10141a] border border-[#3b4a44] text-[#dfe2eb] pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-[#6fffd9] transition-colors placeholder:text-[#84948e]"
//           />
//         </div>
        
//         <div className="flex items-center gap-2 w-full sm:w-auto text-sm text-[#b9cac3]">
//           <span className="material-symbols-outlined text-[20px]">filter_list</span>
//           <span>Filter</span>
//         </div>
//       </div>

//       {/* ── Data Table Component ── */}
//       <TeacherTable 
//         teachers={currentTeachers}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={filteredTeachers.length}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//         onEdit={handleEdit}
//         onDelete={handleDeleteClick}
//       />

//       <AddTeacherModal 
//         isOpen={isAddModalOpen} 
//         onClose={() => setIsAddModalOpen(false)} 
//         onAdd={handleAddTeacher} 
//       />

//       <DeleteConfirmationModal
//         isOpen={teacherToDeleteId !== null}
//         onClose={() => setTeacherToDeleteId(null)}
//         onConfirm={handleConfirmDelete}
//         teacherName={teacherToDeleteName}
//       />
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import TeacherTable, { type Teacher } from "../../../components/admin/teacher-registration/teachertable";
import type { TeacherFormData } from "../../../components/admin/teacher-registration/teacheraddmodal";
import AddTeacherModal from "../../../components/admin/teacher-registration/teacheraddmodal";
import DeleteConfirmationModal from "../../../components/ui/dialog";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

// ── GraphQL Definitions ──
// Assuming you have a query to fetch all teachers. Adjust fields as necessary.
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
  mutation AddTeacher($firstname: String!, $lastname: String!, $email: String!) {
    addTeacher(firstname: $firstname, lastname: $lastname, email: $email) {
      success
      message
      data {
        link
      }
    }
  }
`;


interface GetTeachersResponse {
  getTeachers: {
    success: boolean;
    data: {
      id: string;
      firstname: string;
      lastname: string | null;
      email: string;
      qualification: string | null;
      is_active: boolean;
    }[] | null;
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

export default function TeacherRegistration() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [teacherToDeleteId, setTeacherToDeleteId] = useState<string | null>(null);

  // ── Apollo Client Hooks ──
  const { data, loading, refetch } = useQuery<GetTeachersResponse>(GET_TEACHERS_QUERY);
  const [addTeacherMutation] = useMutation<AddTeacherResponse>(ADD_TEACHER_MUTATION);

  // ── Format Backend Data for the Table ──
  const teachersList: Teacher[] = useMemo(() => {
    if (!data?.getTeachers?.data) return [];
    
    return data.getTeachers.data.map((t: any) => ({
      id: t.id,
      name: `${t.firstname} ${t.lastname || ""}`.trim(),
      email: t.email,
      qualification: t.qualification || "Pending",
     status: t.is_active ? "Active" : "Inactive",
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
        setIsAddModalOpen(false);
        refetch(); // Refresh the table data to show the newly added teacher
      } else {
        alert(response.data?.addTeacher?.message || "Failed to add teacher");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("An error occurred while adding the teacher.");
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit teacher:", id);
    // Add edit logic or open modal here
  };

  const handleDeleteClick = (id: string) => {
    setTeacherToDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (teacherToDeleteId) {
      console.log("Permanently deleting teacher:", teacherToDeleteId);
      // Here you would trigger your DELETE mutation, then refetch()
      setTeacherToDeleteId(null);
    }
  };

  const teacherToDeleteName = teachersList.find(t => t.id === teacherToDeleteId)?.name;

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
        teacher.qualification.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachersList, searchQuery]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  
  const currentTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-body text-[#dfe2eb]">
      
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
        
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#6fffd9] hover:bg-[#00e5bc] text-[#00382c] px-4 py-2.5 rounded-lg font-headline font-semibold transition-colors shadow-[0_0_15px_rgba(111,255,217,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6fffd9] focus:ring-offset-2 focus:ring-offset-[#10141a]">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Teacher
        </button>
      </div>

      {/* ── Toolbar (Search & Filters) ── */}
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
        
        <div className="flex items-center gap-2 w-full sm:w-auto text-sm text-[#b9cac3]">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
          <span>Filter</span>
        </div>
      </div>

      {/* ── Data Table Component ── */}
      {loading ? (
        <div className="text-center py-10 text-[#84948e]">Loading teachers...</div>
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

      <AddTeacherModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddTeacher} 
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