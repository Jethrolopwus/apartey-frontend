"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { PropertiesResponse } from "@/types/generated";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}

export const useGetAllMyListingsQuery = (
  params?: useGetAllListingsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: ["MyListings", params?.limit, params?.byId],
    queryFn: () => http.httpGetAllMyListings(params?.limit, params?.byId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
