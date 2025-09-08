"use client";

import { Notification } from "@/Hooks/use-getAllNotifications.query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import React from "react";

dayjs.extend(relativeTime);

interface AdminNotificationModalProps {
  notificationId: string | null;
  notification: Notification;
  onClose: () => void;
}

export default function AdminNotificationModal({
  notificationId,
  notification,
  onClose,
}: AdminNotificationModalProps) {
  if (!notificationId || !notification) return null;

  return (
    <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
      <div className="bg-white relative rounded-2xl shadow-lg w-full max-w-md min-h-64 mx-4 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#2D3A4A]">
            {notification?.title}
          </h2>
          <div className="flex gap-2 items-center">
            <div className=" justify-center flex bg-[#C85212] w-[30px] h-[30px] relative rounded-full">
              {notification.sender.profilePicture ? (
                <Image
                  width={30}
                  height={30}
                  className="object-center object-cover"
                  src={notification.sender.profilePicture}
                  alt="profile"
                />
              ) : (
                <span className="text-white font-semibold">
                  {notification.sender.firstName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm truncate max-w-[80px]">{notification.sender.firstName}</p>
              {/* <span className="text-xs text-gray-400">{notification.sender.email}</span> */}
              <span className="text-xs text-gray-400 font-medium">
                {dayjs(notification.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
        <hr className="mt-2"/>
        {/* Content */}
        <p className="text-gray-700 my-4 mt-5 ">{notification?.message}</p>

        {/* Action Buttons */}
        <div className=" absolute bottom-6 right-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border cursor-pointer border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
