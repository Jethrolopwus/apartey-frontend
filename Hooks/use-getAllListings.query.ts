"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import {
  PropertiesResponse,
  Category,
  PropertyCategory,
} from "@/types/generated";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
  category?: PropertyCategory;
}

export const useGetAllListingsQuery = (
  params?: useGetAllListingsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<PropertiesResponse>({
    queryKey: ["Listings", params?.limit, params?.byId, params?.category],
    queryFn: () =>
      http.httpGetAllListings(params?.limit, params?.byId, params?.category),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
