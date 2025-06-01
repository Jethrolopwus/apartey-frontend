import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useSearchReviewsQuery = (searchTerm: string) => {
  return useQuery({
    queryKey: ["searchReviews", searchTerm],
    queryFn: () => http.httpSearchReviews(searchTerm),
    enabled: !!searchTerm, 
  });
};