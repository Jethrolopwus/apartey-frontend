"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetAdminUsersByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["AdminProperty", id],
    queryFn: () => http.httpGetAdminUsersById(id),
    enabled: !!id,
  });
};
