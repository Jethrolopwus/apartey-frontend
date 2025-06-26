import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionResponse } from "@/types/generated";

export const useUpdateProfileMutation = () => {
  const { data, isPending, error, mutate } = useMutation<
    RoleSubmissionResponse,
    Error,
    any
  >({
    mutationFn: (data) => {
      if (data instanceof FormData) {
        for (let pair of data.entries()) {
          console.log('httpUpdateProfile entry:', pair[0], pair[1]);
        }
      }
      return http.httpUpdateProfile(data);
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
