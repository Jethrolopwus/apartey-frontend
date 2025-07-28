"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import type { userLocationData } from "@/types/generated";

export const useGetUserLocationQuery = (countryCode: string = "EE") => {
  return useQuery<userLocationData, Error>({
    queryKey: ["user-profile", countryCode],
    queryFn: () => http.httpGetUsersLocation(countryCode),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
