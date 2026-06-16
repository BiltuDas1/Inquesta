import { useState } from "react";

// --- Types ---
type UnitStatus = "Green" | "Amber" | "Gray";

interface UnitRecord {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  status: UnitStatus;
}

export default function CurriculumPage() {
  // --- React State for Units ---
  const [units, setUnits] = useState<UnitRecord[]>([
    {
      id: "u1",
      title: "Unit 1: Algebra fundamentals",
      completedLessons: 10,
      totalLessons: 10,
      status: "Green",
    },
    {
      id: "u2",
      title: "Unit 2: Linear equations",
      completedLessons: 6,
      totalLessons: 8,
      status: "Green",
    },
    {
      id: "u3",
      title: "Unit 3: Quadratic equations",
      completedLessons: 4,
      totalLessons: 10,
      status: "Amber",
    },
    {
      id: "u4",
      title: "Unit 4: Geometry — Lines & angles",
      completedLessons: 0,
      totalLessons: 8,
      status: "Gray",
    },
    {
      id: "u5",
      title: "Unit 5: Statistics & probability",
      completedLessons: 0,
      totalLessons: 6,
      status: "Gray",
    },
  ]);

  // --- Modal Form State ---
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [title, setTitle] = useState("");
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(10);
  const [status, setStatus] = useState<UnitStatus>("Gray");

  // Helper functions for badge styling
  const getBadgeStyle = (status: UnitStatus) => {
    switch (status) {
      case "Green":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"; // Primary container color
      case "Amber":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"; // Warning color
      case "Gray":
      default:
        return "bg-[#31353c] text-[#84948e] border border-[#3b4a44]"; // Neutral surface color
    }
  };

  const handleOpenModal = () => {
    setTitle("");
    setCompletedLessons(0);
    setTotalLessons(10);
    setStatus("Gray");
    setIsAddingUnit(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newUnit: UnitRecord = {
      id: `u-${Date.now()}`,
      title: title.trim(),
      completedLessons: Math.max(0, Math.min(completedLessons, totalLessons)),
      totalLessons: Math.max(1, totalLessons),
      status,
    };

    setUnits([...units, newUnit]);
    setIsAddingUnit(false);
  };

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e] disabled:opacity-50 transition-colors";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Curriculum
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Lesson plans and unit progress
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-[#6fffd9] text-[#00382c] hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full font-headline font-semibold text-sm shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Unit
        </button>
      </div>

      {/* ── Context Label ── */}
      <div className="text-[13px] font-semibold text-[#bdc2ff] uppercase tracking-wide">
        Class: Grade 8A <span className="mx-1.5 text-[#3b4a44]">·</span>{" "}
        Mathematics <span className="mx-1.5 text-[#3b4a44]">·</span> Term 2
      </div>

      {/* ── Units List ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map((unit) => {
          // Calculate progress percentage
          const progressPercentage =
            unit.totalLessons > 0
              ? Math.round((unit.completedLessons / unit.totalLessons) * 100)
              : 0;

          return (
            <div
              key={unit.id}
              className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex flex-col justify-between shadow-sm transition-all hover:border-[#84948e] hover:shadow-md"
            >
              <div>
                {/* Card Header (Title & Badge) */}
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-[#dfe2eb] font-bold text-base md:text-lg">
                    {unit.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${getBadgeStyle(
                      unit.status,
                    )}`}
                  >
                    {unit.status}
                  </span>
                </div>

                {/* Subtext */}
                <p className="text-[#84948e] text-sm mb-4">
                  {unit.completedLessons}/{unit.totalLessons} lessons completed
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#31353c] rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-[#a8afff]"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Unit Modal ── */}
      {isAddingUnit && (
        <div
          className="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsAddingUnit(false)}
        >
          <div
            className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-6 sm:p-8 w-full max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb]">
                Add Curriculum Unit
              </h2>
              <button
                onClick={() => setIsAddingUnit(false)}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Total Lessons</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalLessons}
                    onChange={(e) => setTotalLessons(parseInt(e.target.value) || 1)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Completed Lessons</label>
                  <input
                    type="number"
                    min="0"
                    max={totalLessons}
                    required
                    value={completedLessons}
                    onChange={(e) => setCompletedLessons(parseInt(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UnitStatus)}
                  className={inputClass}
                >
                  <option value="Gray" className="bg-[#1c2026] text-[#84948e]">
                    Gray (Not Started)
                  </option>
                  <option value="Amber" className="bg-[#1c2026] text-[#f59e0b]">
                    Amber (In Progress)
                  </option>
                  <option value="Green" className="bg-[#1c2026] text-[#00e5bc]">
                    Green (Completed / Up to date)
                  </option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[#3b4a44]">
                <button
                  type="button"
                  onClick={() => setIsAddingUnit(false)}
                  className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-2 text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:bg-[#3b4a44]/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#6fffd9] border-none rounded-full px-6 py-2 text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

