"use client";
import React from 'react';
import { Star } from 'lucide-react';

const mockNotifications = [
  {
    icon: <Star className="w-6 h-6 text-yellow-400" />, title: 'New Review Posted', message: '5-star review received for City Center Condo', user: 'Mike Wilson', time: '2 Hours ago',
  },
  {
    icon: <span className="w-6 h-6 rounded-full bg-yellow-200 inline-block" />, title: 'User Feedback Submitted', message: '4-star feedback received for Lakeside Villa', user: 'Sarah Johnson', time: '1 Hour ago',
  },
  {
    icon: <span className="w-6 h-6 rounded-full bg-yellow-200 inline-block" />, title: 'Message Received', message: 'Inquiry about availability for Oceanview Apartment', user: 'John Smith', time: '30 Minutes ago',
  },
  {
    icon: <span className="w-6 h-6 rounded-full bg-yellow-200 inline-block" />, title: 'Reservation Confirmed', message: 'Booking confirmed for Mountain Retreat from Dec 10-15', user: 'Emily Davis', time: '15 Minutes ago',
  },
];

export default function AdminNotifications() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-transparent p-0 mt-4">
      <h2 className="text-4xl font-bold text-[#444] mb-8">Notifications</h2>
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2D3A4A]">Recent Notifications</h3>
          <button className="text-sm font-semibold text-gray-500 hover:text-[#C85212] transition-colors">Mark as Read</button>
        </div>
        <div className="flex flex-col gap-4">
          {mockNotifications.map((notif, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-[#FAFAFA] rounded-xl p-5">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10">
                {notif.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#444]">{notif.title}</span>
                  <span className="text-xs text-gray-400 font-medium">{notif.time}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1 mb-1">{notif.message}</div>
                <div className="text-xs text-gray-400 font-medium">{notif.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 