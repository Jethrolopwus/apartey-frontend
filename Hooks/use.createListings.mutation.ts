import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export const useCreateListingsMutation = () => {
  const queryClient = useQueryClient();
  
  const { data, isPending, error, mutate } = useMutation<
    any,
    Error,
    globalThis.FormData
  >({
    mutationFn: (formData: globalThis.FormData) =>
      http.httpCreateListings(formData),
    onSuccess: () => {
      // Invalidate and refetch listings queries
      queryClient.invalidateQueries({ queryKey: ["Listings"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
