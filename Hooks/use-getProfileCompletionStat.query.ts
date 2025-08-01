"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { TokenManager } from "@/utils/tokenManager";

export const useGetProfileCompletionQuery = () => {
  const token = TokenManager.getToken();
  
  return useQuery({
    queryKey: ["user-profile-completion", token],
    queryFn: () => http.httpGetProfileCompletionStat(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!token, // Only run query if token is available
    refetchOnWindowFocus: false,
  });
};
