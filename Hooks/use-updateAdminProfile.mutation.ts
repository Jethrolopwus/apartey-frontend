import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminProfileUpdateResponse } from "@/types/admin";


export const useUpdateAdminProfileMutation = () => {
  const { data, isPending, error, mutate } = useMutation<AdminProfileUpdateResponse, Error, globalThis.FormData>({
    mutationFn: (data: globalThis.FormData) => {
      return http.httpUpdateAdminProfile(data);
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
