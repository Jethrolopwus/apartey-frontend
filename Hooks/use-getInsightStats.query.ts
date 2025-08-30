"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { InsightStatsResponse } from "@/types/insight";

export const useGetInsightStatsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery<InsightStatsResponse>({
    queryKey: ["InsightStats"],
    queryFn: () => http.httpGetInsightStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
