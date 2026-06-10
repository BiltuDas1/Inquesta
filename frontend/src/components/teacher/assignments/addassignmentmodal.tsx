import { useState, useEffect } from "react";

interface Course {
  courseId: string;
  courseTitle: string;
  teacherId: string | null;
  teacherEmail: string | null;
}

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

interface AddAssignmentModalProps {
  editing: Assignment | null;
  onClose: () => void;
  onSave: (data: {
    courseId?: string;
    title: string;
    description: string;
    dueDate: string;
    isPublished: boolean;
  }) => void;
  isSubmitting: boolean;
  courses: Course[];
}

export default function AddAssignmentModal({
  editing,
  onClose,
  onSave,
  isSubmitting,
  courses,
}: AddAssignmentModalProps) {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    isPublished: false,
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        courseId: "", // Update mutation doesn't change courseId
        title: editing.assignmentName,
        description: editing.assignmentDescription,
        dueDate: editing.dueDate ? new Date(editing.dueDate).toISOString().split("T")[0] : "",
        isPublished: editing.isPublished,
      });
    } else {
      setFormData({
        courseId: courses[0]?.courseId || "",
        title: "",
        description: "",
        dueDate: "",
        isPublished: false,
      });
    }
  }, [editing, courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e] disabled:opacity-50";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[600px] max-h-[90vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible font-body shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
          {editing ? "Edit Assignment" : "Create Assignment"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editing && (
            <div>
              <label className={labelClass}>Course *</label>
              <select
                className={inputClass}
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId} className="bg-[#1c2026]">
                    {c.courseTitle}
                  </option>
                ))}
                {courses.length === 0 && (
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
              onClick={onClose}
              className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:bg-[#3b4a44]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!editing && courses.length === 0)}
              className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : editing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
