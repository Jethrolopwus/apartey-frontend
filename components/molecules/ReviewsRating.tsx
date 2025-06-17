"use client";
import React from "react";
import { Star } from "lucide-react";
import { RatingComponentProps } from "@/types/generated";

const RatingComponent: React.FC<RatingComponentProps> = ({
  data,
  onChange,
  className = "",
  title = "Ratings & Reviews",
  description = "Rate your experience with this property",
}) => {
  const handleStarClick = (field: string, rating: number) => {
    onChange(field, rating);
  };

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              type="button"
            >
              <Star
                size={24}
                className={`${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                } hover:fill-yellow-300 hover:text-yellow-300 transition-colors cursor-pointer`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const RadioOption = ({
    value,
    label,
    checked,
    onChange: onRadioChange,
  }: {
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center space-x-3 py-1">
      <input
        type="radio"
        id={value}
        name="costOfRepairs"
        value={value}
        checked={checked}
        onChange={() => onRadioChange(value)}
        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
      />
      <label
        htmlFor={value}
        className="text-sm text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 space-y-8 ${className}`}
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
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
        <StarRating
          rating={data.valueForMoney || 0}
          onRatingChange={(rating: number) =>
            handleStarClick("valueForMoney", rating)
          }
        />
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
          <RadioOption
            value="tenant"
            label="Tenant (You)"
            checked={data.costOfRepairs === "tenant"}
            onChange={(value) => onChange("costOfRepairs", value)}
          />
          <RadioOption
            value="landlord"
            label="Landlord"
            checked={data.costOfRepairs === "landlord"}
            onChange={(value) => onChange("costOfRepairs", value)}
          />
          <RadioOption
            value="split"
            label="Split between both"
            checked={data.costOfRepairs === "split"}
            onChange={(value) => onChange("costOfRepairs", value)}
          />
          <RadioOption
            value="depends"
            label="Depends on the issue"
            checked={data.costOfRepairs === "depends"}
            onChange={(value) => onChange("costOfRepairs", value)}
          />
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
        <StarRating
          rating={data.overallExperience || 0}
          onRatingChange={(rating: number) =>
            handleStarClick("overallExperience", rating)
          }
        />
      </div>

      {/* Detailed Review */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-gray-900">Detailed Review</h3>
        <textarea
          value={data.detailedReview || ""}
          onChange={(e) => onChange("detailedReview", e.target.value)}
          placeholder="Share the details of your experience, what you liked and what you didn't like etc."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export default RatingComponent;
