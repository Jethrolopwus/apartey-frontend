
"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetUserActivitiesQuery = () => {
  return useQuery({
    queryKey: ["user-activities"],
    queryFn: () => http.httpGetUsersActivities(),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
};
