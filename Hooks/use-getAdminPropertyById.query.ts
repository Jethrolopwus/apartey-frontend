"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetAdminPropertiesByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["AdminProperty", id],
    queryFn: () => http.httpGetAdminPropertyById(id),
    enabled: !!id,
  });
};
