"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import type { userLocationData } from "@/types/generated";

// Function to detect user's IP location
export const detectUserLocation = async (): Promise<userLocationData> => {
  try {
    // Use our API endpoint for IP detection
    const response = await fetch('/api/location/detect');
    const data = await response.json();
    
   
    
    return {
      countryCode: data.countryCode,
      countryName: data.countryName,
    };
  } catch (error) {
    console.error('Error detecting user location:', error);
    // Default to Estonia on error
    return {
      countryCode: 'EE',
      countryName: 'Estonia',
    };
  }
};

export const useGetUserLocationQuery = (countryCode: string) => {
  return useQuery<userLocationData, Error>({
    queryKey: ["user-profile", countryCode],
    queryFn: () => http.httpGetUsersLocation(countryCode),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

// New hook for IP-based location detection
export const useDetectUserLocation = () => {
  return useQuery<userLocationData, Error>({
    queryKey: ["user-location-detect"],
    queryFn: detectUserLocation,
    retry: 1,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    enabled: true, // Always run on mount
  });
};
