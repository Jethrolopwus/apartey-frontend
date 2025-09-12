"use client";
import React, { useState } from "react";
import { Heart, MessageSquare, Home, Trash2 } from "lucide-react";
import { useEffect } from "react";
import socket from "@/utils/socket";
import { toast } from "react-hot-toast";
import { Notification, useGetAllNotificationsQuery } from "@/Hooks/use-getAllNotifications.query";
import { useUpdateAllNotificationsAsReadMutation } from "@/Hooks/use-updateAllNotificationsAsRead.mutation";
import { useDeleteNotificationById } from "@/Hooks/use-deleteNotification";
import NotificationModal, { NotificationModalData } from "./NotificationModal";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}

const Notifications: React.FC = () => {
  const [selectedNotification, setSelectedNotification] = useState<NotificationModalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, error } = useGetAllNotificationsQuery();
  const { mutate: markAllAsRead, isLoading: isMarkingRead } =
    useUpdateAllNotificationsAsReadMutation();
  const { mutate: deleteNotification, isPending: isDeleting } =
    useDeleteNotificationById();

  useEffect(() => {
    socket.on("new_notification", (notification) => {
      toast.success(notification.message);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  // Function to handle notification click and convert to modal data
  const handleNotificationClick = (notification: Notification) => {
    // Convert API notification to modal data format
    const modalData: NotificationModalData = {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message || notification.title,
      timestamp: notification.createdAt,
      user: {
        name: notification.sender?.firstName || "Unknown User",
        avatar: notification.sender?.profilePicture || "/Festus.png",
      },
      // For now, we'll use metadata if available, otherwise show generic info
      property: notification.metadata?.propertyTitle ? {
        name: notification.metadata.propertyTitle,
        rating: 4, // Default rating since it's not in the API
      } : undefined,
      review: notification.type === "like" ? {
        content: notification.message,
        amenities: ["General"], // Default amenity since it's not in the API
      } : undefined,
    };

    setSelectedNotification(modalData);
    setIsModalOpen(true);
  };

  // Function to handle view details
  const handleViewDetails = () => {
    // For now, just close the modal without navigation
    setIsModalOpen(false);
    // TODO: Add navigation logic based on notification type when needed
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };
  // Map API notifications to NotificationItem[] for display
  const notifications: NotificationItem[] = (data || []).map(
    (n: Notification) => {
      let icon: React.ReactNode;
      switch (n.type) {
        case "like":
          icon = <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />;
          break;
        case "message":
          icon = (
            <MessageSquare className="w-5 h-5 text-orange-500 fill-orange-500" />
          );
          break;
        case "approval":
          icon = <Home className="w-5 h-5 text-black-500" />;
          break;
        default:
          icon = <Home className="w-5 h-5 text-black-500" />;
      }

      return {
        id: n._id,
        type: n.type,
        title: n.title,
        timestamp: n.createdAt,
        icon,
      };
    }
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212] mx-auto"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load notifications.
      </div>
    );
  }

  return (
    <div className="max-w-xl  mx-auto  rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-steal-800">
            Notifications
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white  py-12 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">
            Recent Notifications
          </h2>
          <button
            className="text-sm text-gray-500 hover:text-blue-700 transition-colors disabled:opacity-50"
            onClick={() => markAllAsRead()}
            disabled={isMarkingRead}
          >
            {isMarkingRead ? "Marking..." : "Mark as Read"}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-8">
          {notifications.map((notification) => {
            // Find the original notification data for modal
            const originalNotification = data?.find((n: Notification) => n._id === notification.id);
            
            return (
              <div
                key={notification.id}
                className="flex items-center gap-3 p-6 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer"
                style={{ backgroundColor: "#FFF4EA" }}
                onClick={() => originalNotification && handleNotificationClick(originalNotification)}
              >
                {/* Icon */}
                <div className="flex-shrink-0">{notification.icon}</div>

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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the notification click
                      deleteNotification(notification.id);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        notification={selectedNotification}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Notifications;
