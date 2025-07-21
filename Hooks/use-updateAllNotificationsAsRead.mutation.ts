import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdateAllNotificationsAsReadMutation = () => {
  const { data, isPending, error, mutate } = useMutation<RoleSubmissionResponse, Error, void>({
    mutationFn: () => {
      return http.httpUpdateAllNotificationsAsRead();
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
