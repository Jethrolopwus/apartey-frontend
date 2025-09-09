"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
type Sender = {
  firstName: string;
  email: string;
  profilePicture: string;
};

export interface Notification {
  _id: string;
  recipient: string;
  sender: Sender;
  type: "claim" | "like" | string;
  message: string;
  title: string;
  read: boolean;
  metadata?: {
    propertyId?: string;
    propertyTitle?: string;
    claimId?: string;
    rejectionReason?: string; 
  };
  createdAt: string;
  updatedAt: string;
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
    queryKey: [
      "Notifications",
      params?.limit,
      params?.sortBy,
      params?.sortOrder,
    ],
    queryFn: () =>
      http.httpGetAllNotifications(
        params?.limit,
        params?.sortBy,
        params?.sortOrder
      ),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};
