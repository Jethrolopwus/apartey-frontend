"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetProfileCompletionQuery = () => {
  return useQuery({
    queryKey: ["user-profile-completion"],
    queryFn: () => http.httpGetProfileCompletionStat(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
