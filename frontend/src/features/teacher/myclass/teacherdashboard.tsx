// --- Types ---
interface StatCard {
  label: string;
  value: string;
  subtext: string;
}

interface TimetableItem {
  id: string;
  title: string;
  time: string;
}

interface ReviewItem {
  id: string;
  title: string;
  submissions: string;
  status: "Urgent" | "Due today" | "Pending";
}

interface AtRiskStudent {
  id: string;
  name: string;
  reason: string;
  status: "Alert" | "Watch";
}

export default function TeacherDashboard() {
  // --- Mock Data (Based on the image) ---
  const stats: StatCard[] = [
    { label: "My classes", value: "5", subtext: "4 active today" },
    { label: "Total students", value: "142", subtext: "Across all classes" },
    { label: "Pending reviews", value: "12", subtext: "Submissions" },
    { label: "Avg class score", value: "74%", subtext: "This term" },
  ];

  const timetable: TimetableItem[] = [
    { id: "t1", title: "Maths — Grade 8A", time: "9:00–10:00 AM" },
    { id: "t2", title: "Maths — Grade 9B", time: "11:00 AM–12:00 PM" },
    { id: "t3", title: "Extra class", time: "2:00–3:00 PM" },
  ];

  const pendingReviews: ReviewItem[] = [
    {
      id: "r1",
      title: "Algebra test — 8A",
      submissions: "32 submissions",
      status: "Urgent",
    },
    {
      id: "r2",
      title: "Geometry HW — 9B",
      submissions: "18 submissions",
      status: "Due today",
    },
    {
      id: "r3",
      title: "Problem set 3 — 8B",
      submissions: "28 submissions",
      status: "Pending",
    },
  ];

  const atRiskStudents: AtRiskStudent[] = [
    { id: "s1", name: "Rahul S.", reason: "Attendance: 72%", status: "Alert" },
    { id: "s2", name: "Meera P.", reason: "Avg score: 42%", status: "Watch" },
    { id: "s3", name: "Dev M.", reason: "Missing 3 HW", status: "Watch" },
  ];

  // Helper function for styling status badges based on urgency/brand colors
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Urgent":
      case "Alert":
        // Error color (red/pink) for high priority
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20";
      case "Due today":
      case "Watch":
        // Warning color (amber) for medium priority
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20";
      case "Pending":
      default:
        // Neutral surface color for standard status
        return "bg-[#262a31] text-[#dfe2eb] border border-[#3b4a44]";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Good morning, Ms. Kumar
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          3 classes today — 12 assignments to review
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#1c2026] border border-[#3b4a44] p-5 rounded-xl flex flex-col justify-between shadow-sm transition-colors hover:border-[#84948e]"
          >
            <span className="text-[#b9cac3] text-sm font-medium">
              {stat.label}
            </span>
            <span className="text-3xl font-bold text-[#dfe2eb] my-3">
              {stat.value}
            </span>
            <span className="text-[#84948e] text-xs">{stat.subtext}</span>
          </div>
        ))}
      </div>

      {/* ── Main Content Columns (3-Col Grid) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Today's Timetable */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            Today's Timetable
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {timetable.map((item) => (
              <div key={item.id} className="py-4 first:pt-2 flex flex-col">
                <span className="text-[#dfe2eb] font-medium">{item.title}</span>
                <span className="text-[#84948e] text-sm mt-1">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Pending Reviews */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            Pending Reviews
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {pendingReviews.map((review) => (
              <div
                key={review.id}
                className="py-4 first:pt-2 flex justify-between items-start"
              >
                <div>
                  <span className="text-[#dfe2eb] font-medium block">
                    {review.title}
                  </span>
                  <span className="text-[#84948e] text-sm mt-1 block">
                    {review.submissions}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${getBadgeStyle(review.status)}`}
                >
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: At-Risk Students */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            At-Risk Students
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                className="py-4 first:pt-2 flex justify-between items-start"
              >
                <div>
                  <span className="text-[#dfe2eb] font-medium block">
                    {student.name}
                  </span>
                  <span className="text-[#84948e] text-sm mt-1 block">
                    {student.reason}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${getBadgeStyle(student.status)}`}
                >
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
