"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}

export const useDeleteAdminPropertyById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => http.httpDeleteAdminProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
    },
  });
};
