import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
export type Passwords = {
  currentPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const useUpdateAdminPasswordMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    UpdatePasswordResponse, 
    Error, 
    Passwords 
  >({
    mutationFn: (data: Passwords) => http.httpUpdateAdminPassword(data),
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
