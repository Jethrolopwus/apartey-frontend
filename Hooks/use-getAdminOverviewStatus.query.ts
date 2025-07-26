import { useQuery, UseQueryResult } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminOverviewResponse } from "@/types/admin";

export const useAdminOverviewStatusQuery = (): UseQueryResult<
  AdminOverviewResponse,
  Error
> =>
  useQuery({
    queryKey: ["admin-overview-status"],
    queryFn: () => http.httpGetAdminOverviewStatus(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
