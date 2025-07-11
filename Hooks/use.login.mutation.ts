import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormData, SignInResponse } from "@/types/generated";

export const useSignInMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    SignInResponse,
    Error,
    FormData
  >({
    mutationFn: (data: FormData) => http.httpSignIn(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
