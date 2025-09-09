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
    queryKey: ["Users", params],
    queryFn: () => http.httpGetAdminAllUsers(
      params?.limit, 
      params?.page, 
      params?.search, 
      params?.sort
    ),
  });

  return { data, isLoading, error, refetch };
};
