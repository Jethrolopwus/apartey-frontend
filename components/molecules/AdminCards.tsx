"use client";
import React from "react";
import { HomeIcon, UsersIcon,  UserPlusIcon } from "@heroicons/react/24/outline";
import { TrendingUpIcon } from "lucide-react";

interface AdminCardProps {
  label: string;
  value: number | string;
  percentage: string;
  percentageColor?: string; 
}

const cardBg = "bg-white shadow rounded-xl p-6 flex flex-col justify-between min-w-[180px] min-h-[110px]";
const labelStyle = "text-gray-500 text-sm  font-medium";
const valueStyle = "text-2xl font-bold text-gray-900 mt-2";
const percentStyle = "text-xs font-semibold mt-1";

export const TotalPropertiesCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-green-500" }) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <span className={labelStyle}>{label}</span>
        <span className={valueStyle}>{value}</span>
        <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
      </div>
      <div className="bg-blue-100 p-3 rounded-lg">
        <HomeIcon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export const TotalUsersCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-green-500" }) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1 ">
        <span className={labelStyle}>{label}</span>
        <span className={valueStyle}>{value}</span>
        <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
      </div>
      <div className="bg-green-100 p-3 rounded-lg">
        <UsersIcon className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>
);

export const ActiveListingsCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-blue-500" }) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <span className={labelStyle}>{label}</span>
        <span className={valueStyle}>{value}</span>
        <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
      </div>
      <div className="bg-purple-100 p-3 rounded-lg">
        <TrendingUpIcon className="h-6 w-6 text-purple-600" />
      </div>
    </div>
  </div>
);

export const NewUsersThisMonthCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-yellow-500" }) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <span className={labelStyle}>{label}</span>
        <span className={valueStyle}>{value}</span>
        <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
      </div>
      <div className="bg-orange-100 p-3 rounded-lg">
        <UserPlusIcon className="h-6 w-6 text-orange-600" />
      </div>
    </div>
  </div>
); 