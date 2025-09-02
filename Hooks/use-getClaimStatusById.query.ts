
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetClaimStatusByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["claimStatus", id],
    queryFn: () => http.httpGetClaimStatus(id),
    enabled: !!id,
  });
};