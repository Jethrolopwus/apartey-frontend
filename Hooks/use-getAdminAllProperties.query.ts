"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPropertiesResponse, useGetAdminAllPropertiesQueryParams } from "@/types/admin";

export const useGetAdminPropertiesQuery = (
  params?: useGetAdminAllPropertiesQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<AdminPropertiesResponse>(
    {
      queryKey: ["AdminProperties", params],
      queryFn: () =>
        http.httpGetAdminAllProperties(
          params?.limit, 
          params?.byId, 
          params?.search, 
          params?.sort
        ),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  return { data, isLoading, error, refetch };
};
