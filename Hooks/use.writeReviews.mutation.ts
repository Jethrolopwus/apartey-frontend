import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { ReviewFormData } from "@/types/generated";

export const useWriteReviewMutation = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: (variables: { id: string; data: ReviewFormData }) =>
      http.httpWriteReview(variables.id, variables.data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
