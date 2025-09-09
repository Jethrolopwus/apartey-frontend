"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export interface UseGetAllAdminUsersQueryParams {
  limit?: number;
  byId?: number;
}

export const useDeactivateAdminUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => http.httpDeactivateAdminUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
    },
  });
};
