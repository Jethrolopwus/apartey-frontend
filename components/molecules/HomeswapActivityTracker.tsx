"use client";
import React from "react";
import { 
  ArrowPathIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { MessageSquare } from "lucide-react";

interface ActivityEntry {
  id: string;
  type: 'swap' | 'sale';
  status: 'completed' | 'pending' | 'in-progress';
  property: string;
  participants: string;
  dateTime: string;
  price: string;
}

const HomeswapActivityTracker: React.FC = () => {
  // Sample activity data
  const activities: ActivityEntry[] = [
    {
      id: "1",
      type: "swap",
      status: "completed",
      property: "Modern 3BR Apartment in Lagos",
      participants: "John Doe - Sarah Wilson",
      dateTime: "2025-01-28 10:30 AM",
      price: "$2,400/month"
    },
    {
      id: "2",
      type: "sale",
      status: "pending",
      property: "2BR Condo in Abuja",
      participants: "Mike Johnson - Alex Brown",
      dateTime: "2025-01-28 09:15 AM",
      price: "$180,000"
    },
    {
      id: "3",
      type: "swap",
      status: "completed",
      property: "Studio Apartment in Accra",
      participants: "Grace Osei - David Kim",
      dateTime: "2025-01-27 4:45 PM",
      price: "$1,200/month"
    },
    {
      id: "4",
      type: "sale",
      status: "in-progress",
      property: "4BR House in Nairobi",
      participants: "Peter Mwangi - Lisa Chen",
      dateTime: "2025-01-27 2:20 PM",
      price: "$95,000"
    },
    {
      id: "5",
      type: "swap",
      status: "completed",
      property: "Luxury 2BR in Cape Town",
      participants: "Thabo Mokoena - Emma Taylor",
      dateTime: "2025-01-26 11:00 AM",
      price: "$3,200/month"
    }
  ];

  const getActivityIcon = (type: 'swap' | 'sale') => {
    if (type === 'swap') {
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <ArrowPathIcon className="w-4 h-4 text-blue-600" />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
        </div>
      );
    }
  };

  const getStatusIcon = (status: 'completed' | 'pending' | 'in-progress') => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-3 h-3 text-green-600" />
          </div>
        );
      case 'pending':
        return (
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
            <ClockIcon className="w-3 h-3 text-orange-600" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-3 h-3 text-blue-600" />
          </div>
        );
    }
  };

  const getStatusTag = (status: 'completed' | 'pending' | 'in-progress') => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            In Progress
          </span>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center mb-6">
          <MessageSquare className="w-8 h-8 text-gray-900 mr-3" />
      
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Recent Homeswap Activities
          </h3>
          <p className="text-sm text-gray-500">
            Latest responses from users who deactivated their homeswap status
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              {/* Left Column - Activity Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  {getActivityIcon(activity.type)}
                  {getStatusIcon(activity.status)}
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-1">
                  {activity.property}
                </h4>
                
                <p className="text-sm text-gray-500 mb-1">
                  {activity.participants}
                </p>
                
                <p className="text-sm text-gray-500">
                  {activity.dateTime}
                </p>
              </div>

              {/* Right Column - Price and Status */}
              <div className="text-right">
                <p className="font-semibold text-gray-800 mb-2">
                  {activity.price}
                </p>
                {getStatusTag(activity.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeswapActivityTracker; 