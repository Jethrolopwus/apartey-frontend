import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdatePropertyToggleLikeMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    RoleSubmissionResponse,
    Error,
    string
  >({
    mutationFn: (id) => http.httpUpdatePropertyToggleLike(id, {}),
  });

  return {
    data,
    isLoading: isPending,
    error,
    toggleLike: mutate,
  };
};
