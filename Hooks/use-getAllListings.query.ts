"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { PropertiesResponse, PropertyCategory } from "@/types/generated";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
  category?: PropertyCategory;
  page?: number;
  country?: string;
  propertyType?: string;
  petPolicy?: string;
  condition?: string;
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
      params?.propertyType,
      params?.petPolicy,
      params?.condition,
    ],
    queryFn: () => {
      return http.httpGetAllListings(
        params?.limit,
        params?.byId,
        params?.category,
        params?.country,
        params?.propertyType,
        params?.petPolicy,
        params?.condition
      );
    },
    staleTime: 0, // Disable caching to ensure fresh data on country change
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
