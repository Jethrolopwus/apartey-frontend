

"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetListingsByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["listings", id],
    queryFn: () => http.httpGetListingsById(id),
    enabled: !!id,
  });
};
