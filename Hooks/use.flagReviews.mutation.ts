import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

interface FlagReviewPayload {
  id: string;
  reason: string;
  otherText?: string;
}

export const useUpdateReviewsFlagMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    RoleSubmissionResponse,
    Error,
    FlagReviewPayload
  >({
    mutationFn: ({ id, reason, otherText }) => http.httpUpdateReviewsFlag(id, { reason, otherText }),
  });

  return {
    data,
    isLoading: isPending,
    error,
    flagReview: mutate,
  };
};
