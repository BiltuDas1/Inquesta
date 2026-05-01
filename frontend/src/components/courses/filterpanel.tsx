import { useState } from "react";

interface FilterSectionState {
  courseDuration: boolean;
  topic: boolean;
  subcategory: boolean;
  level: boolean;
  mode: boolean; // NEW
  price: boolean; // NEW
}

interface SectionProps {
  label: string;
  sKey: keyof FilterSectionState;
  isOpen: boolean;
  toggle: (key: keyof FilterSectionState) => void;
  children: React.ReactNode;
}

interface FilterPanelProps {
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
  onClose,
  isSidebar,
}) => {
  const [openSections, setOpenSections] = useState<FilterSectionState>({
    courseDuration: true,
    topic: false,
    subcategory: false,
    level: false,
    mode: false,
    price: false,
  });

  const toggle = (key: keyof FilterSectionState) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const durations = [
    { label: "0-1 Hour", count: "3,591" },
    { label: "1-3 Hours", count: "10,000" },
    { label: "3-6 Hours", count: "9,475" },
    { label: "6-17 Hours", count: "10,000" },
  ];

  // NEW Data Arrays
  const levels = [
    { label: "All Levels", count: "5,432" },
    { label: "Beginner", count: "3,120" },
    { label: "Intermediate", count: "1,890" },
    { label: "Expert", count: "450" },
  ];

  const modes = [
    { label: "Online", count: "9,850" },
    { label: "Offline", count: "150" },
  ];

  const prices = [
    { label: "Paid", count: "8,200" },
    { label: "Free", count: "1,800" },
  ];

  return (
    <div className={`text-on-surface font-headline isSidebar ? px-4 py-2: px-2  `}>
      {isSidebar && onClose && (
        <div className="flex items-center justify-between py-3 border-b border-[#3b4a44] font-headline ">
          <span className="text-sm font-semibold text-[#dfe2eb]">
            10,000 results
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#31353c] text-[#b9cac3]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <Section
        label="Course Duration"
        sKey="courseDuration"
        isOpen={openSections.courseDuration}
        toggle={toggle}
      >
        {durations.map((d) => (
          <label
            key={d.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{d.label}</span>
            <span className="text-xs text-[#84948e]">({d.count})</span>
          </label>
        ))}
        <button className="text-xs text-[#6fffd9] font-semibold  mt-1 flex items-center">
          Show more{" "}
          <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </Section>

      <Section
        label="Topic"
        sKey="topic"
        isOpen={openSections.topic}
        toggle={toggle}
      >
        <p className="text-xs text-[#84948e]">Filter options...</p>
      </Section>
    
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
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{l.label}</span>
            <span className="text-xs text-[#84948e]">({l.count})</span>
          </label>
        ))}
      </Section>

      {/* --- Mode Section --- */}
      <Section
        label="Mode"
        sKey="mode"
        isOpen={openSections.mode}
        toggle={toggle}
      >
        {modes.map((m) => (
          <label
            key={m.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{m.label}</span>
            <span className="text-xs text-[#84948e]">({m.count})</span>
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
        {prices.map((p) => (
          <label
            key={p.label}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              className="accent-[#6fffd9] w-4 h-4 rounded bg-[#1c2026] border-[#84948e]"
            />
            <span className="text-sm text-[#dfe2eb]">{p.label}</span>
            <span className="text-xs text-[#84948e]">({p.count})</span>
          </label>
        ))}
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
