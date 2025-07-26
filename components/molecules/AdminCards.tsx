"use client";
import React from "react";

interface AdminCardProps {
  label: string;
  value: number | string;
  percentage: string;
  percentageColor?: string; // e.g. 'text-green-500'
}

const cardBg = "bg-white shadow rounded-xl p-6 flex flex-col justify-between min-w-[180px] min-h-[110px]";
const labelStyle = "text-gray-500 text-sm font-medium";
const valueStyle = "text-2xl font-bold text-gray-900 mt-2";
const percentStyle = "text-xs font-semibold mt-1";

export const TotalPropertiesCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-green-500" }) => (
  <div className={cardBg}>
    <span className={labelStyle}>{label}</span>
    <span className={valueStyle}>{value}</span>
    <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
  </div>
);

export const TotalUsersCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-green-500" }) => (
  <div className={cardBg}>
    <span className={labelStyle}>{label}</span>
    <span className={valueStyle}>{value}</span>
    <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
  </div>
);

export const ActiveListingsCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-blue-500" }) => (
  <div className={cardBg}>
    <span className={labelStyle}>{label}</span>
    <span className={valueStyle}>{value}</span>
    <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
  </div>
);

export const NewUsersThisMonthCard: React.FC<AdminCardProps> = ({ value, percentage, label, percentageColor = "text-yellow-500" }) => (
  <div className={cardBg}>
    <span className={labelStyle}>{label}</span>
    <span className={valueStyle}>{value}</span>
    <span className={`${percentStyle} ${percentageColor}`}>{percentage} Increase</span>
  </div>
); 