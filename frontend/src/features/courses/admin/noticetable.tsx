// Define the shape of a Notice
export interface Notice {
  id: string | number;
  title: string;
  description: string;
  badge: string;
  isActive: boolean;
}

interface NoticeTableProps {
  notices: Notice[];
  onEdit: (id: string | number) => void;
  onUpdate: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export default function NoticeTable({
  notices,
  onEdit,
  onUpdate,
  onDelete,
}: NoticeTableProps) {
  // Helper function to color-code badges
  const getBadgeStyles = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "urgent":
        return "bg-[#3a1d1d] text-[#ffb4ab] border-[#5c2b2b]";
      case "update":
        return "bg-[#162b3a] text-[#a8d3ff] border-[#22435c]";
      default:
        return "bg-[#1c3029] text-[#6fffd9] border-[#2a4d41]";
    }
  };

  return (
    <div className="bg-[#1c2026] border border-[#3b4a44] rounded-[16px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#181c22] border-b border-[#3b4a44]">
              {["Title", "Description", "Badge", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  className="p-[0.8rem_1rem] text-left font-headline text-[0.75rem] font-bold text-[#b9cac3] tracking-widest uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3b4a44]">
            {notices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-12 text-[#b9cac3]">
                  No notices found. Click "Add Notice" to create one.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <tr
                  key={notice.id}
                  className="group hover:bg-[#262a31] transition-colors"
                >
                  <td className="p-4 align-middle">
                    <div className="min-w-0">
                      <div className="font-headline font-semibold text-[0.9rem] text-[#dfe2eb] truncate">
                        {notice.title}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div
                      className="text-[0.875rem] text-[#b9cac3] truncate max-w-[250px]"
                      title={notice.description}
                    >
                      {notice.description}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`px-3 py-[5px] rounded-full text-[0.75rem] font-headline font-bold border tracking-wide inline-block ${getBadgeStyles(
                        notice.badge,
                      )}`}
                    >
                      {notice.badge}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${notice.isActive ? "bg-[#6fffd9]" : "bg-[#ffb4ab]"}`}
                      ></div>
                      <span
                        className={`font-headline font-bold text-[0.85rem] ${notice.isActive ? "text-[#6fffd9]" : "text-[#ffb4ab]"}`}
                      >
                        {notice.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    {/* ── Three Action Buttons Row ── */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(notice.id)}
                        className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#b9cac3] cursor-pointer hover:bg-[#0d182c] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onUpdate(notice.id)}
                        className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#6fffd9] cursor-pointer hover:bg-[#1c3029]/50 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => onDelete(notice.id)}
                        className="bg-transparent border border-[#3b4a44] rounded-[8px] px-[14px] py-[5px] text-[0.78rem] font-headline font-semibold text-[#ffb4ab] cursor-pointer hover:bg-[#2a0d10] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}