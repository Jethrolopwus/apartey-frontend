import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetReviewByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => http.httpGetReviewById(id),
    enabled: !!id,
  });
};