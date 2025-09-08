"use client";

import http from "@/services/http";
import { useMutation } from "@tanstack/react-query";

export interface ToggleAvailabilityPayload {
  reason: string;
  location: string;
  customNote?: string | null;
}

export const useToggleListingAvailability = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload?: ToggleAvailabilityPayload }) => {
      return http.toggleListingAvailability(id, payload);
    },
  });
};


