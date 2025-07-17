import React from 'react';
import { Heart, MessageSquare, Home } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'like' | 'message' | 'approval';
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}

const Notifications: React.FC = () => {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'like',
      title: 'Someone liked your property listing',
      timestamp: '2 Hours ago',
      icon: <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
    },
    {
      id: '2',
      type: 'message',
      title: 'New message from Sarah Johnson',
      timestamp: '4 Hours ago',
      icon: <MessageSquare className="w-5 h-5 text-orange-500 fill-orange-500" />
    },
    {
      id: '3',
      type: 'approval',
      title: 'Your property listing has been approved',
      timestamp: '4 Hours ago',
      icon: <Home className="w-5 h-5 text-black-500" />
    }
  ];

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
          <button className="text-sm text-gray-500 hover:text-blue-700 transition-colors">
            Mark as Read
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

              {/* Timestamp */}
              <div className="flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {notification.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;