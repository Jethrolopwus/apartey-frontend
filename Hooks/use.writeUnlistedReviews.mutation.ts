import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { UnlistedPropertyReview, ReviewData } from "@/types/generated";
import { LocationPayload } from "@/app/context/RevievFormContext";

export const useWriteUnlistedReviewMutation = () => {
  const { data, isPending, error, mutate } = useMutation<any, Error, LocationPayload>({
    mutationFn: (data: LocationPayload) =>
      http.httpWriteUnlistedReview(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
