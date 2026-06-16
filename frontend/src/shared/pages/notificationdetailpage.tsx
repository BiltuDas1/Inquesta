import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

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

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading } = useQuery<GetNotificationsResponse>(GET_NOTIFICATIONS, {
    fetchPolicy: "cache-first",
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

  const notifications = data?.getNotifications?.success && data?.getNotifications?.data
    ? data.getNotifications.data
    : [];

  const index = Number(id);
  const notification = notifications[index] ?? null;

  // Mark as read on view
  useEffect(() => {
    if (notification) {
      const key = `${notification.title}-${notification.description}`;
      if (!readKeys.includes(key)) {
        const updated = [...readKeys, key];
        localStorage.setItem("read_notifications", JSON.stringify(updated));
        setReadKeys(updated);
      }
    }
  }, [notification]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive the "back" path by removing the /:id segment
  const backPath = location.pathname.replace(/\/\d+$/, "");

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#10141a] text-[#6fffd9] font-bold text-lg">
        <span className="material-symbols-outlined animate-spin mr-3">progress_activity</span>
        Loading...
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#10141a] text-[#dfe2eb] gap-4">
        <span className="material-symbols-outlined text-5xl text-[#84948e] opacity-40">
          error_outline
        </span>
        <p className="text-lg font-semibold text-[#84948e]">Notification not found</p>
        <button
          onClick={() => navigate(backPath)}
          className="mt-2 bg-[#262a31] hover:bg-[#323741] text-[#dfe2eb] border border-[#3b4a44] font-bold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 focus:outline-none"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to notifications
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col bg-[#10141a] font-body text-[#dfe2eb] overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto w-full space-y-6">

        {/* Back button */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-[#b9cac3] hover:text-[#dfe2eb] transition-colors text-sm font-medium focus:outline-none group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          Back to all notifications
        </button>

        {/* Notification Card */}
        <div className="bg-[#1c2026] border border-[#3b4a44] rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#3b4a44] flex items-start gap-4">
            <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center bg-[#6fffd9]/10 text-[#6fffd9]">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#dfe2eb] leading-tight">
                {notification.title}
              </h1>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-[#b9cac3] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {notification.description}
            </p>
          </div>
        </div>

        {/* Navigation between notifications */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => index > 0 && navigate(`${backPath}/${index - 1}`)}
            disabled={index <= 0}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus:outline-none ${
              index > 0
                ? "text-[#b9cac3] hover:text-[#dfe2eb] cursor-pointer"
                : "text-[#3b4a44] cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
            Previous
          </button>

          <span className="text-xs text-[#84948e]">
            {index + 1} of {notifications.length}
          </span>

          <button
            onClick={() => index < notifications.length - 1 && navigate(`${backPath}/${index + 1}`)}
            disabled={index >= notifications.length - 1}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors focus:outline-none ${
              index < notifications.length - 1
                ? "text-[#b9cac3] hover:text-[#dfe2eb] cursor-pointer"
                : "text-[#3b4a44] cursor-not-allowed"
            }`}
          >
            Next
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>

      </div>
    </div>
  );
}
