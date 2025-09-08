"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export interface PropertyRating {
  rating: number;
  reviewCount: number;
}

export const useGetPropertyRatingsQuery = (propertyId: string) => {
  return useQuery<PropertyRating>({
    queryKey: ["propertyRatings", propertyId],
    queryFn: async () => {
      try {
        // Try to get reviews for this specific property
        const response = await http.httpGetAllReviews({
          limit: 100, // Get all reviews for this property
          // Add property filter if the API supports it
        });
        
        // Filter reviews for this specific property
        const propertyReviews = response.reviews?.filter(
          (review: any) => review.linkedProperty?._id === propertyId
        ) || [];
        
        if (propertyReviews.length === 0) {
          return { rating: 0, reviewCount: 0 };
        }
        
        // Calculate average rating
        const totalRating = propertyReviews.reduce(
          (sum: number, review: any) => sum + (review.overallRating || 0),
          0
        );
        const averageRating = totalRating / propertyReviews.length;
        
        return {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: propertyReviews.length,
        };
      } catch (error) {
        console.error("Error fetching property ratings:", error);
        return { rating: 0, reviewCount: 0 };
      }
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
