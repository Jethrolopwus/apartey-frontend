import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";

export const useClaimPropertyMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    any,
    Error,
    globalThis.FormData
  >({
    mutationFn: (formData: globalThis.FormData) =>
      http.httpClaimProperty("id", formData),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
