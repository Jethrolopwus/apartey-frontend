"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import {
  AdminUsersResponse,
  UseGetAllAdminUsersQueryParams,
} from "@/types/admin";

export const useGetAllAdminUsersQuery = (
  params?: UseGetAllAdminUsersQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<AdminUsersResponse>({
    queryKey: ["Users", params?.limit, params?.byId],
    queryFn: () => http.httpGetAdminAllUsers(params?.limit, params?.byId),
  });

  return { data, isLoading, error, refetch };
};
