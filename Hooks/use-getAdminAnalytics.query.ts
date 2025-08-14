"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminAnalyticsResponse } from "@/types/admin";


export const useGetAdminAnalyticsQuery = () => {
  
  
  return useQuery<AdminAnalyticsResponse>({
    queryKey: ["admin-analytics"],
    queryFn: () => http.httpGetAdminAnalytics(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: true, 
    refetchOnWindowFocus: false,
  });
};