// --- Types ---
type UnitStatus = "Green" | "Amber" | "Gray";

interface UnitRecord {
  id: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  status: UnitStatus;
}

export default function CurriculumPage() {
  // --- Mock Data (Based on the image) ---
  const units: UnitRecord[] = [
    {
      id: "u1",
      title: "Unit 1: Algebra fundamentals",
      completedLessons: 10,
      totalLessons: 10,
      status: "Green",
    },
    {
      id: "u2",
      title: "Unit 2: Linear equations",
      completedLessons: 6,
      totalLessons: 8,
      status: "Green",
    },
    {
      id: "u3",
      title: "Unit 3: Quadratic equations",
      completedLessons: 4,
      totalLessons: 10,
      status: "Amber",
    },
    {
      id: "u4",
      title: "Unit 4: Geometry — Lines & angles",
      completedLessons: 0,
      totalLessons: 8,
      status: "Gray",
    },
    {
      id: "u5",
      title: "Unit 5: Statistics & probability",
      completedLessons: 0,
      totalLessons: 6,
      status: "Gray",
    },
  ];

  // Helper functions for badge styling
  const getBadgeStyle = (status: UnitStatus) => {
    switch (status) {
      case "Green":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"; // Primary container color
      case "Amber":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"; // Warning color
      case "Gray":
      default:
        return "bg-[#31353c] text-[#84948e] border border-[#3b4a44]"; // Neutral surface color
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Curriculum
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Lesson plans and unit progress
        </p>
      </div>

      {/* ── Context Label ── */}
      <div className="text-[13px] font-semibold text-[#bdc2ff] uppercase tracking-wide">
        Class: Grade 8A <span className="mx-1.5 text-[#3b4a44]">·</span>{" "}
        Mathematics <span className="mx-1.5 text-[#3b4a44]">·</span> Term 2
      </div>

      {/* ── Units List ── */}
      <div className="space-y-4">
        {units.map((unit) => {
          // Calculate progress percentage
          const progressPercentage =
            unit.totalLessons > 0
              ? Math.round((unit.completedLessons / unit.totalLessons) * 100)
              : 0;

          return (
            <div
              key={unit.id}
              className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex flex-col shadow-sm transition-colors hover:border-[#84948e]"
            >
              {/* Card Header (Title & Badge) */}
              <div className="flex justify-between items-start gap-4 mb-1">
                <h2 className="text-[#dfe2eb] font-bold text-base md:text-lg">
                  {unit.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${getBadgeStyle(
                    unit.status,
                  )}`}
                >
                  {unit.status}
                </span>
              </div>

              {/* Subtext */}
              <p className="text-[#84948e] text-sm mb-4">
                {unit.completedLessons}/{unit.totalLessons} lessons completed
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-[#31353c] rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-[#a8afff]"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
