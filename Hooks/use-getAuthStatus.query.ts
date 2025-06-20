import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useAuthStatusQuery = () =>
  useQuery({
    queryKey: ["auth-status"],
    queryFn: () => http.httpGetAuthStatus(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
