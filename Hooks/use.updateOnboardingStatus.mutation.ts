import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdateOnboardingStatusMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    RoleSubmissionResponse,
    Error,
    void
  >({
    mutationFn: () => http.httpUpdateOnboardingStatus(),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
