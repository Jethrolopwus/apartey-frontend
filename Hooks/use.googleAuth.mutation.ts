import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { SignInResponse } from "@/types/generated";

interface GoogleAuthData {
  email: string;
  avatar?: string;
  firstName: string;
  lastName: string;
}

export const useGoogleAuthMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    SignInResponse,
    Error,
    GoogleAuthData
  >({
    mutationFn: (data: GoogleAuthData) => http.httpGoogleAuthCallback(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
