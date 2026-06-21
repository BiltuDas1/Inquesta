import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/context/authcontext";
import {
  GET_RESOURCES,
  ADD_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE,
} from "../graphql/resourcesOps";
import DeleteConfirmationModal from "../../../components/ui/dialog";
import AddResourceModal from "../../../components/teacher/resources/addresourcemodal";

// Reuse allocated courses query
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

interface AllocatedCourse {
  courseId: string;
  courseTitle: string;
  teacherId: string | null;
  teacherEmail: string | null;
}

interface Resource {
  id: string;
  courseId: string | null;
  title: string;
  type: "pdf" | "video" | "link" | "document";
  url: string;
  description: string | null;
}

export default function TeacherResourcesPage() {
  const { user } = useAuth();
  const teacherEmail = user?.email;

  // --- States ---
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  // --- GraphQL Queries ---
  const { data: coursesData, loading: coursesLoading } = useQuery<{
    getTeacherAllocatedCourses: { data: AllocatedCourse[] };
  }>(GET_TEACHER_ALLOCATED_COURSES);

  const rawCourses = coursesData?.getTeacherAllocatedCourses?.data || [];
  const myCourses = rawCourses.filter((c) => c.teacherEmail === teacherEmail);

  const { data: resourcesData, loading: resourcesLoading, refetch: refetchResources } = useQuery<{
    getResources: { data: Resource[] };
  }>(GET_RESOURCES, {
    variables: { courseId: selectedCourseId },
    fetchPolicy: "cache-and-network",
  });

  const resourcesList = resourcesData?.getResources?.data || [];

  // --- GraphQL Mutations ---
  const [addResourceMutation, { loading: adding }] = useMutation<any>(ADD_RESOURCE);
  const [updateResourceMutation, { loading: updating }] = useMutation<any>(UPDATE_RESOURCE);
  const [deleteResourceMutation] = useMutation<any>(DELETE_RESOURCE);

  const isSaving = adding || updating;

  const handleOpenAdd = () => {
    setEditingResource(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    setEditingResource(res);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingResourceId) return;
    try {
      const { data } = await deleteResourceMutation({
        variables: { id: deletingResourceId },
      });
      if (data?.deleteResource?.success) {
        toast.success("Resource deleted successfully");
        refetchResources();
      } else {
        toast.error(data?.deleteResource?.message || "Failed to delete resource");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setDeletingResourceId(null);
    }
  };

  const handleSave = async (formData: {
    title: string;
    type: "pdf" | "video" | "link" | "document";
    url: string;
    description: string;
    courseId: string;
  }) => {
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingResource) {
        // Edit
        const { data } = await updateResourceMutation({
          variables: {
            id: editingResource.id,
            courseId: formData.courseId === "all" ? null : formData.courseId,
            title: formData.title.trim(),
            type: formData.type,
            url: formData.url.trim(),
            description: formData.description.trim(),
          },
        });
        if (data?.updateResource?.success) {
          toast.success("Resource updated successfully");
          refetchResources();
        } else {
          toast.error(data?.updateResource?.message || "Failed to update resource");
        }
      } else {
        // Add
        const { data } = await addResourceMutation({
          variables: {
            courseId: formData.courseId === "all" ? null : formData.courseId,
            title: formData.title.trim(),
            type: formData.type,
            url: formData.url.trim(),
            description: formData.description.trim(),
          },
        });
        if (data?.addResource?.success) {
          toast.success("Resource added successfully");
          refetchResources();
        } else {
          toast.error(data?.addResource?.message || "Failed to add resource");
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "picture_as_pdf";
      case "video":
        return "play_circle";
      case "link":
        return "link";
      case "document":
      default:
        return "description";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "pdf":
        return {
          bg: "bg-[#ffb4ab]/10 border-[#ffb4ab]/20",
          text: "text-[#ffb4ab]",
          glow: "shadow-[0_0_15px_rgba(255,180,171,0.1)]"
        };
      case "video":
        return {
          bg: "bg-[#bdc2ff]/10 border-[#bdc2ff]/20",
          text: "text-[#bdc2ff]",
          glow: "shadow-[0_0_15px_rgba(189,194,255,0.1)]"
        };
      case "link":
        return {
          bg: "bg-[#6fffd9]/10 border-[#6fffd9]/20",
          text: "text-[#6fffd9]",
          glow: "shadow-[0_0_15px_rgba(111,255,217,0.1)]"
        };
      case "document":
      default:
        return {
          bg: "bg-[#84948e]/10 border-[#3b4a44]",
          text: "text-[#dfe2eb]",
          glow: "shadow-none"
        };
    }
  };

  const isLoading = coursesLoading || resourcesLoading;

  if (isLoading && resourcesList.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-[#b9cac3]">
        <span className="material-symbols-outlined animate-spin mr-3">progress_activity</span>
        Loading resource manager...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Resources
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Manage course syllabus documents, slides, reference materials and links.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-[#1c2026] border border-[#3b4a44] px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-[#bdc2ff]">Filter Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-transparent border-none text-xs font-headline font-bold text-[#dfe2eb] outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1c2026]">All Courses</option>
              {myCourses.map((c) => (
                <option key={c.courseId} value={c.courseId} className="bg-[#1c2026]">
                  {c.courseTitle}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-[#6fffd9] text-[#00382c] hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full font-headline font-semibold text-sm shadow-md cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Resource
          </button>
        </div>
      </div>

      {/* --- Grid Layout --- */}
      {resourcesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourcesList.map((res) => {
            const styles = getTypeStyles(res.type);
            const course = myCourses.find((c) => c.courseId === res.courseId);
            const courseTitle = course ? course.courseTitle : "";

            return (
              <div
                key={res.id}
                className={`bg-[#1c2026] border border-[#3b4a44] p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all hover:border-[#6fffd9] hover:bg-[#262a31]/30 relative overflow-hidden group ${styles.glow}`}
              >
                {/* Resource Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-[#10141a] border border-[#3b4a44] p-2.5 rounded-xl flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-2xl ${styles.text}`}>
                        {getIcon(res.type)}
                      </span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${styles.bg} ${styles.text}`}>
                      {res.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base md:text-lg text-[#dfe2eb] line-clamp-1" title={res.title}>
                      {res.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#bdc2ff] tracking-wide block mt-0.5 truncate">
                      {courseTitle}
                    </span>
                    <p className="text-sm text-[#b9cac3] mt-2 line-clamp-2 leading-relaxed">
                      {res.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-[#3b4a44]/55 mt-5 pt-4">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#6fffd9] hover:underline font-semibold flex items-center gap-1"
                  >
                    Open Resource <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="text-[#84948e] hover:text-[#6fffd9] p-1 rounded-lg hover:bg-[#262a31] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingResourceId(res.id)}
                      className="text-[#84948e] hover:text-[#ffb4ab] p-1 rounded-lg hover:bg-[#262a31] transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center bg-[#1c2026] border border-[#3b4a44] p-16 rounded-2xl text-[#84948e] max-w-xl mx-auto shadow-sm">
          <span className="material-symbols-outlined text-5xl mb-3 text-[#3b4a44]">folder_open</span>
          <p className="text-[#b9cac3] text-sm">No resources added for this course yet.</p>
          <p className="text-xs mt-1 text-[#84948e]">Click "Add Resource" to start creating reference materials.</p>
        </div>
      )}

      {/* Add/Edit Resource Modal */}
      {modalOpen && (
        <AddResourceModal
          editingResource={editingResource}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          isSaving={isSaving}
          myCourses={myCourses}
          defaultCourseId={selectedCourseId === "all" ? (myCourses[0]?.courseId || "") : selectedCourseId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deletingResourceId !== null}
        onClose={() => setDeletingResourceId(null)}
        onConfirm={handleDelete}
        title="Delete Resource?"
        itemName={resourcesList.find((r) => r.id === deletingResourceId)?.title || "this resource"}
      />
    </div>
  );
}
