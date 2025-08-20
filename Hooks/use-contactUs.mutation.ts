import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";

export const useContactUsMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    any,
    Error,
    globalThis.FormData
  >({
    mutationFn: (formData: globalThis.FormData) =>
      http.httpContactUs(formData),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
