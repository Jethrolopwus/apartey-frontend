import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormValues } from "@/types/generated";

export const useResendCodeMutation = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: (data: FormValues) => http.httpResendCode(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
