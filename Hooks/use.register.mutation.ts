import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormData } from "@/types/generated";

export const useSignUPMutation = () => {
  const { data, isPending, error, mutate } = useMutation({
    mutationFn: (data: FormData) => http.httpSignUp(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
