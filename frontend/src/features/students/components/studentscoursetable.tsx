import { Link } from "react-router";
import LevelBadge from "../../courses/components/levelbadge";
import type { Course, Level } from "../../courses/types/courses";

interface StudentCourseTableProps {
  courses: Course[];
}

export default function StudentCourseTable({
  courses,
}: StudentCourseTableProps) {
  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#181c22] border-b border-[#3b4a44]">
              {["Course", "Level", "Duration", "Action"].map((h, i) => (
                <th
                  key={i}
                  className={`p-[0.8rem_1rem] font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase ${
                    h === "Action" ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b4a44]">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-12 text-[#b9cac3]">
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr
                  key={c.id}
                  className="group hover:bg-[#262a31] transition-colors"
                >
                  {/* Course Title & Instructor */}
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

                  {/* Level Badge */}
                  <td className="p-4 align-middle">
                    <LevelBadge level={c.level as Level} />
                  </td>

                  {/* Duration */}
                  <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
                    {c.duration}
                  </td>

                  {/* Action Button (Universal "View Course") */}
                  <td className="p-4 align-middle text-right">
                    <Link
                      to={`/course/${c.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-colors duration-200 whitespace-nowrap bg-[#6fffd9] text-[#00382c] hover:bg-[#00e5bc]"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        menu_book
                      </span>
                      View Course
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
