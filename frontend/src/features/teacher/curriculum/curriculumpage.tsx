import { useState } from "react";
import AddCurriculumModal from "../../../components/teacher/curriculum/addcurriculummodal";

// --- Types ---
type UnitStatus = "Green" | "Amber" | "Gray";

interface UnitRecord {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  status: UnitStatus;
  description?: string;
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
      description: "Foundational algebraic expressions, simplifying terms, solving basic linear equations, and variable operations.",
    },
    {
      id: "u2",
      title: "Unit 2: Linear equations",
      completedLessons: 6,
      totalLessons: 8,
      status: "Green",
      description: "Graphing linear equations, finding slope, intercept forms, and solving simultaneous equations graphically.",
    },
    {
      id: "u3",
      title: "Unit 3: Quadratic equations",
      completedLessons: 4,
      totalLessons: 10,
      status: "Amber",
      description: "Factoring quadratics, completing the square, using the quadratic formula, and graphing parabolas.",
    },
    {
      id: "u4",
      title: "Unit 4: Geometry — Lines & angles",
      completedLessons: 0,
      totalLessons: 8,
      status: "Gray",
      description: "Angles on straight lines, parallel lines, triangle angle sums, congruency, and properties of polygons.",
    },
    {
      id: "u5",
      title: "Unit 5: Statistics & probability",
      completedLessons: 0,
      totalLessons: 6,
      status: "Gray",
      description: "Calculating mean, median, mode, range, constructing histograms, and understanding simple probability experiments.",
    },
  ]);

  // --- Global Course Key Takeaways State ---
  const [takeaways, setTakeaways] = useState<string[]>([
    "Master React, TypeScript, and Tailwind CSS",
    "Build robust RESTful and GraphQL APIs with Node.js",
    "Deploy scalable applications to AWS and Vercel",
    "Master database indexing and relationships",
    "Implement secure user authentication",
  ]);
  const [takeawayInput, setTakeawayInput] = useState("");

  // --- Modal Form Toggle State ---
  const [isAddingUnit, setIsAddingUnit] = useState(false);

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

  const handleAddTakeaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (takeawayInput.trim()) {
      setTakeaways([...takeaways, takeawayInput.trim()]);
      setTakeawayInput("");
    }
  };

  const handleRemoveTakeaway = (indexToRemove: number) => {
    setTakeaways(takeaways.filter((_, index) => index !== indexToRemove));
  };

  const handleSaveUnit = (data: {
    title: string;
    description: string;
  }) => {
    const newUnit: UnitRecord = {
      id: `u-${Date.now()}`,
      title: data.title,
      description: data.description,
      completedLessons: 0,
      totalLessons: 10,
      status: "Gray",
    };

    setUnits([...units, newUnit]);
    setIsAddingUnit(false);
  };

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
          onClick={() => setIsAddingUnit(true)}
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

      {/* ── Key Takeaways Section (Global Course Goals) ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] p-5 sm:p-6 rounded-xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-base md:text-lg text-[#dfe2eb]">Course Key Takeaways</h3>
          <span className="text-[#84948e] text-[11px] font-semibold uppercase tracking-wider">Objectives</span>
        </div>

        {/* Inline Add Input */}
        <form onSubmit={handleAddTakeaway} className="flex gap-2">
          <input
            type="text"
            value={takeawayInput}
            onChange={(e) => setTakeawayInput(e.target.value)}
            placeholder="Add a course takeaway (e.g. Master database indexing and relationships)"
            className="flex-1 bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#6fffd9] text-[#00382c] hover:opacity-90 transition-opacity px-4 py-2 rounded-[10px] font-headline font-semibold text-xs shadow-md cursor-pointer shrink-0"
          >
            Add
          </button>
        </form>

        {/* Takeaways Grid */}
        {takeaways.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {takeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 bg-[#262a31]/45 border border-[#3b4a44]/55 p-3 rounded-lg text-sm text-[#dfe2eb] transition-colors hover:border-[#84948e]"
              >
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#00e5bc] text-[18px] leading-none shrink-0 mt-0.5 select-none">
                    check_circle
                  </span>
                  <span className="leading-tight font-light">{takeaway}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTakeaway(idx)}
                  className="text-[#84948e] hover:text-[#ffb4ab] transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#84948e] text-xs italic">No takeaways added yet. Use the input above to add takeaways for this course.</p>
        )}
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
              className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex flex-col justify-between shadow-sm transition-all hover:border-[#84948e] hover:shadow-md min-h-[160px]"
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

                {/* Description */}
                {unit.description && (
                  <p className="text-[#b9cac3] text-sm mb-4 line-clamp-3 leading-relaxed font-light">
                    {unit.description}
                  </p>
                )}

                {/* Subtext */}
                <p className="text-[#84948e] text-xs mb-3">
                  {unit.completedLessons}/{unit.totalLessons} lessons completed
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#31353c] rounded-full h-2 overflow-hidden">
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
        <AddCurriculumModal
          onClose={() => setIsAddingUnit(false)}
          onSave={handleSaveUnit}
        />
      )}
    </div>
  );
}





