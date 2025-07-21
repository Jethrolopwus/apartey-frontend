"use client";
import React from 'react';
import { Heart, MessageSquare, Home, Trash2 } from 'lucide-react';
import { useEffect } from "react";
import socket from "@/utils/socket";
import { toast } from "react-hot-toast";
import { useGetAllNotificationsQuery } from "@/Hooks/use-getAllNotifications.query";
import { useUpdateAllNotificationsAsReadMutation } from "@/Hooks/use-updateAllNotificationsAsRead.mutation";
import { useDeleteNotificationById } from "@/Hooks/use-deleteNotification";

interface NotificationItem {
  id: string;
  type: 'like' | 'message' | 'approval';
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}

const Notifications: React.FC = () => {
  // Removed unused 'user' and 'notification' state to fix lint errors
  const { data, isLoading, error } = useGetAllNotificationsQuery();
  const { mutate: markAllAsRead, isLoading: isMarkingRead } = useUpdateAllNotificationsAsReadMutation();
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotificationById();


  useEffect(() => {
    socket.on("new_notification", (notification) => {
      toast.success(notification.message);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);
  // Map API notifications to NotificationItem[] for display
  const notifications: NotificationItem[] = (data || []).map((n) => {
    let icon: React.ReactNode = null;
    if (n.type === 'like') icon = <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />;
    else if (n.type === 'message') icon = <MessageSquare className="w-5 h-5 text-orange-500 fill-orange-500" />;
    else if (n.type === 'approval') icon = <Home className="w-5 h-5 text-black-500" />;
    else icon = <Home className="w-5 h-5 text-black-500" />;
    return {
      id: n.id,
      type: n.type as 'like' | 'message' | 'approval',
      title: n.title,
      timestamp: n.timestamp,
      icon,
    };
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading notifications...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Failed to load notifications.</div>;
  }

  return (
    <div className="max-w-xl  mx-auto  rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-steal-800">Notifications</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white  py-12 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">Recent Notifications</h2>
          <button
            className="text-sm text-gray-500 hover:text-blue-700 transition-colors disabled:opacity-50"
            onClick={() => markAllAsRead()}
            disabled={isMarkingRead}
          >
            {isMarkingRead ? 'Marking...' : 'Mark as Read'}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-8">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center gap-3 p-6 rounded-lg transition-colors hover:bg-gray-50"
              style={{ backgroundColor: '#FFF4EA' }}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notification.title}
                </p>
              </div>

              {/* Timestamp and Delete */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {notification.timestamp}
                </span>
                <button
                  className="ml-2 p-1 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Delete notification"
                  onClick={() => deleteNotification(notification.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;