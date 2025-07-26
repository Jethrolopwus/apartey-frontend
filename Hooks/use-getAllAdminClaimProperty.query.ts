"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import {
  AdminClaimedPropertiesResponse,
  UseClaimPropertyQueryParams,
} from "@/types/admin";

export const useGetAdminClaimPropertyQuery = (
  params?: UseClaimPropertyQueryParams
) => {
  const { data, isLoading, error, refetch } =
    useQuery<AdminClaimedPropertiesResponse>({
      queryKey: ["Admin claim Properties", params?.limit, params?.page],
      queryFn: () =>
        http.httpGetAdminAllClaimedProperties(params?.limit, params?.page),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });

  return { data, isLoading, error, refetch };
};
