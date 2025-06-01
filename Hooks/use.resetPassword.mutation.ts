import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { FormValues } from "@/types/generated";

export const useResetPasswordMutation = () => {
  const mutation = useMutation({
    mutationFn: (data: FormValues) => http.httpResetPassword(data),
    onSuccess: (data) => {
      console.log("Reset password successful:", data);
    },
    onError: (error: any) => {
      console.error("Reset password error:", error);
    },
  });

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
  };
};