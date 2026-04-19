import { useState, useMemo } from "react";
import {
  ADD_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
} from "../graphql/coursesOps";
import { useMutation, useQuery } from "@apollo/client/react";

// ── Types ───────────────────────────────────────────────────────────────────

type Level = "Beginner" | "Intermediate" | "Advanced";

// Course type
interface Course {
  id: string | number;
  title: string;
  level: Level;
  duration: string;
  price: number | string;
  instructorName: string;
  description: string;
}

// Course GET Response type
interface CourseGetQueryResult {
  courseGet: {
    data: Course[];
  };
}

// Course DELETE Response type
interface DeleteCourseMutationResult {
  courseDelete: {
    message: string;
    success: boolean;
  };
}

// Course UPDATE Response type
interface UpdateCourseMutationResult {
  courseUpdate: {
    message: string;
    success: boolean;
  };
}

// Convert the level into title case ──────────────────────────────────────────────────────────
const formatLevel = (l: string): Level => {
  const normalized = l.toLowerCase();
  return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as Level;
};

const PER_PAGE = 5;
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

// ── Sub-components ──────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const displayLevel = formatLevel(level);
  const styles: Record<Level, string> = {
    Beginner: "bg-[#0d2a20] text-[#6fffd9]",
    Intermediate: "bg-[#1c1d40] text-[#bdc2ff]",
    Advanced: "bg-[#2a0d10] text-[#ffb4ab]",
  };
  return (
    <span
      className={`font-headline text-[0.72rem] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap ${styles[displayLevel]}`}
    >
      {displayLevel}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  editing: Course | null;
  onClose: () => void;
  onSave: (data: Omit<Course, "id">) => void;
  isSubmitting: boolean;
}

function CourseModal({ editing, onClose, onSave, isSubmitting }: ModalProps) {
  const [formData, setFormData] = useState({
    title: editing?.title ?? "",
    level: editing?.level ? formatLevel(editing.level) : ("Beginner" as Level),
    duration: editing?.duration ? String(editing.duration) : "",
    price: editing?.price ?? "",
    instructorName: editing?.instructorName ?? "",
    description: editing?.description ?? "",
  });

  const inputClass =
    "w-full bg-[#262a31] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.6rem] text-[#dfe2eb] text-[0.875rem] font-body outline-none focus:border-[#6fffd9] placeholder:text-[#84948e]";
  const labelClass =
    "block text-[0.8rem] text-[#b9cac3] mb-[5px] font-headline font-medium";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value === "" ? "" : value,
    }));
  };

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
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Course Title *</label>
              <input
                name="title"
                className={inputClass}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced React Patterns"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Level</label>
                <select
                  name="level"
                  className={inputClass}
                  value={formData.level}
                  onChange={handleChange}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l} className="bg-[#1c2026]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Instructor</label>
                <input
                  name="instructorName"
                  className={inputClass}
                  value={formData.instructorName}
                  onChange={handleChange}
                  placeholder="Instructor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Duration</label>
                <input
                  name="duration"
                  className={inputClass}
                  type="text"
                  value={formData.duration || ""}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                />
              </div>
              <div>
                <label className={labelClass}>Price (INR)</label>
                <input
                  name="price"
                  className={inputClass}
                  type="number"
                  min={0}
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "." || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="0 = Free"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>Course Description</label>
            <textarea
              name="description"
              className={`${inputClass} flex-1 min-h-[200px] lg:min-h-0 resize-none`}
              value={formData.description}
              onChange={handleChange}
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
            onClick={() => onSave(formData)}
            disabled={isSubmitting}
            className="bg-[#6fffd9] border-none rounded-full px-6 py-[0.55rem] text-[#00382c] font-headline font-semibold text-[0.875rem] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  // Fetch the course from DB
  const { loading, error, data } = useQuery<CourseGetQueryResult>(GET_COURSES);

  // Add the course into the DB
  const [addCourse, { loading: adding }] = useMutation(ADD_COURSE, {
    refetchQueries: [{ query: GET_COURSES }],
  });

  // Delete the selected course from the DB
  const [deleteCourse] = useMutation<DeleteCourseMutationResult>(
    DELETE_COURSE,
    { refetchQueries: [{ query: GET_COURSES }] },
  );

  // Update the selected course
  const [updateCourse, { loading: updating }] =
    useMutation<UpdateCourseMutationResult>(UPDATE_COURSE, {
      refetchQueries: [{ query: GET_COURSES }],
    });

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | string | number | null>(null);

  const courses: Course[] = data?.courseGet?.data || [];

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        if (
          search &&
          !c.title.toLowerCase().includes(search.toLowerCase()) &&
          !c.instructorName.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (filterLevel && c.level !== filterLevel) return false;
        return true;
      }),
    [courses, search, filterLevel],
  );

  const pages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const safePage = Math.min(page, pages);
  const sliced = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const editingCourse =
    typeof modal === "string" || typeof modal === "number"
      ? (courses.find((c) => c.id === modal) ?? null)
      : null;

  async function handleSave(formData: Omit<Course, "id">) {
    try {
      // Add course
      if (modal == "add") {
        await addCourse({
          variables: {
            title: formData.title,
            description: formData.description,
            level: formData.level,
            instructor_name: formData.instructorName,
            duration: String(formData.duration),
            price: Number(formData.price),
          },
        });
      }
      // Update course
      else if (modal != null) {
        await updateCourse({
          variables: {
            id: String(modal), // The modal state holds the ID when editing
            title: formData.title,
            description: formData.description,
            level: formData.level,
            instructor_name: formData.instructorName,
            duration: String(formData.duration),
            price: Number(formData.price),
          },
        });
      }

      setModal(null);
    } catch (e) {
      console.error("Error saving course:", e);
    }
  }

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await deleteCourse({
          variables: { id },
        });

        if (data?.courseDelete?.success) {
          console.log("Deleted:", data.courseDelete.message);
        } else {
          alert(`Delete failed: ${data?.courseDelete?.message}`);
        }
      } catch (e: any) {
        console.error("Delete Error:", e);
        alert(`Error: ${e.message}`);
      }
    }
  };

  const selectClass =
    "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  if (loading)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9]">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-red-400">
        Error: {error.message}
      </div>
    );

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
              <span className="material-symbols-outlined">Add</span> Add Course
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
                    {["Course", "Level", "Duration", "Price", ""].map(
                      (h, i) => (
                        <th
                          key={i}
                          className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4a44]">
                  {sliced.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-12 text-[#b9cac3]"
                      >
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    sliced.map((c) => (
                      <tr
                        key={c.id}
                        className="group hover:bg-[#262a31] transition-colors"
                      >
                        <td className="p-4 align-middle">
                          <div className="min-w-0">
                            <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
                              {c.title}
                            </div>
                            <div className="text-[0.75rem] text-[#b9cac3] mt-[2px] truncate">
                              Instructor: {c.instructorName}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <LevelBadge level={c.level} />
                        </td>
                        <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
                          {c.duration}
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">
                            {c.price === 0 ? "Free" : `₹  ${c.price}`}
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
                Showing{" "}
                {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                {Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
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
          isSubmitting={adding || updating}
        />
      )}
    </>
  );
}
