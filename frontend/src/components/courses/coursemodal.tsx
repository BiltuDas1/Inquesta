import React, { useState, useRef } from "react";
import type { Course, Level } from "../../types/courses";
import { formatLevel, LEVELS } from "../../utils/courseutils";

interface ModalProps {
  editing: Course | null;
  onClose: () => void;
  onSave: (data: Omit<Course, "id">, file: File | null) => void;
  isSubmitting: boolean;
}

export default function CourseModal({
  editing,
  onClose,
  onSave,
  isSubmitting,
}: ModalProps) {
  const [formData, setFormData] = useState({
    title: editing?.title ?? "",
    level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
    duration: editing?.duration ? String(editing.duration) : "",
    price: editing?.price ?? "",
    instructorName: editing?.instructorName ?? "",
    description: editing?.description ?? "",
    icon: editing?.icon ?? "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    editing?.icon
      ? `${editing.icon}`
      : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value === "" ? "" : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
          {editing ? "Edit Course" : "Add New Course"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input
                name="title"
                className={inputClass}
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Level</label>
                <select
                  name="level"
                  className={inputClass}
                  value={formData.level}
                  onChange={handleChange}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l} className="bg-[#1c2026]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Instructor</label>
                <input
                  name="instructorName"
                  className={inputClass}
                  value={formData.instructorName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  name="duration"
                  className={inputClass}
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelClass}>Price (INR)</label>
                <input
                  name="price"
                  className={inputClass}
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Course Thumbnail</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 bg-[#262a31] border border-dashed border-[#3b4a44] rounded-[10px] flex items-center justify-center cursor-pointer hover:border-[#6fffd9] overflow-hidden transition-colors"
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-contain"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#84948e]">
                    <span className="material-symbols-outlined text-2xl mb-1">
                      image
                    </span>
                    <span className="text-[0.75rem] font-headline font-semibold">
                      Upload Image
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className={labelClass}>Course Description</label>
              <textarea
                name="description"
                className={`${inputClass} flex-1 min-h-[140px] resize-none`}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-[#3b4a44]">
          <button
            onClick={onClose}
            className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <button
            // ── THE FIX IS HERE ──
            onClick={() => {
              const dataToSave = {
                ...formData,
                price: Number(formData.price) || 0, // Converts string to number safely
              };
              onSave(dataToSave, selectedFile);
            }}
            disabled={isSubmitting}
            className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
