import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { UnlistedPropertyReview } from "@/types/generated";

export const useWriteReviewMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    any,
    Error,
    { id: string; data: UnlistedPropertyReview }
  >({
    mutationFn: (variables: { id: string; data: UnlistedPropertyReview }) =>
      http.httpWriteReview(variables.id, variables.data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
