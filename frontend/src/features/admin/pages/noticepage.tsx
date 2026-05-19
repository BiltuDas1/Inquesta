import React, { useState } from "react";
import type { Notice } from "../../courses/admin/noticetable";
import NoticeTable from "../../courses/admin/noticetable";

export default function NoticePage() {
  // ── State Management ──
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: "Scheduled Maintenance",
      description:
        "The system will be down for 2 hours on Sunday at 2 AM for database upgrades.",
      badge: "Urgent",
      isActive: true,
    },
    {
      id: 2,
      title: "New Course Policy",
      description:
        "Please review the updated guidelines for course enrollment limits.",
      badge: "Update",
      isActive: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "Info",
    isActive: true,
  });

  // ── Form Input & Submit Handlers ──
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      badge: formData.badge,
      isActive: formData.isActive,
    };

    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setFormData({ title: "", description: "", badge: "Info", isActive: true });
  };

  // ── Passed Prop Handlers for Action Triggers ──
  const handleEdit = (id: string | number) => {
    console.log("Edit requested for notice ID:", id);
  };

  const handleToggleStatus = (id: string | number) => {
    setNotices((prevNotices) =>
      prevNotices.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
    );
  };

  const handleDelete = (id: string | number) => {
    setNotices((prevNotices) => prevNotices.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-[#dfe2eb]">
            Notices
          </h1>
          <p className="text-[#84948e] text-sm mt-1">
            Manage announcements and alerts for users.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#6fffd9] hover:bg-[#5cebc5] text-[#10141a] px-4 py-2 rounded-[8px] font-semibold transition-colors shadow-[0_0_15px_rgba(111,255,217,0.15)]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Notice
        </button>
      </div>

      {/* ── Extracted Notice Table Component Implementation ── */}
      <NoticeTable
        notices={notices}
        onEdit={handleEdit}
        onUpdate={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* ── Add Notice Modal (Popup) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#3b4a44] px-6 py-4">
              <h2 className="text-xl font-bold text-[#dfe2eb]">
                Create New Notice
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#84948e] hover:text-[#ffb4ab] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddNotice} className="p-6 space-y-5">
              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#b9cac3]">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. System Update"
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2.5 text-[#dfe2eb] placeholder-[#5c6d67] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#b9cac3]">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about this notice..."
                  className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2.5 text-[#dfe2eb] placeholder-[#5c6d67] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all resize-none"
                />
              </div>

              {/* Badge & Status Row */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="space-y-1 flex-1">
                  <label className="text-sm font-medium text-[#b9cac3]">
                    Badge Type
                  </label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full bg-[#10141a] border border-[#3b4a44] rounded-[8px] px-4 py-2.5 text-[#dfe2eb] focus:outline-none focus:border-[#6fffd9] focus:ring-1 focus:ring-[#6fffd9] transition-all appearance-none cursor-pointer"
                  >
                    <option value="Info">Info (Green)</option>
                    <option value="Urgent">Urgent (Red)</option>
                    <option value="Update">Update (Blue)</option>
                  </select>
                </div>

                <div className="space-y-1 flex-1">
                  <label className="text-sm font-medium text-[#b9cac3]">
                    Visibility
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-2.5">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-[#3b4a44] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#3b4a44] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6fffd9]"></div>
                    </div>
                    <span className="text-sm text-[#dfe2eb]">
                      {formData.isActive
                        ? "Active (Visible)"
                        : "Draft (Hidden)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6fffd9] hover:bg-[#5cebc5] text-[#10141a] rounded-[8px] font-semibold transition-colors shadow-[0_0_10px_rgba(111,255,217,0.1)]"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}