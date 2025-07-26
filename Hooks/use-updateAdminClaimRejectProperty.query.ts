"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminClaimedProperty, AdminProperty } from "@/types/admin";
import toast from "react-hot-toast";

export interface UseClaimPropertyQueryParams {
  limit?: number;
  byId?: number;
}

export const useUpdateAdminClaimRejectPropertyById = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminClaimedProperty,
    Error,
    { id: string; data: Partial<AdminClaimedProperty> }
  >({
    mutationFn: ({ id, data }) =>
      http.httpUpdateAdminRejectClaimedProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
      toast.success("Property updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating property:" + error.message);
    },
  });
};
