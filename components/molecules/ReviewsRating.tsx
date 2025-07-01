"use client";
import React, { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useReviewForm } from "@/app/context/RevievFormContext";

const RatingComponent: React.FC = () => {
  const { location, setLocation } = useReviewForm();
  const valueForMoney = location?.valueForMoney || 0;
  const costOfRepairs = location?.costOfRepairs || "";
  const overallExperience = location?.overallExperience || 0;
  const detailedReview = location?.detailedReview || "";

  const COST_OF_REPAIRS_MAP: Record<string, string> = {
    tenant: "Tenant (You)",
    landlord: "Landlord",
    split: "Split between both",
    depends: "Depends on the issue",
  };
  const REVERSE_COST_OF_REPAIRS_MAP: Record<string, string> = {
    "Tenant (You)": "tenant",
    "Landlord": "landlord",
    "Split between both": "split",
    "Depends on the issue": "depends",
  };

  const handleStarClick = (field: string, rating: number) => {
    setLocation({ ...location, [field]: rating });
  };

  const handleRadioChange = (field: string, value: string) => {
    setLocation({ ...location, [field]: COST_OF_REPAIRS_MAP[value] || value });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 space-y-8`}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Ratings & Reviews</h2>
        <p className="text-sm text-gray-500">Rate your experience with this property</p>
      </div>

      {/* Value for Money */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            Value for Money
          </h3>
          <p className="text-sm text-gray-500">
            Rate the property's value relative to the rent
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  handleStarClick("valueForMoney", star);
                  console.log('Value for Money:', star);
                }}
                className="focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                type="button"
              >
                <Star
                  size={24}
                  className={
                    `${star <= valueForMoney ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} hover:fill-yellow-300 hover:text-yellow-300 transition-colors cursor-pointer`
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost of Repairs */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            Cost of Repairs
          </h3>
          <p className="text-sm text-gray-500">
            Who typically covered the cost of repairs?
          </p>
        </div>
        <div className="space-y-2">
          {[
            { value: "tenant", label: "Tenant (You)" },
            { value: "landlord", label: "Landlord" },
            { value: "split", label: "Split between both" },
            { value: "depends", label: "Depends on the issue" },
          ].map((option) => (
            <div className="flex items-center space-x-3 py-1" key={option.value}>
              <input
                type="radio"
                id={option.value}
                name="costOfRepairs"
                value={option.value}
                checked={REVERSE_COST_OF_REPAIRS_MAP[costOfRepairs] === option.value}
                onChange={() => {
                  handleRadioChange("costOfRepairs", option.value);
                  console.log('Cost of Repairs:', option.value);
                }}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <label
                htmlFor={option.value}
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Experience */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            Overall Experience
          </h3>
          <p className="text-sm text-gray-500">
            Rate your overall experience living at this property
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  handleStarClick("overallExperience", star);
                  console.log('Overall Experience:', star);
                }}
                className="focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                type="button"
              >
                <Star
                  size={24}
                  className={
                    `${star <= overallExperience ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} hover:fill-yellow-300 hover:text-yellow-300 transition-colors cursor-pointer`
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-gray-900">Detailed Review</h3>
        <textarea
          value={detailedReview}
          onChange={(e) => {
            setLocation({ ...location, detailedReview: e.target.value });
            console.log('Detailed Review:', e.target.value);
          }}
          placeholder="Share the details of your experience, what you liked and what you didn't like etc."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export default RatingComponent;
