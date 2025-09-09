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
      queryKey: [
        "AdminProperties",
        params?.limit,
        params?.page,
        params?.search,
        params?.sortBy,
      ],
      queryFn: () =>
        http.httpGetAdminAllClaimedProperties(
          params?.limit as number,
          params?.page as number,
          params?.search as string,
          params?.sortBy as string
        ),
      staleTime: 5 * 60 * 1000,
      retry: 2,
    });

  return { data, isLoading, error, refetch };
};
