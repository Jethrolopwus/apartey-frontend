"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export interface GetAllUserQueryParams {
  limit?: number;
  byId?: number;
}

export const useDeleteAdminReviewsById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => http.httpDeleteAdminReviewById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Reviews"] });
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
    },
  });
};
