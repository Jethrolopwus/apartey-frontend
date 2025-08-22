"use client";
import React from 'react';
import { Star } from 'lucide-react';

const mockNotifications = [
  {
    icon: <div className="w-6 h-6 rounded-full bg-yellow-200 border-2 border-yellow-300 flex items-center justify-center"><Star className="w-3 h-3 text-yellow-600" /></div>, 
    title: 'New Review Posted', 
    message: '5-star review received for City Center Condo', 
    user: 'Mike Wilson', 
    time: '2 Hours ago',
    isUnread: true
  },
  {
    icon: <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center"></div>, 
    title: 'User Feedback Submitted', 
    message: '4-star feedback received for Lakeside Villa', 
    user: 'Sarah Johnson', 
    time: '1 Hour ago',
    isUnread: false
  },
  {
    icon: <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center"></div>, 
    title: 'Message Received', 
    message: 'Inquiry about availability for Oceanview Apartment', 
    user: 'John Smith', 
    time: '30 Minutes ago',
    isUnread: false
  },
  {
    icon: <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center"></div>, 
    title: 'Reservation Confirmed', 
    message: 'Booking confirmed for Mountain Retreat from Dec 10-15', 
    user: 'Emily Davis', 
    time: '15 Minutes ago',
    isUnread: false
  },
];

export default function AdminNotifications() {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-6 lg:px-10 pt-2 pb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Notifications</h1>
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2D3A4A]">Recent Notifications</h3>
          <button className="text-sm font-semibold text-gray-500 hover:text-[#C85212] transition-colors">Mark as Read</button>
        </div>
        <div className="flex flex-col gap-4">
          {mockNotifications.map((notif, idx) => (
            <div key={idx} className={`flex items-start gap-4 bg-gray-50 rounded-lg p-4 ${notif.isUnread ? 'border-l-4 border-yellow-400' : ''}`}>
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                {notif.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-800">{notif.title}</span>
                  <span className="text-xs text-gray-400 font-medium">{notif.time}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{notif.message}</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">{notif.user.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{notif.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
} 