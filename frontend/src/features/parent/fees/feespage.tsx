// --- Types ---
interface FeeRecord {
  id: string;
  head: string;
  amount: string;
  dueDate: string;
  status: "Paid" | "Due" | "Pending";
  actionText: string;
}

export default function FeesPage() {
  // --- Mock Data based on the image ---
  const feeData: FeeRecord[] = [
    {
      id: "1",
      head: "Annual tuition fee",
      amount: "₹48,000",
      dueDate: "15 Apr 2025",
      status: "Paid",
      actionText: "Receipt",
    },
    {
      id: "2",
      head: "Term 2 — Activity fee",
      amount: "₹3,500",
      dueDate: "1 Jun 2025",
      status: "Due",
      actionText: "Pay now",
    },
    {
      id: "3",
      head: "Library deposit",
      amount: "₹1,000",
      dueDate: "One-time",
      status: "Paid",
      actionText: "Receipt",
    },
    {
      id: "4",
      head: "Exam fee — Mid term",
      amount: "₹800",
      dueDate: "20 Jun 2025",
      status: "Due",
      actionText: "Pay now",
    },
    {
      id: "5",
      head: "School bus (monthly)",
      amount: "₹2,200",
      dueDate: "1st of month",
      status: "Paid",
      actionText: "Receipt",
    },
    {
      id: "6",
      head: "Lab charges — Term 2",
      amount: "₹600",
      dueDate: "15 Jun 2025",
      status: "Pending",
      actionText: "Pay now",
    },
  ];

  // Helper function to color the status pills using the brand variables
  const getStatusBadgeStyle = (status: FeeRecord["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-[#00e5bc]/10 text-[#00e5bc] border border-[#00e5bc]/20";
      case "Due":
        // Using a soft amber/orange for due items to stand out from errors
        return "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20";
      case "Pending":
        // Using the brand's error color for pending items
        return "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20";
      default:
        return "bg-[#31353c] text-[#dfe2eb] border border-[#3b4a44]";
    }
  };

  return (
    <div className="min-h-screen bg-[#10141a] p-4 md:p-6 lg:p-8 font-body text-[#dfe2eb]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* --- Header Section --- */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
            Fees
          </h1>
          <p className="text-sm text-[#b9cac3] mt-1">
            Fee schedule, payments, and outstanding dues
          </p>
        </div>

        {/* --- Context Label --- */}
        <div className="mt-8 mb-4 text-[13px] font-semibold text-[#6fffd9] uppercase tracking-wide">
          Fee schedule — Arjun <span className="mx-1.5 text-[#84948e]">·</span>{" "}
          Academic Year 2025–26
        </div>

        {/* --- Fees Data Table --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm min-w-[750px]">
              <thead>
                <tr className="bg-[#262a31] text-[#dfe2eb] border-b border-[#3b4a44]">
                  <th className="py-4 px-6 font-semibold w-[35%]">Fee head</th>
                  <th className="py-4 px-6 font-semibold">Amount</th>
                  <th className="py-4 px-6 font-semibold">Due date</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4a44]/50">
                {feeData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#31353c]/50 transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[#dfe2eb]">
                      {row.head}
                    </td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.amount}</td>
                    <td className="py-4 px-6 text-[#b9cac3]">{row.dueDate}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${getStatusBadgeStyle(
                          row.status,
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {row.actionText === "Pay now" ? (
                        <button className="text-[#6fffd9] hover:text-[#00e5bc] font-semibold transition-colors flex items-center gap-1.5 focus:outline-none">
                          {row.actionText}
                          <span className="material-symbols-outlined text-[16px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:inline-block">
                            arrow_forward
                          </span>
                        </button>
                      ) : (
                        <button className="text-[#84948e] hover:text-[#dfe2eb] font-medium transition-colors flex items-center gap-1.5 focus:outline-none">
                          <span className="material-symbols-outlined text-[16px]">
                            download
                          </span>
                          {row.actionText}
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
    </div>
  );
}
