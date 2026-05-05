import React from "react";

interface NumberedCursorPaginationProps {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onJumpToFirst: () => void;
}

export const NumberedCursorPagination: React.FC<NumberedCursorPaginationProps> = ({
  page,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  onJumpToFirst,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-10 font-bold text-[#dfe2eb]">
      {/* Previous Arrow Button */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all
          ${
            hasPrevious
              ? "border-[#00e5bc] text-[#00e5bc] hover:bg-[#181c22] cursor-pointer"
              : "border-[#3b4a44] text-[#3b4a44] opacity-50 cursor-not-allowed"
          }`}
      >
        <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
      </button>

      {/* Page 1 & Ellipsis (Shows up if we are far ahead) */}
      {page > 2 && (
        <>
          <button
            onClick={onJumpToFirst}
            className="w-10 h-10 rounded-full hover:bg-[#181c22] text-[#84948e] transition-colors"
          >
            1
          </button>
          {page > 3 && (
            <span className="text-[#84948e] tracking-widest px-1">...</span>
          )}
        </>
      )}

      {/* Previous Page Number */}
      {page > 1 && (
        <button
          onClick={onPrevious}
          className="w-10 h-10 rounded-full hover:bg-[#181c22] text-[#84948e] transition-colors"
        >
          {page - 1}
        </button>
      )}

      {/* Current Page (Active) */}
      <button className="w-10 h-10 rounded-full bg-[#00e5bc] text-[#00382c] cursor-default">
        {page}
      </button>

      {/* Next Page Number */}
      {hasNext && (
        <button
          onClick={onNext}
          className="w-10 h-10 rounded-full hover:bg-[#181c22] text-[#84948e] transition-colors"
        >
          {page + 1}
        </button>
      )}

      {/* Next Arrow Button */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all
          ${
            hasNext
              ? "border-[#00e5bc] text-[#00e5bc] hover:bg-[#181c22] cursor-pointer"
              : "border-[#3b4a44] text-[#3b4a44] opacity-50 cursor-not-allowed"
          }`}
      >
        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
      </button>
    </div>
  );
};