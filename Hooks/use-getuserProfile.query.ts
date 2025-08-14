"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { TokenManager } from "@/utils/tokenManager";

export const useGetUserProfileQuery = () => {
  const token = TokenManager.getToken();
  
  return useQuery({
    queryKey: ["user-profile", token],
    queryFn: () => http.httpGetUsersProfile(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!token, 
    refetchOnWindowFocus: false,
  });
};
