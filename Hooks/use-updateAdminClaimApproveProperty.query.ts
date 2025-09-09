"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { ApiClaimResponse } from "@/types/admin";
import toast from "react-hot-toast";

export interface UseClaimPropertyQueryParams {
  limit?: number;
  byId?: number;
}

export const useUpdateAdminClaimApprovedPropertyById = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiClaimResponse,
    Error,
    { claimId: string; propertyId: string }
  >({
    mutationFn: ({claimId, propertyId }) =>
      http.httpUpdateAdminApproveClaimedProperty(claimId, propertyId),
    onMutate: () => {
      toast.loading("Updating claim status...");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["AdminProperties"] });
      toast.dismiss();
      toast.success(
        `Claim ${
          data.status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(`Error updating claim: ${error.message}`);
    },
  });
};
