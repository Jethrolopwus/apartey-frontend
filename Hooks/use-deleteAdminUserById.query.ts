"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export interface UseGetAllAdminUsersQueryParams {
  limit?: number;
  byId?: number;
}

export const useDeleteAdminUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => http.httpDeleteAdminUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
    },
  });
};
