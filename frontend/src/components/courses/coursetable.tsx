import React from "react";
import type { Course, Level } from "../../types/courses";
import LevelBadge from "./levelbadge";

interface CourseTableProps {
  courses: Course[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CourseTable({ courses, onEdit, onDelete }: CourseTableProps) {
  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#181c22] border-b border-[#3b4a44]">
              {["Course", "Level", "Duration", "Price", ""].map((h, i) => (
                <th key={i} className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b4a44]">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className="group hover:bg-[#262a31] transition-colors">
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
                    <LevelBadge level={c.level as Level} />
                  </td>
                  <td className="p-4 align-middle text-[#b9cac3] text-[0.875rem]">
                    {c.duration}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-[#dfe2eb] font-headline font-bold text-[0.95rem]">₹ {c.price}</span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(c.id)} className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c]">
                        Edit
                      </button>
                      <button onClick={() => onDelete(c.id)} className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10]">
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
    </div>
  );
}