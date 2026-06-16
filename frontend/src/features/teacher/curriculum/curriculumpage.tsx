import { useState } from "react";
import AddCurriculumModal from "../../../components/teacher/curriculum/addcurriculummodal";

// --- Types ---
interface UnitRecord {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function CurriculumPage() {
  // --- React State for Units ---
  const [units, setUnits] = useState<UnitRecord[]>([
    {
      id: "u1",
      title: "Unit 1: Algebra fundamentals",
      description: "Foundational algebraic expressions, simplifying terms, solving basic linear equations, and variable operations.",
      completed: true,
    },
    {
      id: "u2",
      title: "Unit 2: Linear equations",
      description: "Graphing linear equations, finding slope, intercept forms, and solving simultaneous equations graphically.",
      completed: true,
    },
    {
      id: "u3",
      title: "Unit 3: Quadratic equations",
      description: "Factoring quadratics, completing the square, using the quadratic formula, and graphing parabolas.",
      completed: false,
    },
    {
      id: "u4",
      title: "Unit 4: Geometry — Lines & angles",
      description: "Angles on straight lines, parallel lines, triangle angle sums, congruency, and properties of polygons.",
      completed: false,
    },
    {
      id: "u5",
      title: "Unit 5: Statistics & probability",
      description: "Calculating mean, median, mode, range, constructing histograms, and understanding simple probability experiments.",
      completed: false,
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

  // --- Modal & Edit States ---
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitRecord | null>(null);

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

  const handleToggleComplete = (id: string) => {
    setUnits(
      units.map((unit) =>
        unit.id === id ? { ...unit, completed: !unit.completed } : unit,
      ),
    );
  };

  const handleSaveUnit = (data: { title: string; description: string }) => {
    if (editingUnit) {
      setUnits(
        units.map((unit) =>
          unit.id === editingUnit.id
            ? { ...unit, title: data.title, description: data.description }
            : unit,
        ),
      );
      setEditingUnit(null);
    } else {
      const newUnit: UnitRecord = {
        id: `u-${Date.now()}`,
        title: data.title,
        description: data.description,
        completed: false,
      };
      setUnits([...units, newUnit]);
    }
    setIsAddingUnit(false);
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setIsAddingUnit(true);
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
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#6fffd9] text-[#00382c] hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full font-headline font-semibold text-sm shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Unit
        </button>
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
                className="flex items-center justify-between gap-3 bg-[#262a31]/45 border border-[#3b4a44]/55 p-3 rounded-lg text-sm text-[#dfe2eb] transition-colors hover:border-[#84948e]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#00e5bc] text-[18px] leading-none shrink-0 select-none">
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
          return (
            <div
              key={unit.id}
              className={`bg-[#1c2026] border p-5 rounded-xl flex items-start gap-4 shadow-sm transition-all hover:shadow-md ${unit.completed
                ? "border-[#00e5bc]/50 bg-[#1c2026]/80"
                : "border-[#3b4a44] hover:border-[#84948e]"
                }`}
            >
              {/* Checkbox Icon */}
              <button
                onClick={() => handleToggleComplete(unit.id)}
                className="text-[#84948e] hover:text-[#00e5bc] transition-colors cursor-pointer shrink-0 mt-0.5"
                title={unit.completed ? "Mark as Incomplete" : "Mark as Completed"}
              >
                <span className={`material-symbols-outlined text-[24px] select-none ${unit.completed ? "text-[#00e5bc]" : "text-[#84948e]"}`}>
                  {unit.completed ? "check_box" : "check_box_outline_blank"}
                </span>
              </button>

              {/* Title & Description */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-base md:text-lg text-[#dfe2eb]">
                      {unit.title}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 uppercase tracking-wider ${unit.completed
                        ? "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"
                        : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                        }`}
                    >
                      {unit.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* Actions (Edit) */}
                  <button
                    onClick={() => {
                      setEditingUnit(unit);
                      setIsAddingUnit(true);
                    }}
                    className="text-[#84948e] hover:text-[#6fffd9] transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#262a31] shrink-0"
                    title="Edit Unit"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>

                {unit.description && (
                  <p className="text-sm leading-relaxed font-light text-[#b9cac3]">
                    {unit.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add/Edit Unit Modal ── */}
      {isAddingUnit && (
        <AddCurriculumModal
          editingUnit={editingUnit}
          onClose={() => {
            setIsAddingUnit(false);
            setEditingUnit(null);
          }}
          onSave={handleSaveUnit}
        />
      )}
    </div>
  );
}






