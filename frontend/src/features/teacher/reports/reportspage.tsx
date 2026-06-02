// --- Types ---
interface SummaryCard {
  label: string;
  value: string;
  subtext: string;
}

interface TopicScore {
  topic: string;
  score: number;
}

interface GradeDistribution {
  label: string;
  count: number;
  colorClass: string;
  textColorClass: string;
}

export default function ReportsAnalyticsPage() {
  // --- Mock Data (Based on the image) ---
  const summaryCards: SummaryCard[] = [
    { label: "Class avg", value: "74%", subtext: "This term" },
    { label: "Top score", value: "98%", subtext: "Aisha K." },
    { label: "Pass rate", value: "91%", subtext: "Above 50%" },
    { label: "Attendance", value: "88%", subtext: "Avg this month" },
  ];

  const topicScores: TopicScore[] = [
    { topic: "Algebra", score: 82 },
    { topic: "Linear eqns", score: 74 },
    { topic: "Geometry", score: 68 },
    { topic: "Statistics", score: 79 },
    { topic: "Problem solving", score: 71 },
  ];

  // Max count used to calculate relative widths for the grade bars
  const maxGradeCount = 11;

  const gradeDistribution: GradeDistribution[] = [
    {
      label: "A (90–100)",
      count: 4,
      colorClass: "bg-[#00e5bc]/20",
      textColorClass: "text-[#00e5bc]",
    },
    {
      label: "B+ (80–89)",
      count: 9,
      colorClass: "bg-[#bdc2ff]/20",
      textColorClass: "text-[#bdc2ff]",
    },
    {
      label: "B (70–79)",
      count: 11,
      colorClass: "bg-[#343d96]/40",
      textColorClass: "text-[#a8afff]",
    },
    {
      label: "C (60–69)",
      count: 7,
      colorClass: "bg-[#f59e0b]/20",
      textColorClass: "text-[#f59e0b]",
    },
    {
      label: "D (<60)",
      count: 3,
      colorClass: "bg-[#ffb4ab]/20",
      textColorClass: "text-[#ffb4ab]",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Reports
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Class performance analytics
        </p>
      </div>

      {/* ── Context Label ── */}
      <div className="text-[13px] font-semibold text-[#a8afff] uppercase tracking-wide">
        Class performance — Grade 8A{" "}
        <span className="mx-1.5 text-[#3b4a44]">·</span> Mathematics{" "}
        <span className="mx-1.5 text-[#3b4a44]">·</span> All terms
      </div>

      {/* ── Summary Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#1c2026] border border-[#3b4a44] border-l-[4px] border-l-[#343d96] rounded-xl p-5 shadow-sm flex flex-col justify-between transition-colors hover:border-[#84948e]"
          >
            <p className="text-xs font-medium text-[#b9cac3]">{card.label}</p>
            <h3 className="text-3xl font-bold text-[#dfe2eb] mt-2 mb-1">
              {card.value}
            </h3>
            <p className="text-xs text-[#84948e]">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Split Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Score Distribution by Topic */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-6 uppercase border-b border-[#3b4a44]/50 pb-3">
            Score Distribution by Topic
          </h2>
          <div className="space-y-5 flex-1">
            {topicScores.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-[#dfe2eb] text-sm font-medium truncate">
                  {item.topic}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-full bg-[#31353c] rounded-r-full rounded-l-md h-3.5 overflow-hidden flex">
                    <div
                      className="h-full rounded-r-full rounded-l-md transition-all duration-1000 ease-out bg-[#343d96]"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className="w-6 shrink-0 text-right text-[#b9cac3] text-sm font-bold">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Grade Distribution */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-6 uppercase border-b border-[#3b4a44]/50 pb-3">
            Grade Distribution
          </h2>
          <div className="space-y-5 flex-1">
            {gradeDistribution.map((grade, index) => {
              // Calculate width relative to the maximum count to ensure the bars scale nicely
              const barWidth = Math.max((grade.count / maxGradeCount) * 100, 2);

              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-24 shrink-0 text-[#dfe2eb] text-sm font-medium">
                    {grade.label}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className={`h-6 rounded-md transition-all duration-1000 ease-out flex items-center ${grade.colorClass}`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                    <span
                      className={`text-sm font-bold ${grade.textColorClass}`}
                    >
                      {grade.count}
                    </span>
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
