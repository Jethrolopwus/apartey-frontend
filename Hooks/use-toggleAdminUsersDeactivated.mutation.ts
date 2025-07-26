import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminUsersResponse } from "@/types/admin";

export const useUpdateUserToggleDeactivateMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    AdminUsersResponse,
    Error,
    string
  >({
    mutationFn: (id) => http.httpUpdateAdminUser(id, {}),
  });

  return {
    data,
    isLoading: isPending,
    error,
    toggleDeactivate: mutate,
  };
};
