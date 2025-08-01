"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { OnboardingStatusResponse } from "@/types/generated";

export const useGetOnboardingStatusQuery = () => {
  return useQuery<OnboardingStatusResponse>({
    queryKey: ["onboarding-status"],
    queryFn: () => http.httpGetOnboardingStatus(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: true, // Enable the query to actually fetch onboarding status
    refetchOnWindowFocus: false,
  });
};
