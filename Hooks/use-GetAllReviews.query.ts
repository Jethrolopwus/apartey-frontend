"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { UseGetAllReviewsQueryParams } from "@/types/generated";

export const useGetAllReviewsQuery = (params?: UseGetAllReviewsQueryParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reviews", params?.limit, params?.sortBy, params?.sortOrder],
    queryFn: () =>
      http.httpGetAllReviews(params?.limit, params?.sortBy, params?.sortOrder),
  });

  return { data, isLoading, error, refetch };
};
