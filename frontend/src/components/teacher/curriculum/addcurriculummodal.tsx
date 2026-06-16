import React, { useState } from "react";

interface AddCurriculumModalProps {
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
  }) => void;
  editingUnit?: {
    title: string;
    description?: string;
  } | null;
}

export default function AddCurriculumModal({
  onClose,
  onSave,
  editingUnit = null,
}: AddCurriculumModalProps) {
  const [title, setTitle] = useState(editingUnit?.title ?? "");
  const [description, setDescription] = useState(editingUnit?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
    });
  };

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e] disabled:opacity-50 transition-colors";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  return (
    <div
      className="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-6 sm:p-8 w-full max-w-[500px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb]">
            {editingUnit ? "Edit Curriculum Unit" : "Add Curriculum Unit"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#84948e] hover:text-[#dfe2eb] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Unit Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 6: Trigonometry Basics"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Unit Description (What will be taught) *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Introduction to sine, cosine, tangent formulas, and solving right-angled triangles."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[#3b4a44]">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-2 text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:bg-[#3b4a44]/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#6fffd9] border-none rounded-full px-6 py-2 text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity"
            >
              {editingUnit ? "Save Changes" : "Add Unit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




