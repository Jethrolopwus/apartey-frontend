"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { PropertiesResponse, PropertyCategory } from "@/types/generated";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
  category?: PropertyCategory;
  country?: string;
}

export const useGetAllListingsQuery = (
  params?: useGetAllListingsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: [
      "Listings",
      params?.limit,
      params?.byId,
      params?.category,
      params?.country,
    ],
    queryFn: () =>
      http.httpGetAllListings(
        params?.limit,
        params?.byId,
        params?.category,
        params?.country
      ),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
