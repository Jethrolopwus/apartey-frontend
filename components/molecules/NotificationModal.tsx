"use client";
import React from "react";
import { Star, X } from "lucide-react";
import Image from "next/image";

export interface NotificationModalData {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  property?: {
    name: string;
    rating: number;
  };
  review?: {
    content: string;
    amenities: string[];
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationModalData | null;
  onViewDetails: (notificationId: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notification,
  onViewDetails,
}) => {
  if (!isOpen || !notification) return null;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 Hour ago";
    return `${diffInHours} Hours ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#00000070]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {notification.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="relative">
            <Image
              src={notification.user.avatar || "/default-avatar.png"}
              alt={notification.user.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{notification.user.name}</p>
            <p className="text-sm text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
          </div>
        </div>

        {/* Property Info */}
        {notification.property && (
          <div className="p-6 border-b border-gray-100">
            <p className="font-semibold text-gray-900 mb-2">
              Property: {notification.property.name}
            </p>
            <div className="flex items-center gap-1">
              {renderStars(notification.property.rating)}
            </div>
          </div>
        )}

        {/* Notification ID for debugging */}
        <div className="p-6 border-b border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">Notification ID:</p>
          <p className="text-sm text-gray-600 font-mono">
            {notification.id}
          </p>
        </div>

        {/* Message Content */}
        <div className="p-6 border-b border-gray-100">
          <p className="font-semibold text-gray-900 mb-3">Message:</p>
          <p className="text-gray-700 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Notification Type Info */}
        <div className="p-6 border-b border-gray-100">
          <p className="font-semibold text-gray-900 mb-3">Notification Type:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {notification.type}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#C85212] text-[#C85212] rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onViewDetails(notification.id)}
            className="px-6 py-2 bg-[#C85212] text-white rounded-lg font-medium hover:bg-[#A64310] transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
