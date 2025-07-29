"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import type {
  UseGetAllReviewsQueryParams,
  Review,
  ReviewsQueryData,
} from "@/types/generated";

export interface AllReviewsQueryParams extends UseGetAllReviewsQueryParams {
  countryCode?: string;
}

export const useGetAllReviewsQuery = (params: AllReviewsQueryParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery<ReviewsQueryData, Error>(
    {
      queryKey: [
        "reviews",
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.countryCode,
        params.page,
      ],
      queryFn: () =>
        http.httpGetAllReviews(
          params.limit,
          params.sortBy,
          params.sortOrder,
          params.countryCode,
          params.page
        ),
    }
  );

  return { data, isLoading, error, refetch };
};
