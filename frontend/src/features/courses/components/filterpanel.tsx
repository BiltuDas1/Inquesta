import { useState } from "react";

interface FilterSectionState {
  courseDuration: boolean;
  topic: boolean;
  subcategory: boolean;
  level: boolean;
  mode: boolean;
  price: boolean;
}

interface SectionProps {
  label: string;
  sKey: keyof FilterSectionState;
  isOpen: boolean;
  toggle: (key: keyof FilterSectionState) => void;
  children: React.ReactNode;
}

interface FilterPanelProps {
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  maxPriceLimit: number;
  onClose?: () => void;
  isSidebar: boolean;
}

const Section: React.FC<SectionProps> = ({
  label,
  sKey,
  isOpen,
  toggle,
  children,
}) => (
  <div className="border-b border-[#3b4a44] py-3">
    <button
      onClick={() => toggle(sKey)}
      className="w-full flex items-center justify-between text-sm font-semibold  text-[#dfe2eb]"
    >
      <span>{label}</span>
      <span
        className={`material-symbols-outlined  ${isOpen ? "rotate-180" : ""} `}
        style={{ fontSize: "18px" }}
      >
        keyboard_arrow_down
      </span>
    </button>
    {isOpen && <div className="mt-3 space-y-2">{children}</div>}
  </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedLevels,
  onLevelsChange,
  maxPrice,
  onMaxPriceChange,
  maxPriceLimit,
  onClose,
  isSidebar,
}) => {
  const [openSections, setOpenSections] = useState<FilterSectionState>({
    courseDuration: true,
    topic: false,
    subcategory: false,
    level: true, // Default open level section
    mode: false,
    price: true, // Default open price section
  });

  const toggle = (key: keyof FilterSectionState) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLevelChange = (label: string, checked: boolean) => {
    const val = label.toLowerCase();
    if (checked) {
      onLevelsChange([...selectedLevels, val]);
    } else {
      onLevelsChange(selectedLevels.filter((l) => l !== val));
    }
  };

  // NEW Data Arrays
  const levels = [
    { label: "Beginner" },
    { label: "Intermediate" },
    { label: "Advanced" },
  ];



  return (
    <div
      className={`text-on-surface font-headline ${isSidebar ? "px-4 py-2" : "px-2"}`}
    >
      {/* Level Section */}
      <Section
        label="Level"
        sKey="level"
        isOpen={openSections.level}
        toggle={toggle}
      >
        {levels.map((l) => (
          <label
            key={l.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedLevels.includes(l.label.toLowerCase())}
              onChange={(e) => handleLevelChange(l.label, e.target.checked)}
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{l.label}</span>
          </label>
        ))}
      </Section>



      {/* --- Price Section --- */}
      <Section
        label="Price"
        sKey="price"
        isOpen={openSections.price}
        toggle={toggle}
      >
        {/* Custom Price Range Slider */}
        <div className="pt-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-[#84948e] font-bold uppercase tracking-wider">
              Max Price
            </span>
            <span className="text-sm font-bold text-[#6fffd9] bg-[#10141a] px-2 py-1 rounded border border-[#3b4a44]">
              ₹ {maxPrice}
            </span>
          </div>

          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max={maxPriceLimit}
              step={maxPriceLimit <= 100 ? 1 : maxPriceLimit <= 1000 ? 10 : 50}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full h-1.5 bg-[#10141a] rounded-lg  cursor-pointer accent-[#6fffd9] outline-none"
            />
          </div>
        </div>
      </Section>

      {isSidebar && onClose && (
        <div className="sticky bottom-0 bg-[#1c2026] pt-3 pb-4 border-t border-[#3b4a44]">
          <button
            onClick={onClose}
            className="w-full bg-[#00e5bc] text-[#00382c] font-bold py-3 rounded text-sm hover:bg-[#6fffd9] transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};
