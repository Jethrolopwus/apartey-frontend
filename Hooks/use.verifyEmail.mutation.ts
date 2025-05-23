import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormValues } from "@/types/generated";

export const useVerifyEmailMutation = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: (data: FormValues) => http.httpVerifyEmail(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
