import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormData, SignInResponse } from "@/types/generated";

export const useAdminLoginMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    SignInResponse,
    Error,
    FormData
  >({
    mutationFn: (data: FormData) => http.httpAdminLogin(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
