"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
}

export interface useGetAllNotificationsQueryParams {
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const useGetAllNotificationsQuery = (
  params?: useGetAllNotificationsQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<Notification[]>({
    queryKey: ["Notifications", params?.limit, params?.sortBy, params?.sortOrder],
    queryFn: () => http.httpGetAllNotifications(params?.limit, params?.sortBy, params?.sortOrder),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
