"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminReviews } from "@/types/admin";

export const useGetAdminReviewsByIdQuery = (id: string) => {
  return useQuery<AdminReviews>({
    queryKey: ["AdminReviews", id],
    queryFn: () => http.httpGetAdminReviewById(id),
    enabled: !!id,
  });
};
