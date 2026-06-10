interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName?: string;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  teacherName,
  title = "Delete Record?",
  description,
  itemName,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const displayTitle = teacherName ? "Delete Teacher?" : title;
  const displayName = itemName || teacherName;
  const displayDescription = description || (
    <>
      Are you sure you want to remove{" "}
      <span className="font-bold text-[#dfe2eb]">
        {displayName || "this item"}
      </span>
      ? This action cannot be undone and will permanently remove it from the system.
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* ── Background Overlay ── */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* ── Modal Box ── */}
      <div className="relative w-full max-w-sm bg-[#1c2026] border border-[#3b4a44] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="p-6 text-center space-y-4">
          {/* Warning Icon Container */}
          <div className="w-16 h-16 bg-[#93000a]/20 text-[#ffb4ab] rounded-full flex items-center justify-center mx-auto border border-[#93000a]/50 shadow-[0_0_15px_rgba(255,180,171,0.1)]">
            <span className="material-symbols-outlined text-[32px]">
              warning
            </span>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-headline font-bold text-[#dfe2eb]">
              {displayTitle}
            </h2>
            <p className="text-sm font-body text-[#84948e]">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* ── Actions Footer ── */}
        <div className="px-6 py-4 bg-[#262a31]/30 border-t border-[#3b4a44] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg font-headline font-semibold text-[#b9cac3] hover:text-[#dfe2eb] hover:bg-[#262a31] transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-headline font-semibold bg-[#ffb4ab] hover:bg-[#ff8a7a] text-[#690005] transition-colors shadow-[0_0_15px_rgba(255,180,171,0.15)] focus:outline-none focus:ring-2 focus:ring-[#ffb4ab] focus:ring-offset-2 focus:ring-offset-[#1c2026]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}