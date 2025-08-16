import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useAuthStatusQuery = () => {
  // Check if user is authenticated before making the query
  const isAuthenticated = typeof window !== 'undefined' && (
    localStorage.getItem('token') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('authToken')
  );

  return useQuery({
    queryKey: ["auth-status"],
    queryFn: () => http.httpGetAuthStatus(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!isAuthenticated, // Only enable if user is authenticated
  });
};
