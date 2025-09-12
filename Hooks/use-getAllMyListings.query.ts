"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { PropertiesResponse } from "@/types/generated";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
  page?: number;
  category?: "Rent" | "Swap" | "Sale";
  country?: string;
}

export const useGetAllMyListingsQuery = (
  params?: useGetAllListingsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: ["MyListings", params?.limit, params?.byId, params?.page, params?.category, params?.country],
    queryFn: () => {
      return http.httpGetAllMyListings(params?.limit, params?.byId, params?.page, params?.category, params?.country);
    },
    staleTime: 0, // Disable caching to ensure fresh data on country change
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
