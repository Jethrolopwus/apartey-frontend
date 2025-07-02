import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdateReviewsToggleLikeMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    RoleSubmissionResponse,
    Error,
    string
  >({
    mutationFn: (id) => http.httpUpdateReviewsToggleLike(id, {}),
  });

  return {
    data,
    isLoading: isPending,
    error,
    toggleLike: mutate,
  };
};
