import { useState, useMemo } from "react";

// ── Types ───────────────────────────────────────────────────────────────────
type Level = "Beginner" | "Intermediate" | "Advanced";


interface Course {
  id: number;
  title: string;
  level: Level;
  dur: number;
  price: number;
  instr: string;
  desc: string;
}

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED: Course[] = [
  {
    id: 1,
    title: "UI/UX Design Fundamentals",
    level: "Beginner",
    dur: 18,
    price: 49,
    instr: "Sara Kim",
    desc: "Master the basics of visual design and user experience.",
  },
  {
    id: 2,
    title: "Full-Stack Web Development",
  
    level: "Intermediate",
    dur: 60,
    price: 129,
    instr: "Alex Torres",
    desc: "Build complete web applications using the MERN stack.",
  },
  {
    id: 3,
    title: "Python for Data Science",
    level: "Beginner",
    dur: 30,
    price: 0,
    instr: "Mia Chen",
    desc: "Learn data analysis and visualization with Python libraries.",
  },
];

const PER_PAGE = 6;
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];


// ── Sub-components ──────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const styles: Record<Level, string> = {
    Beginner: "bg-[#0d2a20] text-[#6fffd9]",
    Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
    Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
  };
  return (
    <span
      className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[level]}`}
    >
      {level}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  editing: Course | null;
  onClose: () => void;
  onSave: (
    data: Omit<Course, "id" | "enroll" | "rating" | "cat">
  ) => void;
}

function CourseModal({ editing, onClose, onSave }: ModalProps) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [level, setLevel] = useState<Level>(editing?.level ?? "Beginner");
  const [dur, setDur] = useState(editing?.dur ?? 0);
  const [price, setPrice] = useState(editing?.price ?? 0);
  const [instr, setInstr] = useState(editing?.instr ?? "");
  const [desc, setDesc] = useState(editing?.desc ?? "");

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  function handleSubmit() {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      level,
      dur,
      price,
      instr: instr.trim() || "Instructor",
      desc: desc.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[950px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
        <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
          {editing ? "Edit Course" : "Add New Course"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Fields */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced React Patterns"
              />
            </div>

            {/* Reorganized Row: Level and Instructor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Level</label>
                <select
                  className={inputClass}
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                >
                  {LEVELS.map((l) => (
                    <option key={l} className="bg-[#1c2026]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Instructor</label>
                <input
                  className={inputClass}
                  value={instr}
                  onChange={(e) => setInstr(e.target.value)}
                  placeholder="Instructor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration (hrs)</label>
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  value={dur || ""}
                  onChange={(e) => setDur(Number(e.target.value))}
                  placeholder="e.g. 24"
                />
              </div>
              <div>
                <label className={labelClass}>Price (INR)</label>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  step={0.01}
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0 = Free"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Description */}
          <div className="flex flex-col">
            <label className={labelClass}>Course Description</label>
            <textarea
              className={`${inputClass} flex-1 min-h-[200px] lg:min-h-0 resize-none`}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Provide a detailed overview of the course content..."
            />
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
            onClick={handleSubmit}
            className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity"
          >
            {editing ? "Save Changes" : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | number | null>(null);
  const [nextId, setNextId] = useState(SEED.length + 1);

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        if (
          search &&
          !c.title.toLowerCase().includes(search.toLowerCase()) &&
          !c.instr.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (filterLevel && c.level !== filterLevel) return false;
    
        return true;
      }),
    [courses, search, filterLevel]
  );

  const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, pages);
  const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const editingCourse =
    typeof modal === "number"
      ? courses.find((c) => c.id === modal) ?? null
      : null;

  function handleSave(
    data: Omit<Course, "id" | "enroll" | "rating" | "cat">
  ) {
    if (typeof modal === "number") {
      setCourses((prev) =>
        prev.map((c) => (c.id === modal ? { ...c, ...data } : c))
      );
    } else {
      const idx = nextId;
      setCourses((prev) => [
        ...prev,
        {
          ...data,
          id: idx,
        },
      ]);
      setNextId((n) => n + 1);
    }
    setModal(null);
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const selectClass =
    "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
            <div>
              <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
                Course Catalog
              </h1>
              <p className="text-[0.875rem] text-[#b9cac3] mt-1">
                Manage and monitor your learning content
              </p>
            </div>
            <button
              onClick={() => setModal("add")}
              className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
             <span className="material-symbols-outlined">Add</span>  Add Course
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search courses or instructors..."
                className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[1rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
              />
            </div>
            <select
              className={selectClass}
              value={filterLevel}
              onChange={(e) => {
                setFilterLevel(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Levels</option>
              {LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          
          </div>

          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#181c22] border-b border-[#3b4a44]">
                    {["Course", "Level", "Duration", "Price", ""].map((h, i) => (
                      <th
                        key={i}
                        className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]">
                  {sliced.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    sliced.map((c) => (
                      <tr key={c.id} className="group hover:bg-[#262a31] transition-colors">
                        <td className="p-4 align-middle">
                          <div className="min-w-0">
                            <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
                              {c.title}
                            </div>
                            <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
                              Instructor: {c.instr}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <LevelBadge level={c.level} />
                        </td>
                        <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
                          {c.dur}h
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
                            {c.price === 0 ? "Free" : `$${c.price}`}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setModal(c.id)}
                              className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-[#3b4a44]">
              <span className="text-[0.8rem] text-[#b9cac3]">
                Showing {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                {Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-[8px] text-[0.8rem] border transition-all ${
                      p === safePage
                        ? "bg-[#6fffd9] text-[#00382c] border-[#6fffd9]"
                        : "bg-[#262a31] text-[#b9cac3] border-[#3b4a44]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal !== null && (
        <CourseModal
          editing={editingCourse}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}