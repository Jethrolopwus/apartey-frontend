import { useMutation } from "@tanstack/react-query";
import http from "@/services/http";
import { RoleSubmissionData, RoleSubmissionResponse} from "@/types/generated";



export const useAddRolesMutation = () => {
    const { data, isPending, error, mutate } = useMutation<
      RoleSubmissionResponse,
      Error,
      RoleSubmissionData
    >({
      mutationFn: (data: RoleSubmissionData) => http.httpAddRoles(data),
    });
  
    return {
      data,
      isLoading: isPending,
      error,
      mutate,
    };
  };