"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { OnboardingStatusResponse } from "@/types/generated";

export const useGetOnboardingStatusQuery = () => {
  // Check if user is authenticated before making the query
  const isAuthenticated = typeof window !== 'undefined' && (
    localStorage.getItem('token') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('authToken')
  );

  return useQuery<OnboardingStatusResponse>({
    queryKey: ["onboarding-status"],
    queryFn: () => http.httpGetOnboardingStatus(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!isAuthenticated, // Only enable if user is authenticated
    refetchOnWindowFocus: false,
  });
};
