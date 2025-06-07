import React from 'react';

// StarRating component
const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (rating: number) => void;
  label: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`w-8 h-8 ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
);

// RatingsAndReviews data interface
export interface RatingsAndReviewsData {
  valueForMoney: number;
  overallExperience: number;
  overallRating: number;
  costOfRepairsCoverage: string;
  detailedReview: string;
}

// RatingsAndReviews component props
interface RatingsAndReviewsProps {
  data: RatingsAndReviewsData;
  onChange: (field: keyof RatingsAndReviewsData, value: string | number) => void;
  className?: string;
}

// Main RatingsAndReviews component
const RatingsAndReviews: React.FC<RatingsAndReviewsProps> = ({
  data,
  onChange,
  className = "",
}) => {
  return (
    <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ratings and Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <StarRating
          value={data.valueForMoney}
          onChange={(rating) => onChange("valueForMoney", rating)}
          label="Value for Money"
        />

        <StarRating
          value={data.overallExperience}
          onChange={(rating) => onChange("overallExperience", rating)}
          label="Overall Experience"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <StarRating
          value={data.overallRating}
          onChange={(rating) => onChange("overallRating", rating)}
          label="Overall Rating"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost of Repairs Coverage
          </label>
          <select
            value={data.costOfRepairsCoverage}
            onChange={(e) => onChange("costOfRepairsCoverage", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Landlord">Landlord</option>
            <option value="Tenant">Tenant</option>
            <option value="Shared">Shared</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Review
        </label>
        <textarea
          value={data.detailedReview}
          onChange={(e) => onChange("detailedReview", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your detailed experience with this property..."
          required
        />
      </div>
    </div>
  );
};

export default RatingsAndReviews;