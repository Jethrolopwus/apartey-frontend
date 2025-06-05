import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { ReviewFormData } from "@/types/generated";

export const useWriteReviewMutation = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: (data: ReviewFormData) => http.httpWriteReview(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
