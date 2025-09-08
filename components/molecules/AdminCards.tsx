"use client";
import React from "react";
import { HomeIcon, UsersIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { TrendingUpIcon } from "lucide-react";

interface AdminCardProps {
  label: string;
  value: number | string;
  percentage: string;
  increase?: boolean;
}

const cardBg =
  "bg-white shadow-sm border border-gray-100 rounded-2xl p-4 md:p-6";
const labelStyle = "text-gray-500 text-xs md:text-sm font-medium mb-1";
const valueStyle = "text-2xl md:text-3xl font-bold text-gray-900 mb-2";
const percentStyle = "text-xs  font-semibold";

export const TotalPropertiesCard: React.FC<AdminCardProps> = ({
  value,
  percentage,
  label,
  increase,
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div
          className={`${percentStyle} ${
            increase ? "text-green-600" : "text-red-600"
          }`}
        >
          {increase ? "+" : "-"}
          {percentage}% {increase ? "Increase" : "Decrease"}
        </div>
      </div>
      <div className="bg-blue-50 p-2 md:p-3 rounded-xl">
        <HomeIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

export const TotalUsersCard: React.FC<AdminCardProps> = ({
  value,
  percentage,
  increase,
  label,
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div
          className={`${percentStyle} ${
            increase ? "text-green-600" : "text-red-600"
          }`}
        >
          {increase ? "+" : "-"}
          {percentage}% {increase ? "Increase" : "Decrease"}
        </div>
      </div>
      <div className="bg-green-50 p-2 md:p-3 rounded-xl">
        <UsersIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
      </div>
    </div>
  </div>
);

export const ActiveListingsCard: React.FC<AdminCardProps> = ({
  value,
  percentage,
  label,
  increase,
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div
          className={`${percentStyle} ${
            increase ? "text-green-600" : "text-red-600"
          }`}
        >
          {increase ? "+" : "-"}
          {percentage}% {increase ? "Increase" : "Decrease"}
        </div>
      </div>
      <div className="bg-purple-50 p-2 md:p-3 rounded-xl">
        <TrendingUpIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
      </div>
    </div>
  </div>
);

export const NewUsersThisMonthCard: React.FC<AdminCardProps> = ({
  value,
  percentage,
  label,
  increase,
}) => (
  <div className={cardBg}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className={labelStyle}>{label}</div>
        <div className={valueStyle}>{value.toLocaleString()}</div>
        <div
          className={`${percentStyle} ${
            increase ? "text-green-600" : "text-red-600"
          }`}
        >
          {increase ? "+" : "-"}
          {percentage}% {increase ? "Increase" : "Decrease"}
        </div>
      </div>
      <div className="bg-orange-50 p-2 md:p-3 rounded-xl">
        <UserPlusIcon className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
      </div>
    </div>
  </div>
);
