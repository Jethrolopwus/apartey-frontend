"use client";
import React from "react";
import { useGetProfileCompletionQuery } from "@/Hooks/use-getProfileCompletionStat.query";

interface ProfileCompletionCardProps {
  percentage: number;
  missingFields: string;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = () => {
  const { data, isLoading, isError, error } = useGetProfileCompletionQuery();

  const percentage = data?.profileCompletion?.percentage || 0;
  const missingFields = data?.profileCompletion?.missingFields || [];

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="mb-6 rounded-lg bg-orange-50 p-4 flex items-start space-x-4">
      {/* Progress Circle */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="h-16 w-16 -rotate-90 transform">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#f97316"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <span className="absolute text-sm font-semibold text-orange-600">
          {percentage}%
        </span>
      </div>

      {/* Completion Details */}
      <div className="flex-1">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Complete your profile
        </h3>
        <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
          {missingFields.map((field: string) => (
            <li key={field}>Add {field}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
