import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/context/authcontext";
import AddCurriculumModal from "../../../components/teacher/curriculum/addcurriculummodal";

// --- GraphQL Queries and Mutations ---

const GET_TEACHER_ALLOCATED_COURSES = gql`
  query GetTeacherAllocatedCourses {
    getTeacherAllocatedCourses {
      success
      message
      data {
        courseId
        courseTitle
        teacherId
        teacherEmail
      }
    }
  }
`;

const GET_CURRICULUM_UNITS = gql`
  query GetCurriculumUnits($courseId: String!) {
    getCurriculumUnits(courseId: $courseId) {
      success
      message
      data {
        id
        courseId
        title
        description
        completed
      }
    }
  }
`;

const GET_COURSE_TAKEAWAYS = gql`
  query GetCourseTakeaways($courseId: String!) {
    getCourseTakeaways(courseId: $courseId) {
      success
      message
      data {
        id
        courseId
        takeaway
      }
    }
  }
`;

const ADD_CURRICULUM_UNIT = gql`
  mutation AddCurriculumUnit($courseId: String!, $title: String!, $description: String) {
    addCurriculumUnit(courseId: $courseId, title: $title, description: $description) {
      success
      message
    }
  }
`;

const UPDATE_CURRICULUM_UNIT = gql`
  mutation UpdateCurriculumUnit($id: String!, $title: String!, $description: String) {
    updateCurriculumUnit(id: $id, title: $title, description: $description) {
      success
      message
    }
  }
`;

const TOGGLE_CURRICULUM_UNIT_COMPLETE = gql`
  mutation ToggleCurriculumUnitComplete($id: String!) {
    toggleCurriculumUnitComplete(id: $id) {
      success
      message
    }
  }
`;

const DELETE_CURRICULUM_UNIT = gql`
  mutation DeleteCurriculumUnit($id: String!) {
    deleteCurriculumUnit(id: $id) {
      success
      message
    }
  }
`;

const ADD_COURSE_TAKEAWAY = gql`
  mutation AddCourseTakeaway($courseId: String!, $takeaway: String!) {
    addCourseTakeaway(courseId: $courseId, takeaway: $takeaway) {
      success
      message
    }
  }
`;

const DELETE_COURSE_TAKEAWAY = gql`
  mutation DeleteCourseTakeaway($id: String!) {
    deleteCourseTakeaway(id: $id) {
      success
      message
    }
  }
`;

// --- Types ---
interface UnitRecord {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TakeawayRecord {
  id: string;
  takeaway: string;
}

interface AllocatedCourse {
  courseId: string;
  courseTitle: string;
  teacherId: string | null;
  teacherEmail: string | null;
}

export default function CurriculumPage() {
  const { user } = useAuth();
  const teacherEmail = user?.email;

  // --- States ---
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [takeawayInput, setTakeawayInput] = useState("");
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitRecord | null>(null);

  // --- GraphQL Queries ---
  const { data: coursesData, loading: coursesLoading } = useQuery<{
    getTeacherAllocatedCourses: { data: AllocatedCourse[] };
  }>(GET_TEACHER_ALLOCATED_COURSES);

  const rawCourses = coursesData?.getTeacherAllocatedCourses?.data || [];
  const myCourses = rawCourses.filter((c) => c.teacherEmail === teacherEmail);

  // Auto-select first course when courses load
  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(myCourses[0].courseId);
    }
  }, [myCourses, selectedCourseId]);

  const { data: unitsData, loading: unitsLoading, refetch: refetchUnits } = useQuery<{
    getCurriculumUnits: { data: UnitRecord[] };
  }>(GET_CURRICULUM_UNITS, {
    variables: { courseId: selectedCourseId },
    skip: !selectedCourseId,
    fetchPolicy: "cache-and-network",
  });

  const { data: takeawaysData, loading: takeawaysLoading, refetch: refetchTakeaways } = useQuery<{
    getCourseTakeaways: { data: TakeawayRecord[] };
  }>(GET_COURSE_TAKEAWAYS, {
    variables: { courseId: selectedCourseId },
    skip: !selectedCourseId,
    fetchPolicy: "cache-and-network",
  });

  // --- GraphQL Mutations ---
  const [addCurriculumUnit] = useMutation<any>(ADD_CURRICULUM_UNIT);
  const [updateCurriculumUnit] = useMutation<any>(UPDATE_CURRICULUM_UNIT);
  const [toggleCurriculumUnitComplete] = useMutation<any>(TOGGLE_CURRICULUM_UNIT_COMPLETE);
  const [deleteCurriculumUnit] = useMutation<any>(DELETE_CURRICULUM_UNIT);
  const [addCourseTakeaway] = useMutation<any>(ADD_COURSE_TAKEAWAY);
  const [deleteCourseTakeaway] = useMutation<any>(DELETE_COURSE_TAKEAWAY);

  const handleAddTakeaway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }
    if (takeawayInput.trim()) {
      try {
        const { data } = await addCourseTakeaway({
          variables: { courseId: selectedCourseId, takeaway: takeawayInput.trim() },
        });
        if (data?.addCourseTakeaway?.success) {
          toast.success("Takeaway added successfully");
          setTakeawayInput("");
          refetchTakeaways();
        } else {
          toast.error(data?.addCourseTakeaway?.message || "Failed to add takeaway");
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred");
      }
    }
  };

  const handleRemoveTakeaway = async (id: string) => {
    try {
      const { data } = await deleteCourseTakeaway({
        variables: { id },
      });
      if (data?.deleteCourseTakeaway?.success) {
        toast.success("Takeaway removed successfully");
        refetchTakeaways();
      } else {
        toast.error(data?.deleteCourseTakeaway?.message || "Failed to remove takeaway");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const { data } = await toggleCurriculumUnitComplete({
        variables: { id },
      });
      if (data?.toggleCurriculumUnitComplete?.success) {
        refetchUnits();
      } else {
        toast.error(data?.toggleCurriculumUnitComplete?.message || "Failed to toggle completion status");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleSaveUnit = async (data: { title: string; description: string }) => {
    if (!selectedCourseId) {
      toast.error("No course selected");
      return;
    }
    try {
      if (editingUnit) {
        const { data: res } = await updateCurriculumUnit({
          variables: { id: editingUnit.id, title: data.title, description: data.description },
        });
        if (res?.updateCurriculumUnit?.success) {
          toast.success("Curriculum unit updated successfully");
          refetchUnits();
        } else {
          toast.error(res?.updateCurriculumUnit?.message || "Failed to update unit");
        }
      } else {
        const { data: res } = await addCurriculumUnit({
          variables: { courseId: selectedCourseId, title: data.title, description: data.description },
        });
        if (res?.addCurriculumUnit?.success) {
          toast.success("Curriculum unit created successfully");
          refetchUnits();
        } else {
          toast.error(res?.addCurriculumUnit?.message || "Failed to create unit");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsAddingUnit(false);
      setEditingUnit(null);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      const { data } = await deleteCurriculumUnit({
        variables: { id },
      });
      if (data?.deleteCurriculumUnit?.success) {
        toast.success("Curriculum unit deleted successfully");
        refetchUnits();
      } else {
        toast.error(data?.deleteCurriculumUnit?.message || "Failed to delete unit");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setIsAddingUnit(true);
  };

  // Loading indicator for main courses query
  if (coursesLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-[#b9cac3]">
        Loading courses details...
      </div>
    );
  }

  // Fallback if no courses are allocated
  if (myCourses.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full text-center">
        <h1 className="text-2xl font-bold text-[#dfe2eb]">Curriculum</h1>
        <p className="text-[#84948e] mt-4">You are not allocated to any courses yet.</p>
      </div>
    );
  }

  const selectedCourse = myCourses.find((c) => c.courseId === selectedCourseId) || myCourses[0];
  const unitsList = unitsData?.getCurriculumUnits?.data || [];
  const takeawaysList = takeawaysData?.getCourseTakeaways?.data || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
            Curriculum
          </h1>
          <p className="text-[#b9cac3] text-sm mt-1">
            Lesson plans and unit progress
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {myCourses.length > 1 && (
            <div className="flex items-center gap-3 bg-[#1c2026] border border-[#3b4a44] px-4 py-2 rounded-xl">
              <span className="text-xs font-semibold text-[#bdc2ff]">Select Course:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="bg-transparent border-none text-xs font-headline font-bold text-[#dfe2eb] outline-none cursor-pointer"
              >
                {myCourses.map((c) => (
                  <option key={c.courseId} value={c.courseId} className="bg-[#1c2026]">
                    {c.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-[#6fffd9] text-[#00382c] hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full font-headline font-semibold text-sm shadow-md cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Unit
          </button>
        </div>
      </div>

      {/* ── Context Label ── */}
      <div className="text-[13px] font-semibold text-[#bdc2ff] uppercase tracking-wide">
        Course: {selectedCourse.courseTitle}
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
        {takeawaysLoading ? (
          <div className="text-[#84948e] text-xs italic">Loading takeaways...</div>
        ) : takeawaysList.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {takeawaysList.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 bg-[#262a31]/45 border border-[#3b4a44]/55 p-3 rounded-lg text-sm text-[#dfe2eb] transition-colors hover:border-[#84948e]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#00e5bc] text-[18px] leading-none shrink-0 select-none">
                    check_circle
                  </span>
                  <span className="leading-tight font-light">{item.takeaway}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTakeaway(item.id)}
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
      {unitsLoading ? (
        <div className="text-[#84948e] text-sm text-center">Loading curriculum units...</div>
      ) : unitsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unitsList.map((unit) => {
            return (
              <div
                key={unit.id}
                className={`bg-[#1c2026] border p-5 rounded-xl flex items-start gap-4 shadow-sm transition-all hover:shadow-md ${
                  unit.completed
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
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 uppercase tracking-wider ${
                          unit.completed
                            ? "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"
                            : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                        }`}
                      >
                        {unit.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    {/* Actions (Edit & Delete) */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingUnit(unit);
                          setIsAddingUnit(true);
                        }}
                        className="text-[#84948e] hover:text-[#6fffd9] transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#262a31]"
                        title="Edit Unit"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="text-[#84948e] hover:text-[#ffb4ab] transition-colors cursor-pointer p-1 rounded-lg hover:bg-[#262a31]"
                        title="Delete Unit"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
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
      ) : (
        <div className="text-center bg-[#1c2026] border border-[#3b4a44] p-12 rounded-xl text-[#84948e]">
          No curriculum units added to this course yet. Click "Add Unit" to get started!
        </div>
      )}

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







