"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import type {
  UseGetAllReviewsQueryParams,
  ReviewsQueryData,
} from "@/types/generated";

export interface AllReviewsQueryParams extends UseGetAllReviewsQueryParams {
  countryCode?: string;
  apartment?: string;
  searchQuery?: string;
}

export const useGetAllReviewsQuery = (params: AllReviewsQueryParams = {}) => {
  const {
    limit,
    sortBy,
    sortOrder,
    countryCode,
    page,
    apartment,
    searchQuery,
  } = params;
  return useQuery<ReviewsQueryData, Error>({
    queryKey: [
      "reviews",
      limit,
      sortBy,
      sortOrder,
      countryCode,
      page,
      apartment,
      searchQuery,
    ],
    queryFn: () =>
      http.httpGetAllReviews({
        limit,
        sortBy,
        sortOrder,
        countryCode,
        page,
        apartment,
        searchQuery,
      }),
  });
};
