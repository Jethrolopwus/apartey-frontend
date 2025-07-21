import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdateNotificationAsReadMutation = () => {
  const { data, isPending, error, mutate } = useMutation<RoleSubmissionResponse, Error, string>({
    mutationFn: (id: string) => {
      return http.httpUpdateNotificationAsRead(id);
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
