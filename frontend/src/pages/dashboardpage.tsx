import { useState, useMemo } from "react";

// ── Types ───────────────────────────────────────────────────────────────────
type Level = "Beginner" | "Intermediate" | "Advanced";
type Status = "Active" | "Draft" | "Popular";
type Cat = "Design" | "Development" | "Business" | "Data Science" | "Marketing";

interface Course {
  id: number;
  title: string;
  cat: Cat;
  level: Level;
  dur: number;
  price: number;
  enroll: number;
  rating: number;
  status: Status;
  instr: string;
  tags: string[];
  iconEmoji: string;
  iconBg: string;
}

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED: Course[] = [
  { id: 1, title: "UI/UX Design Fundamentals", cat: "Design", level: "Beginner", dur: 18, price: 49, enroll: 820, rating: 4.8, status: "Popular", instr: "Sara Kim", tags: ["figma", "wireframe"], iconEmoji: "🎨", iconBg: "#0d2a1f" },
  { id: 2, title: "Full-Stack Web Development", cat: "Development", level: "Intermediate", dur: 60, price: 129, enroll: 1240, rating: 4.9, status: "Popular", instr: "Alex Torres", tags: ["react", "node"], iconEmoji: "💻", iconBg: "#161a38" },
  { id: 3, title: "Python for Data Science", cat: "Data Science", level: "Beginner", dur: 30, price: 0, enroll: 980, rating: 4.7, status: "Active", instr: "Mia Chen", tags: ["python", "pandas"], iconEmoji: "🔬", iconBg: "#0d2a2a" },
  { id: 4, title: "Advanced SQL & Analytics", cat: "Data Science", level: "Advanced", dur: 22, price: 89, enroll: 430, rating: 4.6, status: "Active", instr: "James Park", tags: ["sql", "analytics"], iconEmoji: "📊", iconBg: "#2a1010" },
  { id: 5, title: "Digital Marketing Mastery", cat: "Marketing", level: "Beginner", dur: 15, price: 39, enroll: 670, rating: 4.5, status: "Active", instr: "Lily Adams", tags: ["seo", "ads"], iconEmoji: "🎯", iconBg: "#1a2a0d" },
  { id: 6, title: "Machine Learning A–Z", cat: "Data Science", level: "Advanced", dur: 45, price: 149, enroll: 560, rating: 4.9, status: "Popular", instr: "Dr. Raj Patel", tags: ["ml", "tensorflow"], iconEmoji: "🧠", iconBg: "#1a1028" },
  { id: 7, title: "Business Strategy & OKRs", cat: "Business", level: "Intermediate", dur: 12, price: 79, enroll: 310, rating: 4.4, status: "Active", instr: "Chris Lee", tags: ["strategy", "okr"], iconEmoji: "📈", iconBg: "#0d2a1f" },
  { id: 8, title: "Motion Design with After Effects", cat: "Design", level: "Intermediate", dur: 28, price: 99, enroll: 285, rating: 4.7, status: "Draft", instr: "Zoe Hart", tags: ["motion", "ae"], iconEmoji: "🎬", iconBg: "#2a1010" },
  { id: 9, title: "React Native Mobile Apps", cat: "Development", level: "Advanced", dur: 36, price: 119, enroll: 390, rating: 4.8, status: "Active", instr: "Alex Torres", tags: ["react-native", "expo"], iconEmoji: "⚡", iconBg: "#161a38" },
  { id: 10, title: "Intro to Cloud Computing", cat: "Development", level: "Beginner", dur: 20, price: 0, enroll: 1100, rating: 4.6, status: "Active", instr: "Sam Brooks", tags: ["aws", "cloud"], iconEmoji: "🌐", iconBg: "#0d2a2a" },
  { id: 11, title: "Content Marketing 101", cat: "Marketing", level: "Beginner", dur: 10, price: 0, enroll: 740, rating: 4.3, status: "Active", instr: "Nina Rogers", tags: ["content", "writing"], iconEmoji: "📐", iconBg: "#1a2a0d" },
  { id: 12, title: "Figma Advanced Prototyping", cat: "Design", level: "Advanced", dur: 16, price: 69, enroll: 296, rating: 4.7, status: "Draft", instr: "Sara Kim", tags: ["figma", "prototype"], iconEmoji: "🚀", iconBg: "#1a1028" },
];

const PER_PAGE = 6;
const CATS: Cat[] = ["Design", "Development", "Business", "Data Science", "Marketing"];
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];
const STATUSES: Status[] = ["Active", "Draft", "Popular"];

// ── Sub-components ──────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const styles: Record<Level, string> = {
    Beginner: "bg-[#0d2a20] text-[#6fffd9]",
    Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
    Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
  };
  return (
    <span className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[level]}`}>
      {level}
    </span>
  );
}

function StatusDot({ status }: { status: Status }) {
  const dotColor: Record<Status, string> = {
    Active: "bg-[#6fffd9]",
    Draft: "bg-[#84948e]",
    Popular: "bg-[#f5c518]",
  };
  return (
    <span className="inline-flex items-center gap-[5px] text-[0.8rem] text-[#b9cac3]">
      <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 inline-block ${dotColor[status]}`} />
      {status}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  editing: Course | null;
  onClose: () => void;
  onSave: (data: Omit<Course, "id" | "enroll" | "rating" | "iconEmoji" | "iconBg">) => void;
}

function CourseModal({ editing, onClose, onSave }: ModalProps) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [cat, setCat] = useState<Cat>(editing?.cat ?? "Design");
  const [level, setLevel] = useState<Level>(editing?.level ?? "Beginner");
  const [dur, setDur] = useState(editing?.dur ?? 0);
  const [price, setPrice] = useState(editing?.price ?? 0);
  const [instr, setInstr] = useState(editing?.instr ?? "");
  const [status, setStatus] = useState<Status>(editing?.status ?? "Active");
  const [tags, setTags] = useState(editing?.tags.join(", ") ?? "");

  const inputClass = "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass = "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  function handleSubmit() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), cat, level, dur, price, instr: instr.trim() || "Instructor", status, tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
  }

  return (
    <div className="fixed border  inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[20px] p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto font-body shadow-2xl">
        <h2 className="font-headline text-[1.2rem] font-bold text-[#dfe2eb] mb-6">
          {editing ? "Edit Course" : "Add New Course"}
        </h2>

        <div className="mb-4">
          <label className={labelClass}>Course Title *</label>
          <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Advanced React Patterns" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={cat} onChange={e => setCat(e.target.value as Cat)}>
              {CATS.map(c => <option key={c} className="bg-[#1c2026]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select className={inputClass} value={level} onChange={e => setLevel(e.target.value as Level)}>
              {LEVELS.map(l => <option key={l} className="bg-[#1c2026]">{l}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelClass}>Duration (hrs)</label>
            <input className={inputClass} type="number" min={1} value={dur || ""} onChange={e => setDur(Number(e.target.value))} placeholder="e.g. 24" />
          </div>
          <div>
            <label className={labelClass}>Price (USD)</label>
            <input className={inputClass} type="number" min={0} step={0.01} value={price || ""} onChange={e => setPrice(Number(e.target.value))} placeholder="0 = Free" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelClass}>Instructor</label>
            <input className={inputClass} value={instr} onChange={e => setInstr(e.target.value)} placeholder="Instructor name" />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={status} onChange={e => setStatus(e.target.value as Status)}>
              {STATUSES.map(s => <option key={s} className="bg-[#1c2026]">{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className={labelClass}>Tags (comma separated)</label>
          <input className={inputClass} value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. react, hooks, typescript" />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="bg-transparent border border-[#3b4a44] rounded-full px-5 py-[0.55rem] text-[#b9cac3] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-80 transition-opacity">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity">
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
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | number | null>(null);
  const [nextId, setNextId] = useState(SEED.length + 1);

  const EMOJIS = ["🎨", "💻", "📊", "🚀", "📐", "🔬", "📈", "🎯", "🌐", "⚡", "🧠", "🎬"];
  const ICON_BGS = ["#0d2a1f", "#161a38", "#2a1010", "#1a2a0d", "#1a1028", "#0d2a2a"];

  const filtered = useMemo(() => courses.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.instr.toLowerCase().includes(search.toLowerCase()) && !c.cat.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterLevel && c.level !== filterLevel) return false;
    if (filterCat && c.cat !== filterCat) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  }), [courses, search, filterLevel, filterCat, filterStatus]);

  const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, pages);
  const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // const stats = {
  //   total: courses.length,
  //   active: courses.filter(c => c.status !== "Draft").length,
  //   enroll: courses.reduce((a, c) => a + c.enroll, 0),
  //   free: courses.filter(c => c.price === 0).length,
  // };

  const editingCourse = typeof modal === "number" ? courses.find(c => c.id === modal) ?? null : null;

  function handleSave(data: Omit<Course, "id" | "enroll" | "rating" | "iconEmoji" | "iconBg">) {
    if (typeof modal === "number") {
      setCourses(prev => prev.map(c => c.id === modal ? { ...c, ...data } : c));
    } else {
      const idx = nextId;
      setCourses(prev => [...prev, { ...data, id: idx, enroll: 0, rating: 4.5, iconEmoji: EMOJIS[idx % EMOJIS.length], iconBg: ICON_BGS[idx % ICON_BGS.length] }]);
      setNextId(n => n + 1);
    }
    setModal(null);
  }

  const selectClass = "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* ── Hero bar */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
            <div>
              <h1 className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-bold text-[#dfe2eb] tracking-tight">
                Course Catalog
              </h1>
              <p className="text-[0.875rem] text-[#b9cac3] mt-1">
                Manage, monitor and grow your learning content
              </p>
            </div>
            <button
              onClick={() => setModal("add")}
              className="inline-flex items-center gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-full border-none cursor-pointer whitespace-nowrap flex-shrink-0 hover:opacity-90 transition-opacity"
            >
             <span className="material-symbols-outlined ">Add</span>
              Add Course
            </button>
          </div>

          {/* ── Stats row */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { val: stats.total, lbl: "Total Courses" },
              { val: stats.active, lbl: "Active" },
              { val: stats.enroll.toLocaleString(), lbl: "Enrollments" },
              { val: stats.free, lbl: "Free Courses" },
            ].map(s => (
              <div key={s.lbl} className="bg-[#1c2026] border border-[#3b4a44] rounded-[14px] p-4 sm:p-5">
                <div className="font-headline text-[1.3rem] sm:text-[1.6rem] font-bold text-[#6fffd9] leading-tight">{s.val}</div>
                <div className="text-[0.75rem] text-[#b9cac3] mt-1">{s.lbl}</div>
              </div>
            ))}
          </div> */}

          {/* ── Search & Filters */}
          <div className="flex flex-wrap gap-3 mb-5 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#84948e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={11} cy={11} r={8} /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search courses..."
                className="w-full bg-[#1c2026] border border-[#3b4a44] rounded-[10px] pl-[2.1rem] pr-3 py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]"
              />
            </div>
            <select className={selectClass} value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setPage(1); }}>
              <option value="">All Levels</option>
              {LEVELS.map(o => <option key={o} className="bg-[#1c2026]">{o}</option>)}
            </select>
            <select className={selectClass} value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {CATS.map(o => <option key={o} className="bg-[#1c2026]">{o}</option>)}
            </select>
            <select className={selectClass} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              {STATUSES.map(o => <option key={o} className="bg-[#1c2026]">{o}</option>)}
            </select>
          </div>

          {/* ── Table Container */}
          <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#181c22] border-b border-[#3b4a44]">
                    {["Course", "Level", "Duration", "Price", "Enrolled", "Rating", "Status", ""].map((h, i) => (
                      <th
                        key={i}
                        className={`p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase whitespace-nowrap 
                          ${(i === 4 || i === 5) ? "hidden md:table-cell" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]">
                  {sliced.length === 0 ? (
                    <tr><td colSpan={8} className="text-center p-12 text-[#b9cac3] font-body">No courses found</td></tr>
                  ) : sliced.map(c => (
                    <tr key={c.id} className="group hover:bg-[#262a31] transition-colors">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div style={{ background: c.iconBg }} className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0 text-[18px]">
                            {c.iconEmoji}
                          </div>
                          <div className="min-w-0">
                            <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] leading-tight truncate">{c.title}</div>
                            <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">{c.cat} · {c.instr}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle"><LevelBadge level={c.level} /></td>
                      <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem] font-body">{c.dur}h</td>
                      <td className="p-4 align-middle">
                        {c.price === 0
                          ? <span className="text-[#6fffd9] font-headline font-bold text-[0.95rem]">Free</span>
                          : <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">${c.price}</span>
                        }
                      </td>
                      <td className="p-4 align-middle font-headline font-medium text-[#b9cac3] text-[0.875rem] hidden md:table-cell">{c.enroll.toLocaleString()}</td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 text-[0.8rem]">
                          <span className="text-[#f5c518]">★</span>
                          <span className="text-[0.85rem] text-[#dfe2eb]">{c.rating.toFixed(1)}</span>
                        </span>
                      </td>
                      <td className="p-4 align-middle"><StatusDot status={c.status} /></td>
                      <td className="p-4 align-middle text-right">
                        <button
                          onClick={() => setModal(c.id)}
                          className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c] transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-wrap items-center justify-between p-4 border-t border-[#3b4a44] gap-2">
              <span className="text-[0.8rem] text-[#b9cac3]">
                Showing {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-[8px] text-[0.8rem] font-body cursor-pointer transition-all border
                      ${p === safePage ? "bg-[#6fffd9] text-[#00382c] border-[#6fffd9]" : "bg-[#262a31] text-[#b9cac3] border-[#3b4a44] hover:border-[#84948e]"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Render */}
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



