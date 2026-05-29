import { useState, useMemo } from "react";

// --- Types & Interfaces ---
interface SubjectGrades {
  id: string;
  subject: string;
  overallGrade: string;
  terms: {
    term1: number;
    term2: number;
    term3: number;
    term4: number;
  };
  barColor: string;
}

type TermKey = "term1" | "term2" | "term3" | "term4";

export default function GradesPage() {
  // --- State for Interactive Overview ---
  const [selectedTerm, setSelectedTerm] = useState<TermKey>("term1");

  // --- Mock Data ---
  const gradesData: SubjectGrades[] = useMemo(
    () => [
      {
        id: "1",
        subject: "Mathematics",
        overallGrade: "B+",
        terms: { term1: 84, term2: 78, term3: 88, term4: 91 },
        barColor: "bg-[#1e619b]", // Deep blue
      },
      {
        id: "2",
        subject: "Science",
        overallGrade: "B",
        terms: { term1: 79, term2: 72, term3: 76, term4: 88 },
        barColor: "bg-[#12684e]", // Forest green
      },
      {
        id: "3",
        subject: "English",
        overallGrade: "A",
        terms: { term1: 91, term2: 89, term3: 94, term4: 90 },
        barColor: "bg-[#8774e1]", // Purple
      },
      {
        id: "4",
        subject: "History",
        overallGrade: "B",
        terms: { term1: 75, term2: 68, term3: 75, term4: 82 },
        barColor: "bg-[#814e13]", // Brown
      },
      {
        id: "5",
        subject: "Computer Science",
        overallGrade: "A-",
        terms: { term1: 88, term2: 90, term3: 85, term4: 88 },
        barColor: "bg-[#6fffd9]", // Luminary Primary (Cyan)
      },
    ],
    [],
  );

  // --- Helpers ---
  const getGradePillStyles = (grade: string) => {
    if (grade.startsWith("A")) {
      return "bg-[#6fffd9]/10 text-[#6fffd9] border border-[#6fffd9]/20"; // Excellent
    }
    if (grade.startsWith("B")) {
      return "bg-[#bdc2ff]/10 text-[#bdc2ff] border border-[#bdc2ff]/20"; // Good
    }
    if (grade.startsWith("C")) {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20"; // Average
    }
    return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20"; // Needs Improvement
  };

  const termLabels: Record<TermKey, string> = {
    term1: "Term 1",
    term2: "Term 2",
    term3: "Term 3",
    term4: "Term 4",
  };

  return (
    // Fixed wrapper to keep scrolling contained within the component
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb] overflow-y-auto custom-scrollbar">
      {/* --- Header Section --- */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-headline font-bold text-[#dfe2eb]">
          Grades
        </h1>
        <p className="text-[#84948e] mt-1">
          Subject-wise grade report and term trends
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* --- Left Column: Data Table --- */}
        <div className="flex-1 min-w-0 overflow-auto custom-scrollbar rounded-xl border border-[#3b4a44] bg-[#1c2026] shadow-lg xl:mb-0 mb-8 h-fit">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#262a31] sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44]">
                  Subject
                </th>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44]">
                  Grade
                </th>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] text-center">
                  Term 1
                </th>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] text-center">
                  Term 2
                </th>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] text-center">
                  Term 3
                </th>
                <th className="py-4 px-6 font-headline font-semibold text-sm text-[#dfe2eb] border-b border-[#3b4a44] text-center">
                  Term 4
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a44]/50">
              {gradesData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#262a31]/40 transition-colors group"
                >
                  <td className="py-4 px-6 text-[#dfe2eb] font-medium text-sm">
                    {row.subject}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center justify-center w-10 py-1 rounded-full text-xs font-bold ${getGradePillStyles(
                        row.overallGrade,
                      )}`}
                    >
                      {row.overallGrade}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm text-center">
                    {row.terms.term1}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm text-center">
                    {row.terms.term2}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm text-center">
                    {row.terms.term3}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3] text-sm text-center">
                    {row.terms.term4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Right Column: Performance Overview --- */}
        <div className="w-full xl:w-[450px] shrink-0 rounded-xl border border-[#3b4a44] bg-[#1c2026] shadow-lg p-6 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-headline font-bold text-[#6fffd9]">
              Term performance overview
            </h2>

            {/* Interactive Select for Terms */}
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value as TermKey)}
              className="bg-[#262a31] border border-[#3b4a44] text-[#dfe2eb] text-sm rounded-lg focus:ring-[#6fffd9] focus:border-[#6fffd9] block p-2 outline-none cursor-pointer"
            >
              {Object.entries(termLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            {gradesData.map((row) => {
              const score = row.terms[selectedTerm];

              return (
                <div
                  key={`overview-${row.id}`}
                  className="flex items-center gap-4"
                >
                  {/* Subject Name */}
                  <div className="w-32 truncate text-[#b9cac3] text-sm font-medium">
                    {row.subject}
                  </div>

                  {/* Progress Bar Track */}
                  <div className="flex-1 h-3.5 bg-[#31353c] rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        row.subject === "Computer Science"
                          ? "bg-gradient-to-r from-[#00614f] to-[#6fffd9]" // Special gradient for primary brand color
                          : row.barColor
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>

                  {/* Score Number */}
                  <div className="w-8 text-right text-[#dfe2eb] text-sm font-bold">
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
