"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPostsResponse, useGetAdminAllBlogPostQueryParams } from "@/types/admin";

export const useGetAdminAllBlogPostQuery = (
  params?: useGetAdminAllBlogPostQueryParams
) => {
  const { data, isLoading, error, refetch } = useQuery<AdminPostsResponse>({
    queryKey: ["admin-blog-posts", params], // <-- include params in key
    queryFn: () => http.httpGetAdminAllBlogPosts(params), // <-- pass params
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};