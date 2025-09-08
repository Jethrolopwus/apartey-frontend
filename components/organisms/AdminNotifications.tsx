"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Bell, Trash2 } from "lucide-react";
import {
  Notification,
  useGetAllNotificationsQuery,
} from "@/Hooks/use-getAllNotifications.query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUpdateNotificationAsReadMutation } from "@/Hooks/use-updateNotificationAsRead.mutation";
import AdminNotificationModal from "@/app/admin/components/MessageModal";
import { useUpdateAllNotificationsAsReadMutation } from "@/Hooks/use-updateAllNotificationsAsRead.mutation";
import DeleteNotificationModal from "@/app/admin/components/DeleteNotification";

dayjs.extend(relativeTime);

// setup socket client
const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  transports: ["websocket"],
});

export default function AdminNotifications() {
  const { data, isLoading } = useGetAllNotificationsQuery();
  const { mutate } = useUpdateNotificationAsReadMutation();
  const { mutate: mutateAll } = useUpdateAllNotificationsAsReadMutation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);

  const getIcon = (type: string, isRead: boolean) => {
    const iconColor = isRead ? "#4E5562" : "#C85212";

    switch (type) {
      case "like":
        return (
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <path
              d="M19.9999 6.43865L18.7799 5.23865C16.6998 3.27152 13.9346 2.19291 11.0719 2.23196C8.20919 2.27101 5.47449 3.42463 3.44875 5.44776C1.42302 7.47089 0.26588 10.2041 0.22315 13.0668C0.180421 15.9294 1.25547 18.696 3.21992 20.7787L19.9999 37.5587L36.7799 20.7586C38.7444 18.676 39.8194 15.9094 39.7767 13.0468C39.734 10.1841 38.5768 7.45089 36.5511 5.42776C34.5254 3.40463 31.7907 2.25101 28.9279 2.21196C26.0652 2.17291 23.3001 3.25152 21.2199 5.21865L19.9999 6.43865Z"
              fill={iconColor}
            />
          </svg>
        );
      case "claim":
        return (
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <path
              d="M39.5681 15.7067C39.856 15.9226 40 16.2465 40 16.6784V38.5947C40 38.9546 39.892 39.2425 39.6761 39.4584C39.4602 39.6743 39.1543 39.8003 38.7584 39.8363H26.2888C25.9289 39.8363 25.623 39.7103 25.3711 39.4584C25.1192 39.2065 24.9933 38.9186 24.9933 38.5947V24.8295C24.9933 24.4696 24.8853 24.1638 24.6694 23.9118C24.4534 23.6599 24.1475 23.552 23.7517 23.588H16.2483C15.8884 23.588 15.6005 23.6959 15.3846 23.9118C15.1687 24.1278 15.0427 24.4337 15.0067 24.8295V38.5947C15.0067 38.9546 14.8988 39.2425 14.6829 39.4584C14.4669 39.6743 14.161 39.8003 13.7652 39.8363H1.24157C0.881691 39.8363 0.593792 39.7103 0.377868 39.4584C0.161943 39.2065 0.0359874 38.9186 0 38.5947V16.6784C0 16.2465 0.161943 15.9226 0.48583 15.7067L19.2173 0.484043C19.7571 0.0521941 20.2789 0.0521941 20.7827 0.484043L39.5681 15.7067Z"
              fill={iconColor}
            />
          </svg>
        );
      case "message":
        return (
          <svg width="20" height="20" viewBox="0 0 32 28" fill="none">
            <path
              d="M32 4V18C32 20.2 30.2 22 28 22H20V28L12 22H4C1.798 22 0 20.2 0 18V4C0 1.8 1.798 0 4 0H28C30.2 0 32 1.8 32 4Z"
              fill={iconColor}
            />
          </svg>
        );
      default:
        return (
          <Bell
            className={`w-5 h-5 ${isRead ? "text-gray-400" : "text-[#C85212]"}`}
          />
        );
    }
  };

  // fetch initial + socket updates
  useEffect(() => {
    if (data?.length) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    socket.on("notification", (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const handleMarkAsRead = (notification: Notification) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
    );

    mutate(notification._id);

    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    mutateAll();
  };

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold text-[#2D3A4A]">Notifications</h2>
      <div className="bg-white rounded-2xl shadow p-8 mt-3">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2D3A4A]">
            Recent Notifications
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold cursor-pointer text-gray-500 hover:text-[#C85212] transition-colors"
            >
              Mark all as Read
            </button>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500  min-h-40 text-center">
            No notifications yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4 max-h-96 py-4 overflow-y-auto pr-2">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`flex items-start cursor-pointer gap-4 rounded-lg p-4 ${
                  !notif.read ? "bg-[#FFF4EA]" : "bg-gray-50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(notif);
                }}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                  {getIcon(notif.type, notif.read)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {notif?.title?.charAt(0).toUpperCase() +
                        notif?.title?.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {notif.message}
                  </div>
                  {notif.metadata?.propertyTitle && (
                    <div className="text-xs text-gray-500 italic">
                      {notif.metadata.propertyTitle}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(notif);
                  }}
                  className="text-gray-400 cursor-pointer hover:text-red-500 text-xs  ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedNotification && (
          <AdminNotificationModal
            notificationId={selectedNotification._id}
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
      </div>
      {deleteTarget && (
        <DeleteNotificationModal
          notificationId={deleteTarget._id}
          message={deleteTarget.message}
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() =>
            setNotifications((prev) =>
              prev.filter((n) => n._id !== deleteTarget._id)
            )
          }
        />
      )}
    </div>
  );
}
