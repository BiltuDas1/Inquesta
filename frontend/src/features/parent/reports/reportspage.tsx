// --- Types ---
interface SummaryCardProps {
  label: string;
  value: string;
  subtext: string;
}

interface GradeRecord {
  subject: string;
  t1: number;
  t2: number;
  t3: number;
  finalGrade: string;
  teacher: string;
}

export default function ReportsPage() {
  // --- Mock Data ---
  const summaryCards: SummaryCardProps[] = [
    { label: "Term avg", value: "82%", subtext: "3 terms" },
    { label: "Rank in class", value: "4th", subtext: "Of 38 students" },
    { label: "Attendance", value: "94%", subtext: "This year" },
    { label: "Best subject", value: "English", subtext: "Grade A" },
  ];

  const tableData: GradeRecord[] = [
    {
      subject: "Mathematics",
      t1: 78,
      t2: 82,
      t3: 88,
      finalGrade: "B+",
      teacher: "Ms. Sharma",
    },
    {
      subject: "Science",
      t1: 72,
      t2: 76,
      t3: 80,
      finalGrade: "B",
      teacher: "Mr. Iyer",
    },
    {
      subject: "English",
      t1: 89,
      t2: 91,
      t3: 94,
      finalGrade: "A",
      teacher: "Ms. Pillai",
    },
    {
      subject: "History",
      t1: 68,
      t2: 74,
      t3: 79,
      finalGrade: "B",
      teacher: "Mr. Khan",
    },
    {
      subject: "Computer Sc.",
      t1: 85,
      t2: 88,
      t3: 92,
      finalGrade: "A-",
      teacher: "Mr. Rao",
    },
  ];

  // Helper function to color the grade pills using your brand variables
  const getGradeBadgeStyle = (grade: string) => {
    if (grade.startsWith("A")) {
      // Primary colors for top grades
      return "bg-[#00e5bc]/20 text-[#6fffd9] border border-[#00e5bc]/30";
    }
    if (grade.startsWith("B")) {
      // Secondary colors for good grades
      return "bg-[#343d96]/40 text-[#bdc2ff] border border-[#343d96]/50";
    }
    // Default fallback
    return "bg-[#31353c] text-[#dfe2eb] border border-[#3b4a44]";
  };

  return (
    <div className="min-h-screen bg-[#10141a] p-6 md:p-8 font-body text-[#dfe2eb]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
            Reports
          </h1>
          <p className="text-sm text-[#b9cac3] mt-1">
            Term-wise academic performance overview
          </p>
          <div className="mt-4 text-[13px] font-semibold text-[#6fffd9] uppercase tracking-wide">
            ARJUN — GRADE 8 <span className="mx-1.5 text-[#84948e]">·</span>{" "}
            Academic Year 2025–26
          </div>
        </div>

        {/* --- Summary Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-[#1c2026] border border-[#3b4a44] border-l-[4px] border-l-[#6fffd9] rounded-xl p-5 shadow-sm flex flex-col justify-between h-28 transition-colors hover:border-[#84948e]"
            >
              <p className="text-xs font-medium text-[#b9cac3] uppercase tracking-wider">
                {card.label}
              </p>
              <h3 className="text-3xl font-bold text-[#dfe2eb] mt-1">
                {card.value}
              </h3>
              <p className="text-xs text-[#84948e] mt-1">{card.subtext}</p>
            </div>
          ))}
        </div>

        {/* --- Grades Data Table --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#262a31] text-[#dfe2eb] border-b border-[#3b4a44]">
                  <th className="py-4 px-6 font-semibold w-[25%]">Subject</th>
                  <th className="py-4 px-6 font-semibold">T1</th>
                  <th className="py-4 px-6 font-semibold">T2</th>
                  <th className="py-4 px-6 font-semibold">T3</th>
                  <th className="py-4 px-6 font-semibold">Final grade</th>
                  <th className="py-4 px-6 font-semibold w-[30%]">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4a44]/50">
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#31353c]/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-[#dfe2eb]">
                      {row.subject}
                    </td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.t1}</td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.t2}</td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.t3}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${getGradeBadgeStyle(
                          row.finalGrade,
                        )}`}
                      >
                        {row.finalGrade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
