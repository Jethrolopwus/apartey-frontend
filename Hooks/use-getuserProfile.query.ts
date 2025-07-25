"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetUserProfileQuery = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => http.httpGetUsersProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
