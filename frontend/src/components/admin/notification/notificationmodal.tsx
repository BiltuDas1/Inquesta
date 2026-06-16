// --- Types ---
export interface NotificationItem {
  id: number | string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: string;
  iconColor: string;
  bgColor: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  onNotificationClick?: (index: number) => void;
}

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAllRead,
  onViewAll,
  onNotificationClick
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute font-headline right-[-48px] sm:right-0 top-[calc(100%+12px)] w-[320px] sm:w-96 bg-[#1c2026] border border-[#3b4a44] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[60] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* ── Dropdown Header ── */}
      <div className="px-4 py-3 border-b border-[#3b4a44] flex items-center justify-between bg-[#262a31]/50">
        <h3 className="font-headline font-bold text-[#dfe2eb]">
          Notifications
        </h3>
        {onMarkAllRead && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs text-[#6fffd9] hover:text-[#00e5bc] font-medium transition-colors focus:outline-none"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Notification List ── */}
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar divide-y divide-[#3b4a44]/50">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div
              key={notif.id}
              onClick={() => {
                onClose();
                if (onNotificationClick) {
                  onNotificationClick(index);
                }
              }}
              className={`p-4 flex gap-3 hover:bg-[#262a31] transition-colors cursor-pointer ${
                notif.unread ? "bg-[#262a31]/30" : ""
              }`}
            >
              {/* Notification Icon */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center ${notif.bgColor} ${notif.iconColor}`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  {notif.icon}
                </span>
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] sm:text-sm truncate ${
                    notif.unread
                      ? "font-bold text-[#dfe2eb]"
                      : "font-medium text-[#b9cac3]"
                  }`}
                >
                  {notif.title}
                </p>
                <p className="text-xs text-[#84948e] mt-1 line-clamp-2 leading-relaxed">
                  {notif.desc}
                </p>
                <p className="text-[10px] text-[#343d96] font-bold tracking-wide mt-1.5 uppercase">
                  {notif.time}
                </p>
              </div>

              {/* Unread dot per item */}
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1 shadow-[0_0_5px_rgba(239,68,68,0.5)] z-10"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[#84948e] flex flex-col items-center justify-center h-40">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-30">
              notifications_off
            </span>
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>

      {/* ── Dropdown Footer ── */}
      <div className="p-3 border-t border-[#3b4a44] bg-[#262a31]/30 text-center">
        <button 
          onClick={() => {
            onClose();
            if (onViewAll) {
              onViewAll();
            }
          }}
          className="text-[13px] text-[#b9cac3] hover:text-[#dfe2eb] font-medium transition-colors focus:outline-none"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}