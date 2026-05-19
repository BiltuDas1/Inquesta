// import { useState } from "react";
// import type { Notice } from "../../courses/admin/noticetable";
// import NoticeTable from "../../courses/admin/noticetable";
// import NoticeModal from "../../courses/admin/noticemodal";

// export default function NoticePage() {
//   // ── State Management ──
//   const [notices, setNotices] = useState<Notice[]>([
//     {
//       id: 1,
//       title: "Scheduled Maintenance",
//       description:
//         "The system will be down for 2 hours on Sunday at 2 AM for database upgrades.",
//       badge: "Urgent",
//       isActive: true,
//     },
//     {
//       id: 2,
//       title: "New Course Policy",
//       description:
//         "Please review the updated guidelines for course enrollment limits.",
//       badge: "Update",
//       isActive: false,
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // ── Action Handlers ──
//   const handleSaveNotice = (newNoticeData: Omit<Notice, "id">) => {
//     const newNotice: Notice = {
//       id: Date.now(),
//       ...newNoticeData,
//     };

//     setNotices([newNotice, ...notices]);
//     setIsModalOpen(false);
//   };

//   const handleEdit = (id: string | number) => {
//     console.log("Edit requested for notice ID:", id);
//   };

//   const handleToggleStatus = (id: string | number) => {
//     setNotices((prevNotices) =>
//       prevNotices.map((n) =>
//         n.id === id ? { ...n, isActive: !n.isActive } : n,
//       ),
//     );
//   };

//   const handleDelete = (id: string | number) => {
//     setNotices((prevNotices) => prevNotices.filter((n) => n.id !== id));
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
//       {/* ── Header Area ── */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-headline font-bold text-[#dfe2eb]">
//             Notices
//           </h1>
//           <p className="text-[#84948e] text-sm mt-1">
//             Manage announcements and alerts for users.
//           </p>
//         </div>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="inline-flex border gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity"
//         >
//           <span className="material-symbols-outlined text-[20px]">add</span>
//           Add Notice
//         </button>
//       </div>

//       {/* ── Extracted Notice Table Component Implementation ── */}
//       <NoticeTable
//         notices={notices}
//         onEdit={handleEdit}
//         onUpdate={handleToggleStatus}
//         onDelete={handleDelete}
//       />

//       {/* ── Extracted Add Notice Modal Component Implementation ── */}
//       <NoticeModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveNotice}
//       />
//     </div>
//   );
// }


// import { useState, useMemo } from "react";
// import toast from "react-hot-toast";

// import NoticeTable from "../../courses/admin/noticetable";
// import NoticeModal from "../../courses/admin/noticemodal";
// import type { Notice } from "../../courses/admin/noticetable";
// import { gql } from "@apollo/client";
// import { useMutation, useQuery } from "@apollo/client/react";

// // ── Type Definitions for GraphQL ──
// interface NoticeData {
//   id: string;
//   title: string;
//   description: string;
//   badge: string;
//   isActive: boolean;
//   imagePath: string;
// }

// interface GetNoticesResponse {
//   getNotices: {
//     data: NoticeData[];
//   };
// }

// interface AddNoticeResponse {
//   addNotice: {
//     success: boolean;
//     message: string;
//   };
// }

// interface UpdateNoticeResponse {
//   updateNotice: {
//     success: boolean;
//     message: string;
//   };
// }

// interface DeleteNoticeResponse {
//   deleteNotice: {
//     success: boolean;
//     message: string;
//   };
// }

// // Get Notice
// const GET_NOTICES = gql`
//   mutation getNotices {
//     getNotices {
//       data {
//         badge
//         description
//         id
//         imagePath
//         isActive
//         title
//       }
//     }
//   }
// `;

// // Add Notice
// const ADD_NOTICE = gql`
//   mutation addNotice(
//     $title: String!
//     $description: String!
//     $badge: String!
//     $isActive: Boolean!
//     $image: String
//   ) {
//     addNotice(
//       title: $title
//       description: $description
//       badge: $badge
//       isActive: $isActive
//       image: $image
//     ) {
//       success
//       message
//     }
//   }
// `;

// // Update Notice
// const UPDATE_NOTICE = gql`
//   mutation updateNotice (
//     $id: ID!
//     $title: String
//     $description: String
//     $badge: String
//     $isActive: Boolean
//     $image: String
//   ) {
//    updateNotice (
//       id: $id
//       title: $title
//       description: $description
//       badge: $badge
//       isActive: $isActive
//       image: $image
//     ) {
//       success
//       message
//     }
//   }
// `;

// // Delete Notice
// const DELETE_NOTICE = gql`
//   mutation deleteNotice ($id: ID!) {
//     deleteNotice (id: $id) {
//       success
//       message
//     }
//   }
// `;

// // ── 2. Helper Functions ──
// const BADGES = ["Beginner Friendly", "Advanced", "Trending", "Urgent", "Update"];

// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

// // ── 3. Main Component ──
// export default function NoticePage() {
//   // ── State Management ──
//   const [modal, setModal] = useState<"add" | string | null>(null);
//   const [search, setSearch] = useState("");
//   const [filterBadge, setFilterBadge] = useState("");

//   // ── GraphQL Hooks ──
//   const { loading, error, data, } = useMutation<GetNoticesResponse>(GET_NOTICES, {
//     fetchPolicy: "cache-and-network",
//   });

//   const [addNotice, { loading: adding }] = useMutation<AddNoticeResponse>(ADD_NOTICE);
//   const [updateNotice, { loading: updating }] = useMutation<UpdateNoticeResponse>(UPDATE_NOTICE);
//   const [deleteNotice] = useMutation<DeleteNoticeResponse>(DELETE_NOTICE);

//   // ── Data Processing & Filtering ──
//   // Map backend 'imagePath' to frontend 'image' expected by your table/modal
//   const rawNotices: Notice[] = data?.getNotices?.data?.map((n: any) => ({
//     ...n,
//     image: n.imagePath
//   })) || [];

//   const displayNotices = useMemo(() => {
//     return rawNotices.filter((n) => {
//       const matchSearch =
//         !search ||
//         n.title.toLowerCase().includes(search.toLowerCase()) ||
//         n.description.toLowerCase().includes(search.toLowerCase());
//       const matchBadge = !filterBadge || n.badge === filterBadge;
//       return matchSearch && matchBadge;
//     });
//   }, [rawNotices, search, filterBadge]);

//   // ── Action Handlers ──
//   const handleDelete = async (id: string | number) => {
//     if (window.confirm("Are you sure you want to delete this notice?")) {
//       try {
//         const { data: delData } = await deleteNotice({
//           variables: { id: String(id) },
//         });
//         if (delData?.deleteNotice?.success) {
//           toast.success("Notice deleted successfully");
//           await refetch();
//         } else {
//           toast.error(`Delete failed: ${delData?.deleteNotice?.message}`);
//         }
//       } catch (e: any) {
//         console.error("Delete Error:", e);
//         toast.error("Failed to delete notice.");
//       }
//     }
//   };

//   const handleToggleStatus = async (id: string | number) => {
//     const noticeToToggle = displayNotices.find((n) => n.id === id);
//     if (!noticeToToggle) return;

//     try {
//       const { data: updateData } = await updateNotice({
//         variables: { id: String(id), isActive: !noticeToToggle.isActive },
//       });
//       if (updateData?.updateNotice?.success) {
//         toast.success("Notice status updated!");
//         await refetch();
//       } else {
//         toast.error("Failed to update status.");
//       }
//     } catch (e) {
//       console.error("Toggle Error:", e);
//       toast.error("An error occurred while updating status.");
//     }
//   };

//   const handleSave = async (formData: any, file: File | null) => {
//     try {
//       let base64Image = formData.image || ""; // Keep existing if no new file

//       if (file) {
//         base64Image = await fileToBase64(file);
//       }

//       const noticeVars = {
//         title: formData.title,
//         description: formData.description,
//         badge: formData.badge,
//         isActive: formData.isActive,
//         image: base64Image,
//       };

//       if (modal === "add") {
//         const { data: addData } = await addNotice({ variables: noticeVars });
//         if (addData?.addNotice?.success) {
//           toast.success(addData.addNotice.message || "Notice added successfully!");
//         } else {
//           throw new Error(addData?.addNotice?.message || "Failed to add notice.");
//         }
//       } else if (modal != null) {
//         const { data: updateData } = await updateNotice({
//           variables: { ...noticeVars, id: String(modal) },
//         });
//         if (updateData?.updateNotice?.success) {
//           toast.success(updateData.updateNotice.message || "Notice updated successfully!");
//         } else {
//           throw new Error(updateData?.updateNotice?.message || "Failed to update notice.");
//         }
//       }

//       await refetch();
//       setModal(null);
//     } catch (e: any) {
//       console.error("Error saving notice:", e);
//       toast.error(e.message || "An unexpected error occurred.");
//     }
//   };

//   const selectClass =
//     "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

//   // ── Render ──
//   return (
//     <>
//       <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
//         {loading ? (
//           <div className="h-screen flex items-center justify-center text-[#6fffd9]">
//             Loading...
//           </div>
//         ) : error ? (
//           <div className="h-screen flex items-center justify-center text-red-400">
//             Error loading notices. Please try again.
//           </div>
//         ) : (
//           <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
//             {/* Header & Add Button */}
//             <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//               <div>
//                 <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
//                   Notices
//                 </h1>
//                 <p className="text-[0.875rem] text-[#b9cac3] mt-1">
//                   Manage announcements and alerts for users.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setModal("add")}
//                 className="inline-flex border gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity"
//               >
//                 <span className="material-symbols-outlined">add</span> Add Notice
//               </button>
//             </div>

//             {/* Filters Bar */}
//             <div className="flex flex-wrap gap-3 mb-5 items-center">
//               <div className="relative flex-1 min-w-[180px]">
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search notices by title or description..."
//                   className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
//                 />
//               </div>
//               <select
//                 className={selectClass}
//                 value={filterBadge}
//                 onChange={(e) => setFilterBadge(e.target.value)}
//               >
//                 <option value="">All Badges</option>
//                 {BADGES.map((badge) => (
//                   <option key={badge} value={badge}>
//                     {badge}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Table */}
//             <NoticeTable
//               notices={displayNotices}
//               onEdit={(id) => setModal(String(id))}
//               onUpdate={handleToggleStatus}
//               onDelete={handleDelete}
//             />
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {modal !== null && (
//         <NoticeModal
//           isOpen={true}
//           editing={displayNotices.find((n) => String(n.id) === modal) || null}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           isSubmitting={adding || updating}
//         />
//       )}
//     </>
//   );
// }


import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

import NoticeTable from "../../courses/admin/noticetable";
import NoticeModal from "../../courses/admin/noticemodal";
import type { Notice } from "../../courses/admin/noticetable";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react"; // Only need useMutation now

// ── Type Definitions for GraphQL ──
interface NoticeData {
  id: string;
  title: string;
  description: string;
  badge: string;
  isActive: boolean;
  imagePath: string;
}

interface GetNoticesResponse {
  getNotices: {
    data: NoticeData[];
  };
}

interface AddNoticeResponse {
  addNotice: {
    success: boolean;
    message: string;
  };
}

interface UpdateNoticeResponse {
  updateNotice: {
    success: boolean;
    message: string;
  };
}

interface DeleteNoticeResponse {
  deleteNotice: {
    success: boolean;
    message: string;
  };
}

// ── 1. GraphQL Operations ──

// Changed from 'query' to 'mutation'
const GET_NOTICES = gql`
  mutation getNotices {
    getNotices {
      data {
        badge
        description
        id
        imagePath
        isActive
        title
      }
    }
  }
`;

const ADD_NOTICE = gql`
  mutation addNotice(
    $title: String!
    $description: String!
    $badge: String!
    $isActive: Boolean!
    $image: String!
  ) {
    addNotice(
      title: $title
      description: $description
      badge: $badge
      isActive: $isActive
      image: $image
    ) {
      success
      message
    }
  }
`;

const UPDATE_NOTICE = gql`
  mutation updateNotice (
    $id: ID!
    $title: String
    $description: String
    $badge: String
    $isActive: Boolean
    $image: String
  ) {
   updateNotice (
      id: $id
      title: $title
      description: $description
      badge: $badge
      isActive: $isActive
      image: $image
    ) {
      success
      message
    }
  }
`;

const DELETE_NOTICE = gql`
  mutation deleteNotice ($id: ID!) {
    deleteNotice (id: $id) {
      success
      message
    }
  }
`;

// ── 2. Helper Functions ──
const BADGES = ["Beginner Friendly", "Advanced", "Trending", "Urgent", "Update"];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ── 3. Main Component ──
export default function NoticePage() {
  // ── State Management ──
  const [modal, setModal] = useState<"add" | string | null>(null);
  const [search, setSearch] = useState("");
  const [filterBadge, setFilterBadge] = useState("");

  // ── GraphQL Hooks ──
  
  // 1. Setup the fetch mutation
  const [fetchNotices, { loading, error, data }] = useMutation<GetNoticesResponse>(GET_NOTICES);

  // 2. Run the fetch mutation once when the component mounts
  useEffect(() => {
    fetchNotices().catch(err => console.error("Initial load error:", err));
  }, [fetchNotices]);

  const [addNotice, { loading: adding }] = useMutation<AddNoticeResponse>(ADD_NOTICE);
  const [updateNotice, { loading: updating }] = useMutation<UpdateNoticeResponse>(UPDATE_NOTICE);
  const [deleteNotice] = useMutation<DeleteNoticeResponse>(DELETE_NOTICE);

  // ── Data Processing & Filtering ──
  const rawNotices: Notice[] = data?.getNotices?.data?.map((n) => ({
    ...n,
    image: n.imagePath
  })) || [];

  const displayNotices = useMemo(() => {
    return rawNotices.filter((n) => {
      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase());
      const matchBadge = !filterBadge || n.badge === filterBadge;
      return matchSearch && matchBadge;
    });
  }, [rawNotices, search, filterBadge]);

  // ── Action Handlers ──
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const { data: delData } = await deleteNotice({
          variables: { id: String(id) },
        });
        if (delData?.deleteNotice?.success) {
          toast.success("Notice deleted successfully");
          await fetchNotices(); // Replace refetch() with fetchNotices()
        } else {
          toast.error(`Delete failed: ${delData?.deleteNotice?.message}`);
        }
      } catch (e: any) {
        console.error("Delete Error:", e);
        toast.error("Failed to delete notice.");
      }
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    const noticeToToggle = displayNotices.find((n) => n.id === id);
    if (!noticeToToggle) return;

    try {
      const { data: updateData } = await updateNotice({
        variables: { id: String(id), isActive: !noticeToToggle.isActive },
      });
      if (updateData?.updateNotice?.success) {
        toast.success("Notice status updated!");
        await fetchNotices(); // Replace refetch() with fetchNotices()
      } else {
        toast.error("Failed to update status.");
      }
    } catch (e) {
      console.error("Toggle Error:", e);
      toast.error("An error occurred while updating status.");
    }
  };

  const handleSave = async (formData: any, file: File | null) => {
    try {
      let base64Image = formData.image || ""; 

      if (file) {
        base64Image = await fileToBase64(file);
      }

      const noticeVars = {
        title: formData.title,
        description: formData.description,
        badge: formData.badge,
        isActive: formData.isActive,
        image: base64Image,
      };

      if (modal === "add") {
        const { data: addData } = await addNotice({ variables: noticeVars });
        if (addData?.addNotice?.success) {
          toast.success(addData.addNotice.message || "Notice added successfully!");
        } else {
          throw new Error(addData?.addNotice?.message || "Failed to add notice.");
        }
      } else if (modal != null) {
        const { data: updateData } = await updateNotice({
          variables: { ...noticeVars, id: String(modal) },
        });
        if (updateData?.updateNotice?.success) {
          toast.success(updateData.updateNotice.message || "Notice updated successfully!");
        } else {
          throw new Error(updateData?.updateNotice?.message || "Failed to update notice.");
        }
      }

      await fetchNotices(); // Replace refetch() with fetchNotices()
      setModal(null);
    } catch (e: any) {
      console.error("Error saving notice:", e);
      toast.error(e.message || "An unexpected error occurred.");
    }
  };

  const selectClass =
    "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  // ── Render ──
  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
        {loading ? (
          <div className="h-screen flex items-center justify-center text-[#6fffd9]">
            Loading...
          </div>
        ) : error ? (
          <div className="h-screen flex items-center justify-center text-red-400">
            Error loading notices. Please try again.
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {/* Header & Add Button */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
              <div>
                <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
                  Notices
                </h1>
                <p className="text-[0.875rem] text-[#b9cac3] mt-1">
                  Manage announcements and alerts for users.
                </p>
              </div>
              <button
                onClick={() => setModal("add")}
                className="inline-flex border gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">add</span> Add Notice
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <div className="relative flex-1 min-w-[180px]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notices by title or description..."
                  className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
                />
              </div>
              <select
                className={selectClass}
                value={filterBadge}
                onChange={(e) => setFilterBadge(e.target.value)}
              >
                <option value="">All Badges</option>
                {BADGES.map((badge) => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <NoticeTable
              notices={displayNotices}
              onEdit={(id) => setModal(String(id))}
              onUpdate={handleToggleStatus}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <NoticeModal
          isOpen={true}
          editing={displayNotices.find((n) => String(n.id) === modal) || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isSubmitting={adding || updating}
        />
      )}
    </>
  );
}