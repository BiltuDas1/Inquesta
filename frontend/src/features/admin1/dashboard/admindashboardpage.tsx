import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router";

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

const GET_ADMIN_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    getAdminDashboardStats {
      success
      message
      data {
        totalUsers
        registeredThisMonth
        activeCourses
        pendingApprovals
        openIssues
        userBreakdown {
          role
          count
        }
        pendingActions {
          id
          title
          subtitle
          actionText
          type
        }
        activityLog {
          id
          action
          time
          dotColor
        }
      }
    }
  }
`;

interface GetAdminDashboardStatsResponse {
  getAdminDashboardStats: {
    success: boolean;
    message: string;
    data: {
      totalUsers: string;
      registeredThisMonth: string;
      activeCourses: string;
      pendingApprovals: string;
      openIssues: string;
      userBreakdown: UserBreakdownItem[];
      pendingActions: PendingAction[];
      activityLog: ActivityLogItem[];
    };
  };
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery<GetAdminDashboardStatsResponse>(GET_ADMIN_DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#6fffd9] font-bold text-xl">
        <span className="material-symbols-outlined animate-spin mr-3">
          progress_activity
        </span>
        Loading Admin Dashboard...
      </div>
    );
  }

  if (error || !data?.getAdminDashboardStats?.success) {
    return (
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center text-[#ffb4ab] font-bold text-xl">
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  const statsData = data.getAdminDashboardStats.data;

  const stats: StatCard[] = [
    { label: "Total users", value: statsData.totalUsers, subtext: `+${statsData.registeredThisMonth} this month` },
    { label: "Active courses", value: statsData.activeCourses, subtext: "0 pending review" },
    {
      label: "Pending approvals",
      value: statsData.pendingApprovals,
      subtext: "Registrations & content",
    },
  ];

  const userBreakdown: UserBreakdownItem[] = statsData.userBreakdown;
  const pendingActions: PendingAction[] = statsData.pendingActions;
  const activityLog: ActivityLogItem[] = statsData.activityLog;

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
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  onClick={() => {
                    if (action.title === "Course Enrollments" || action.title === "New registrations") {
                      navigate("/admin/students");
                    } else if (action.title === "Content submissions") {
                      navigate("/admin/courses");
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide shrink-0 mt-0.5 transition-colors focus:outline-none cursor-pointer ${getActionButtonStyle(
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
