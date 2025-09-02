import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";

export const useClaimPropertyMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    any,
    Error,
    { formData: globalThis.FormData; propertyId: string }
  >({
    mutationFn: ({ formData, propertyId }) =>
      http.httpClaimProperty(propertyId, formData),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
