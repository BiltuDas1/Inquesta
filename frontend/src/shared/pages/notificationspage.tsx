import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const GET_NOTIFICATIONS = gql`
  query getNotifications {
    getNotifications {
      success
      message
      data {
        title
        description
      }
    }
  }
`;

interface NotificationData {
  title: string;
  description: string;
}

interface GetNotificationsResponse {
  getNotifications: {
    success: boolean;
    message: string;
    data: NotificationData[] | null;
  };
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, refetch } = useQuery<GetNotificationsResponse>(GET_NOTIFICATIONS, {
    fetchPolicy: "network-only",
  });

  const [readKeys, setReadKeys] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("read_notifications");
    if (stored) {
      try {
        setReadKeys(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const notificationsList = useMemo(() => {
    const raw = data?.getNotifications?.success && data?.getNotifications?.data
      ? data.getNotifications.data
      : [];
    return raw.map((item, idx) => {
      const key = `${item.title}-${item.description}`;
      return {
        id: idx,
        key,
        title: item.title,
        description: item.description,
        unread: !readKeys.includes(key),
      };
    });
  }, [data, readKeys]);

  const handleMarkAllRead = () => {
    const allKeys = notificationsList.map((n) => n.key);
    localStorage.setItem("read_notifications", JSON.stringify(allKeys));
    setReadKeys(allKeys);
  };

  const handleMarkSingleRead = (key: string) => {
    if (!readKeys.includes(key)) {
      const updated = [...readKeys, key];
      localStorage.setItem("read_notifications", JSON.stringify(updated));
      setReadKeys(updated);
    }
  };

  const handleNotificationClick = (notif: typeof notificationsList[number]) => {
    handleMarkSingleRead(notif.key);
    // Navigate to detail page relative to current base path
    // e.g. /students/notifications -> /students/notifications/0
    const basePath = location.pathname.endsWith("/notifications")
      ? location.pathname
      : location.pathname.replace(/\/$/, "") + "/notifications";
    navigate(`${basePath}/${notif.id}`);
  };

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb] overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full space-y-6">

        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-[#dfe2eb]">
              All Notifications
            </h1>
            <p className="text-sm text-[#b9cac3] mt-1">
              Stay updated with your courses and campus announcements
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="bg-[#262a31] hover:bg-[#323741] text-[#dfe2eb] border border-[#3b4a44] font-bold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
            {notificationsList.some((n) => n.unread) && (
              <button
                onClick={handleMarkAllRead}
                className="bg-[#6fffd9] hover:bg-[#5ee6c3] text-[#10141a] font-bold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none"
              >
                <span className="material-symbols-outlined text-lg">done_all</span>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* --- Notifications List Container --- */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-[#6fffd9]">Loading notifications...</div>
          ) : notificationsList.length === 0 ? (
            <div className="p-12 text-center text-[#84948e] flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-5xl mb-3 opacity-30">
                notifications_off
              </span>
              <p className="text-base font-semibold">No notifications yet</p>
              <p className="text-sm mt-1">We will notify you when something comes up!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3b4a44]/50">
              {notificationsList.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-5 flex gap-4 hover:bg-[#262a31]/40 transition-colors cursor-pointer relative ${notif.unread ? "bg-[#262a31]/20" : ""
                    }`}
                >
                  {/* Notification Status Indicator Icon */}
                  <div
                    className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${notif.unread ? "bg-[#ff5449]/10 text-[#ff5449]" : "bg-[#84948e]/10 text-[#84948e]"
                      }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {notif.unread ? "mail" : "drafts"}
                    </span>
                  </div>

                  {/* Notification Details */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm sm:text-base truncate ${notif.unread ? "font-bold text-[#dfe2eb]" : "font-medium text-[#b9cac3]"
                          }`}
                      >
                        {notif.title}
                      </h3>
                      {notif.unread && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ff5449]/20 text-[#ff5449] border border-[#ff5449]/30">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#b9cac3] mt-1.5 leading-relaxed line-clamp-2">
                      {notif.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center shrink-0 text-[#84948e]">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
