"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminClaimedProperty } from "@/types/admin";
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
    { claimId: string; propertyId: string; data: { reason: string } }
  >({
    mutationFn: ({ claimId, propertyId, data }) =>
      http.httpUpdateAdminRejectClaimedProperty(claimId, propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
      toast.success("Property updated successfully");
    },
    onError: (error) => {
      toast.error("Error updating property: " + error.message);
    },
  });
};
