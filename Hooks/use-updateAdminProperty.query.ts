"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminProperty } from "@/types/admin";
import toast from "react-hot-toast";

export interface useGetAllListingsQueryParams {
  limit?: number;
  byId?: number;
}

export const useUpdateAdminPropertyById = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminProperty,
    Error,
    { id: string; data: Partial<AdminProperty> }
  >({
    mutationFn: ({ id, data }) => http.httpUpdateAdminProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
      toast.success("Property updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating property:" + error.message);
    },
  });
};
