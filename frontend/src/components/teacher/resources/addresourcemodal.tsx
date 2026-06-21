import React, { useState } from "react";

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

interface AddResourceModalProps {
  editingResource: Resource | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    type: "pdf" | "video" | "link" | "document";
    url: string;
    description: string;
    courseId: string;
  }) => void;
  isSaving: boolean;
  myCourses: AllocatedCourse[];
  defaultCourseId: string;
}

export default function AddResourceModal({
  editingResource,
  onClose,
  onSave,
  isSaving,
  myCourses,
  defaultCourseId,
}: AddResourceModalProps) {
  const [formTitle, setFormTitle] = useState(editingResource?.title ?? "");
  const [formType, setFormType] = useState<"pdf" | "video" | "link" | "document">(
    editingResource?.type ?? "pdf"
  );
  const [formUrl, setFormUrl] = useState(editingResource?.url ?? "");
  const [formDescription, setFormDescription] = useState(
    editingResource?.description ?? ""
  );
  const [formCourseId, setFormCourseId] = useState(
    editingResource?.courseId ?? defaultCourseId
  );

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-3.5 py-2 text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-1 font-headline font-semibold";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formTitle,
      type: formType,
      url: formUrl,
      description: formDescription,
      courseId: formCourseId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-6 sm:p-8 w-full max-w-[550px] shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-lg sm:text-xl font-bold text-[#dfe2eb] mb-6">
          {editingResource ? "Edit Resource" : "Add Resource"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Next.js Architecture Slide Deck"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="pdf" className="bg-[#1c2026]">PDF Document</option>
                <option value="video" className="bg-[#1c2026]">Video Tutorial</option>
                <option value="link" className="bg-[#1c2026]">Web Link</option>
                <option value="document" className="bg-[#1c2026]">General Doc</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Associate Course</label>
              <select
                value={formCourseId}
                onChange={(e) => setFormCourseId(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {myCourses.map((c) => (
                  <option key={c.courseId} value={c.courseId} className="bg-[#1c2026]">
                    {c.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>URL *</label>
            <input
              type="url"
              required
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://example.com/resource"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide a brief description of the material..."
              className={`${inputClass} h-24 resize-none`}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-[#3b4a44]/55 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-2 text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:bg-[#262a31] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#6fffd9] border-none rounded-full px-6 py-2 text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && (
                <span className="material-symbols-outlined animate-spin text-sm" style={{ fontSize: "16px" }}>
                  progress_activity
                </span>
              )}
              {isSaving ? "Saving..." : editingResource ? "Save Changes" : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
