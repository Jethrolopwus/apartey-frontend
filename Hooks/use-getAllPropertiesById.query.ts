

"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetPropertyByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => http.httpGetPropertiesById(id),
    enabled: !!id,
  });
};
