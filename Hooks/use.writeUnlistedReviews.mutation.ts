import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { UnlistedPropertyReview } from "@/types/generated";

export const useWriteUnlistedReviewMutation = () => {
  const { data, isPending, error, mutate } = useMutation<any, Error, UnlistedPropertyReview>({
    mutationFn: (data: UnlistedPropertyReview) =>
      http.httpWriteUnlistedReview(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
