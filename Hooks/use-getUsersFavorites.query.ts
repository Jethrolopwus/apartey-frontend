
"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetUserFavoriteQuery = () => {
  return useQuery({
    queryKey: ["user-favorites"],
    queryFn: () => http.httpGetUsersFavorites(),
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
};
