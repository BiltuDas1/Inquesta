// --- Types ---
interface SummaryCard {
  label: string;
  value: string;
  subtext: string;
}

interface EnrolmentData {
  month: string;
  count: number;
}

interface EngagementData {
  role: string;
  percentage: number;
}

export default function OrganisationReportsPage() {
  // --- Mock Data (Based on the image) ---
  const summaryCards: SummaryCard[] = [
    { label: "Monthly active users", value: "1,840", subtext: "Students only" },
    { label: "Course completion", value: "64%", subtext: "Avg across courses" },
    { label: "New enrolments", value: "234", subtext: "This month" },
    { label: "Revenue collected", value: "₹4.8L", subtext: "This month" },
  ];

  // Max value used for relative width calculation in the enrolments chart
  const maxEnrolmentCount = 250;
  const enrolments: EnrolmentData[] = [
    { month: "Jan", count: 145 },
    { month: "Feb", count: 162 },
    { month: "Mar", count: 198 },
    { month: "Apr", count: 218 },
    { month: "May", count: 234 },
  ];

  const engagementData: EngagementData[] = [
    { role: "Students", percentage: 88 },
    { role: "Teachers", percentage: 76 },
    { role: "Instructors", percentage: 92 },
    { role: "Parents", percentage: 54 },
    { role: "Contributors", percentage: 68 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Reports
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Organisation-level analytics dashboard
        </p>
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
        {/* Left Column: Monthly Enrolments */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-6 uppercase border-b border-[#3b4a44]/50 pb-3">
            Monthly Enrolments
          </h2>
          <div className="space-y-5 flex-1">
            {enrolments.map((item, index) => {
              const barWidth = Math.max(
                (item.count / maxEnrolmentCount) * 100,
                2,
              );
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-10 shrink-0 text-[#dfe2eb] text-sm font-medium">
                    {item.month}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-full bg-[#31353c] rounded-r-full rounded-l-md h-3.5 overflow-hidden flex">
                      <div
                        className="h-full rounded-r-full rounded-l-md transition-all duration-1000 ease-out bg-[#343d96]"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                    <span className="w-8 shrink-0 text-right text-[#b9cac3] text-sm font-bold">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Engagement by Role */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-6 uppercase border-b border-[#3b4a44]/50 pb-3">
            Engagement by Role
          </h2>
          <div className="space-y-6 flex-1">
            {engagementData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#dfe2eb] text-sm font-medium">
                    {item.role}
                  </span>
                  <span className="text-[#b9cac3] text-sm font-bold">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-[#31353c] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-[#343d96]"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
