import React, { useState } from 'react';

interface ExpandableDescriptionProps {
  children: React.ReactNode; 
}

export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      
      {/* 1. Content Container */}
      <div 
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[5000px]" : "max-h-[200px]"
        }`}
      >
        {children}
        {!isExpanded && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1c2026] to-transparent pointer-events-none"
          />
        )}
      </div>

      {/* 3. The Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center gap-1 text-sm font-bold text-[#a8afff] hover:text-[#bdc2ff] transition-colors cursor-pointer"
      >
        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
        <span className="material-symbols-outlined text-base leading-none">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      
    </div>
  );
};