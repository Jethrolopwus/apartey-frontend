"use client";
import React from "react";
import { HomeIcon, UsersIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { TrendingUpIcon } from "lucide-react";

interface AdminCardProps {
  label: string;
  value: number | string;
  percentage: string;
  percentageColor?: string;
}

const cardBg = "bg-white shadow-sm border border-gray-100 rounded-2xl p-6";
const labelStyle = "text-gray-500 text-sm font-medium mb-1";
const valueStyle = "text-3xl font-bold text-gray-900 mb-2";
const percentStyle = "text-sm font-semibold";

export const TotalPropertiesCard: React.FC<AdminCardProps> = ({ 
  value, 
  percentage, 
  label, 
  percentageColor = "text-green-600" 
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div className={`${percentStyle} ${percentageColor}`}>+{percentage} Increase</div>
      </div>
      <div className="bg-blue-50 p-3 rounded-xl">
        <HomeIcon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export const TotalUsersCard: React.FC<AdminCardProps> = ({ 
  value, 
  percentage, 
  label, 
  percentageColor = "text-green-600" 
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div className={`${percentStyle} ${percentageColor}`}>+{percentage} Increase</div>
      </div>
      <div className="bg-green-50 p-3 rounded-xl">
        <UsersIcon className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>
);

export const ActiveListingsCard: React.FC<AdminCardProps> = ({ 
  value, 
  percentage, 
  label, 
  percentageColor = "text-blue-600" 
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div className={`${percentStyle} ${percentageColor}`}>+{percentage} Increase</div>
      </div>
      <div className="bg-purple-50 p-3 rounded-xl">
        <TrendingUpIcon className="h-6 w-6 text-purple-600" />
      </div>
    </div>
  </div>
);

export const NewUsersThisMonthCard: React.FC<AdminCardProps> = ({ 
  value, 
  percentage, 
  label, 
  percentageColor = "text-orange-600" 
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div className={`${percentStyle} ${percentageColor}`}>+{percentage} Increase</div>
      </div>
      <div className="bg-orange-50 p-3 rounded-xl">
        <UserPlusIcon className="h-6 w-6 text-orange-600" />
      </div>
    </div>
  </div>
); 