"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPropertiesResponse } from "@/types/admin";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}

export const useGetAdminPropertiesQuery = (
  params?: useGetAllListingsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<AdminPropertiesResponse>(
    {
      queryKey: ["AdminProperties", params?.limit, params?.byId],
      queryFn: () =>
        http.httpGetAdminAllProperties(params?.limit, params?.byId),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  return { data, isLoading, error, refetch };
};
