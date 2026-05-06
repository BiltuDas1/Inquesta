import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  ADD_COURSE,
  DELETE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
  REQUEST_UPLOAD,
} from "../graphql/coursesOps";

import { NumberedCursorPagination } from "../components/ui/cursorpagination";
import type { Course } from "../types/courses";
import { formatLevel, LEVELS, PER_PAGE } from "../utils/courseutils";
import CourseTable from "../components/courses/coursetable";
import CourseModal from "../components/courses/coursemodal";
import toast from "react-hot-toast";

// Apollo Interfaces
interface CourseGetQueryResult {
  courseGet: { data: Course[] };
}
interface RequestUploadMutationResult {
  request_upload: { success: boolean; data: { url: string; filename: string } };
}
interface DeleteCourseMutationResult {
  courseDelete: { success: boolean; message: string };
}

interface AddCourseMutationResult {
  courseAdd: { success: boolean; message: string };
}
interface UpdateCourseMutationResult {
  courseUpdate: { success: boolean; message: string };
}

export default function DashboardPage() {
  // ── State Management ──
  const [lastID, setLastID] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [modal, setModal] = useState<"add" | string | null>(null);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // ── GraphQL Hooks ──
  const { loading, error, data, refetch } = useQuery<CourseGetQueryResult>(
    GET_COURSES,
    {
      variables: { lastID: lastID, limit: PER_PAGE + 2 },
      fetchPolicy: "cache-and-network",
    },
  );

  const [requestUpload] =
    useMutation<RequestUploadMutationResult>(REQUEST_UPLOAD);
  const [addCourse, { loading: adding }] =
    useMutation<AddCourseMutationResult>(ADD_COURSE);
  const [updateCourse, { loading: updating }] =
    useMutation<UpdateCourseMutationResult>(UPDATE_COURSE);
  const [deleteCourse] = useMutation<DeleteCourseMutationResult>(DELETE_COURSE);

  // ── Data Processing & Filtering ──
  const rawCourses = data?.courseGet?.data || [];
  const cleanCourses = rawCourses.filter((course) => course.id !== lastID);

  const filtered = useMemo(() => {
    return cleanCourses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(search.toLowerCase());
      const matchLevel = !filterLevel || formatLevel(c.level) === filterLevel;
      return matchSearch && matchLevel;
    });
  }, [cleanCourses, search, filterLevel]);

  const displayCourses = filtered.slice(0, PER_PAGE);
  const hasNextPage = filtered.length > PER_PAGE;

  // ── Pagination Handlers ──
  const handleNextPage = () => {
    if (hasNextPage && displayCourses.length > 0) {
      const newCursor = displayCourses[displayCourses.length - 1].id;
      setCursorHistory((prev) => [...prev, lastID || ""]);
      setLastID(newCursor);
      setPage((p) => p + 1);
    }
  };

  const handlePreviousPage = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      const prevCursor = newHistory.pop() || null;
      setCursorHistory(newHistory);
      setLastID(prevCursor === "" ? null : prevCursor);
      setPage((p) => p - 1);
    }
  };

  const handleJumpToFirst = () => {
    setLastID(null);
    setCursorHistory([]);
    setPage(1);
  };

  // ── Action Handlers ──
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const { data: delData } = await deleteCourse({
          variables: { id: String(id) },
        });
        if (delData?.courseDelete?.success) {
          await refetch();
          if (displayCourses.length === 1 && page > 1) {
            handlePreviousPage();
          }
        } else {
          alert(`Delete failed: ${delData?.courseDelete?.message}`);
        }
      } catch (e: any) {
        console.error("Delete Error:", e);
      }
    }
  };

  async function handleSave(formData: any, file: File | null) {
    try {
      let finalIcon = formData.icon;

      if (file) {
        const { data: uploadRes } = await requestUpload({
          variables: { mimetype: file.type },
        });
        if (uploadRes?.request_upload?.success) {
          const { url, filename } = uploadRes.request_upload.data;
          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });
          finalIcon = filename;
        }
      }

      const courseVars = {
        ...formData,
        instructor_name: formData.instructorName,
        price: Number(formData.price) || 0,
        icon_name: finalIcon,
      };

      if (modal === "add") {
        const { data } = await addCourse({ variables: courseVars });
        if (data?.courseAdd?.success) {
          toast.success(data.courseAdd.message || "Course added successfully!");
        } else {
          throw new Error(data?.courseAdd?.message || "Failed to add course.");
        }
      } else if (modal != null) {
        const { data } = await updateCourse({
          variables: { ...courseVars, id: String(modal) },
        });

        // Check backend success flag and use the backend message
        if (data?.courseUpdate?.success) {
          toast.success(
            data.courseUpdate.message || "Course updated successfully!",
          );
        } else {
          throw new Error(
            data?.courseUpdate?.message || "Failed to update course.",
          );
        }
      }

      await refetch();
      setModal(null);
    } catch (e) {
      console.error("Error saving course:", e);
    }
  }

  const selectClass =
    "bg-[#1c2026] border border-[#3b4a44] rounded-[10px] px-[0.85rem] py-[0.55rem] text-[#dfe2eb] text-[0.85rem] font-body outline-none cursor-pointer focus:border-[#6fffd9]";

  // ── Render Original Layout ──
  return (
    <>
      <div className="bg-[#10141a] min-h-screen font-body text-[#dfe2eb] overflow-x-hidden pb-20">
        {loading && page === 1 ? (
          <div className="h-screen flex items-center justify-center text-[#6fffd9]">
            Loading...
          </div>
        ) : error ? (
          <div className="h-screen flex items-center justify-center text-red-400">
            Error loading courses. Please try again.
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {/* Header & Add Button */}
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
                className="inline-flex border gap-2 bg-[#6fffd9] text-[#00382c] font-headline font-bold text-[0.875rem] px-5 py-[0.6rem] rounded-[8px] border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">add</span> Add
                Course
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <div className="relative flex-1 min-w-[180px]">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleJumpToFirst();
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
                  handleJumpToFirst();
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

            {/* Table */}
            <CourseTable
              courses={displayCourses}
              onEdit={(id) => setModal(id)}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {/* {filtered.length > 0 && (
              <NumberedCursorPagination
                page={page}
                hasNext={hasNextPage}
                hasPrevious={cursorHistory.length > 0}
                onNext={handleNextPage}
                onPrevious={handlePreviousPage}
                onJumpToFirst={handleJumpToFirst}
              />
            )} */}
            {/* Pagination */}
            <NumberedCursorPagination
              page={page}
              hasNext={hasNextPage}
              hasPrevious={cursorHistory.length > 0}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              onJumpToFirst={handleJumpToFirst}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <CourseModal
          editing={displayCourses.find((c) => c.id === modal) || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isSubmitting={adding || updating}
        />
      )}
    </>
  );
}
