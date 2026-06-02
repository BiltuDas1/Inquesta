// --- Types ---
interface StatCard {
  label: string;
  value: string;
  subtext: string;
}

interface UserBreakdownItem {
  role: string;
  count: string;
}

interface PendingAction {
  id: string;
  title: string;
  subtitle: string;
  actionText: string;
  type: "blue" | "amber" | "red";
}

interface ActivityLogItem {
  id: string;
  action: string;
  time: string;
  dotColor: string;
}

export default function AdminDashboardPage() {
  // --- Mock Data (Based on the image) ---
  const stats: StatCard[] = [
    { label: "Total users", value: "2,416", subtext: "+34 this week" },
    { label: "Active courses", value: "148", subtext: "12 pending review" },
    {
      label: "Pending approvals",
      value: "19",
      subtext: "Registrations & content",
    },
    { label: "Open issues", value: "5", subtext: "3 high priority" },
  ];

  const userBreakdown: UserBreakdownItem[] = [
    { role: "Students", count: "1,840" },
    { role: "Teachers", count: "124" },
    { role: "Parents", count: "382" },
    { role: "Instructors", count: "58" },
  ];

  const pendingActions: PendingAction[] = [
    {
      id: "a1",
      title: "New registrations",
      subtitle: "14 awaiting approval",
      actionText: "Review",
      type: "blue",
    },
    {
      id: "a2",
      title: "Content submissions",
      subtitle: "5 awaiting approval",
      actionText: "Review",
      type: "amber",
    },
    {
      id: "a3",
      title: "Refund requests",
      subtitle: "2 open",
      actionText: "Review",
      type: "red",
    },
  ];

  const activityLog: ActivityLogItem[] = [
    {
      id: "log1",
      action: "New teacher registered",
      time: "10 min ago",
      dotColor: "bg-[#bdc2ff]",
    }, // Secondary
    {
      id: "log2",
      action: "Course flagged for review",
      time: "1 hr ago",
      dotColor: "bg-[#f59e0b]",
    }, // Warning/Amber
    {
      id: "log3",
      action: "Support ticket raised",
      time: "2 hrs ago",
      dotColor: "bg-[#ffb4ab]",
    }, // Error
    {
      id: "log4",
      action: "Payment processed",
      time: "3 hrs ago",
      dotColor: "bg-[#00e5bc]",
    }, // Primary container
  ];

  // Helper function for styling the action buttons
  const getActionButtonStyle = (type: PendingAction["type"]) => {
    switch (type) {
      case "blue":
        return "bg-[#343d96]/40 text-[#bdc2ff] border border-[#343d96]/50 hover:bg-[#343d96]"; // Secondary theme
      case "amber":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 hover:bg-[#f59e0b]/20"; // Warning theme
      case "red":
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:bg-[#ffb4ab]/20"; // Error theme
      default:
        return "bg-[#262a31] text-[#dfe2eb] border border-[#3b4a44]";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Organisation dashboard
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Green Valley Academy — Last updated just now
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
        {/* Column 1: User Breakdown */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            User Breakdown
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {userBreakdown.map((item, index) => (
              <div key={index} className="py-4 first:pt-2 flex flex-col">
                <span className="text-[#dfe2eb] font-medium block">
                  {item.role}
                </span>
                <span className="text-[#84948e] text-sm mt-1 block">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Pending Actions */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            Pending Actions
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="py-4 first:pt-2 flex justify-between items-start"
              >
                <div>
                  <span className="text-[#dfe2eb] font-medium block">
                    {action.title}
                  </span>
                  <span className="text-[#84948e] text-sm mt-1 block">
                    {action.subtitle}
                  </span>
                </div>
                <button
                  className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide shrink-0 mt-0.5 transition-colors focus:outline-none ${getActionButtonStyle(
                    action.type,
                  )}`}
                >
                  {action.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Activity Log */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-[#84948e] text-xs font-bold tracking-wider mb-2 uppercase">
            Activity Log
          </h2>
          <div className="flex-1 divide-y divide-[#3b4a44]/50">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="py-4 first:pt-2 flex items-start gap-3"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm ${log.dotColor}`}
                ></div>
                <div>
                  <span className="text-[#dfe2eb] text-sm font-medium block">
                    {log.action}
                  </span>
                  <span className="text-[#84948e] text-xs mt-1 block">
                    {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
