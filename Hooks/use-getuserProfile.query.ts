
"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetUserRoleQuery = () => {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: () => http.httpGetUsersRoles(),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
};
