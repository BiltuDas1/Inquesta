import { useState } from "react";

// --- Types ---
type DocsStatus = "Complete" | "Pending";

interface RegistrationRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  applied: string;
  docsStatus: DocsStatus;
  actionType: "approve_reject" | "request_docs";
}

export default function ApprovalsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Registrations", "Content", "Refunds"];

  // --- Mock Data (Based on the image) ---
  const registrations: RegistrationRecord[] = [
    {
      id: "1",
      name: "Sunita Rao",
      email: "sunita@school.in",
      role: "Teacher",
      applied: "Today",
      docsStatus: "Complete",
      actionType: "approve_reject",
    },
    {
      id: "2",
      name: "Manish Corp.",
      email: "admin@manish.com",
      role: "Supplier",
      applied: "Today",
      docsStatus: "Pending",
      actionType: "request_docs",
    },
    {
      id: "3",
      name: "Ananya K.",
      email: "ak@gmail.com",
      role: "Instructor",
      applied: "Yesterday",
      docsStatus: "Complete",
      actionType: "approve_reject",
    },
  ];

  // Helper functions for badge styling
  const getDocsBadgeStyle = (status: DocsStatus) => {
    switch (status) {
      case "Complete":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20"; // Primary container (Green)
      case "Pending":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"; // Warning (Amber)
      default:
        return "bg-[#31353c] text-[#84948e] border border-[#3b4a44]";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-12 max-w-7xl mx-auto space-y-6 font-body text-[#dfe2eb] w-full">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-[#dfe2eb]">
          Approvals
        </h1>
        <p className="text-[#b9cac3] text-sm mt-1">
          Multi-category approval queue
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all focus:outline-none ${
              activeFilter === filter
                ? "bg-[#343d96] text-[#bdc2ff] border border-[#343d96]" // Secondary container for active state
                : "bg-[#1c2026] text-[#b9cac3] border border-[#3b4a44] hover:bg-[#262a31] hover:text-[#dfe2eb]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Section Title ── */}
      <div className="pt-4">
        <h2 className="text-[15px] font-bold text-[#bdc2ff]">
          New registrations (14)
        </h2>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm mt-2">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#262a31] text-[#dfe2eb] border-b border-[#3b4a44]">
                <th className="py-4 px-6 font-semibold w-[20%]">Name</th>
                <th className="py-4 px-6 font-semibold w-[25%]">Email</th>
                <th className="py-4 px-6 font-semibold w-[15%]">Role</th>
                <th className="py-4 px-6 font-semibold w-[15%]">Applied</th>
                <th className="py-4 px-6 font-semibold w-[10%]">Docs</th>
                <th className="py-4 px-6 font-semibold w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a44]/50">
              {registrations.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#31353c]/50 transition-colors group"
                >
                  <td className="py-4 px-6 font-medium text-[#dfe2eb]">
                    {row.name}
                  </td>
                  <td className="py-4 px-6 text-[#b9cac3]">{row.email}</td>
                  <td className="py-4 px-6 text-[#b9cac3]">{row.role}</td>
                  <td className="py-4 px-6 text-[#b9cac3]">{row.applied}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold ${getDocsBadgeStyle(
                        row.docsStatus
                      )}`}
                    >
                      {row.docsStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {row.actionType === "approve_reject" ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <button className="text-[#00e5bc] hover:text-[#6fffd9] transition-colors focus:outline-none">
                          Approve
                        </button>
                        <span className="text-[#84948e]">/</span>
                        <button className="text-[#ffb4ab] hover:text-[#ffc9c2] transition-colors focus:outline-none">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-[#bdc2ff] hover:text-[#a8afff] font-medium transition-colors focus:outline-none">
                        Request docs
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}