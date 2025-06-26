import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useSearchReviewsQuery = (fullAddress: string, apartment?: string) => {
  return useQuery({
    queryKey: ["searchReviews", fullAddress, apartment],
    queryFn: () => http.httpSearchReviews(fullAddress, apartment),
    enabled: !!fullAddress,
  });
};