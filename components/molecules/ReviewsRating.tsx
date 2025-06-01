"use client";
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewData {
  valueForMoney?: number;
  overallExperience?: number;
  costOfRepairs?: string;
  detailedReview?: string;
}

interface RatingComponentProps {
  onSubmit: (data: ReviewData) => void;
  initialData?: ReviewData;
  className?: string;
  label: string;
    rating: number;
    onRatingChange: (rating: number) => void;
}

const RatingComponent = ({ 
  onSubmit, 
  initialData = {} as ReviewData,
  className = "" 
}: RatingComponentProps) => {
  const [ratings, setRatings] = useState({
    valueForMoney: initialData.valueForMoney || 0,
    overallExperience: initialData.overallExperience || 0
  });
  
  const [costOfRepairs, setCostOfRepairs] = useState(
    initialData.costOfRepairs || ""
  );
  
  const [detailedReview, setDetailedReview] = useState(
    initialData.detailedReview || ""
  );

  const handleStarClick = (category: string, rating: any) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleRepairCostChange = (value: any) => {
    setCostOfRepairs(value);
  };

  const handleSubmit = () => {
    const formData = {
      valueForMoney: ratings.valueForMoney,
      costOfRepairs,
      overallExperience: ratings.overallExperience,
      detailedReview
    };
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number, onRatingChange: (rating: number) => void, label?: string }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              <Star
                size={24}
                className={`${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                } hover:fill-yellow-300 hover:text-yellow-300 transition-colors cursor-pointer`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const RadioOption = ({ value, label, checked, onChange }: { value: string, label: string, checked: boolean, onChange: (value: string) => void }) => (
    <div className="flex items-center space-x-3 py-1">
      <input
        type="radio"
        id={value}
        name="costOfRepairs"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
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
    <div className={`bg-white rounded-lg border border-gray-200 p-6 space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ratings & Reviews
        </h2>
        <p className="text-sm text-gray-500">
          Rate your experience with this property
        </p>
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
                  rating={ratings.valueForMoney}
                  onRatingChange={(rating: any) => handleStarClick('valueForMoney', rating)} label={undefined}        />
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
            checked={costOfRepairs === "tenant"}
            onChange={handleRepairCostChange}
          />
          <RadioOption
            value="landlord"
            label="Landlord"
            checked={costOfRepairs === "landlord"}
            onChange={handleRepairCostChange}
          />
          <RadioOption
            value="split"
            label="Split between both"
            checked={costOfRepairs === "split"}
            onChange={handleRepairCostChange}
          />
          <RadioOption
            value="depends"
            label="Depends on the issue"
            checked={costOfRepairs === "depends"}
            onChange={handleRepairCostChange}
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
                  rating={ratings.overallExperience}
                  onRatingChange={(rating: any) => handleStarClick('overallExperience', rating)} label={undefined}        />
      </div>

      {/* Detailed Review */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-gray-900">
          Detailed Review
        </h3>
        <textarea
          value={detailedReview}
          onChange={(e) => setDetailedReview(e.target.value)}
          placeholder="Share the details of your experience, what you liked and what you didn't like etc."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent  resize-none"
        />
      </div>
    </div>
  );
};

export default RatingComponent;