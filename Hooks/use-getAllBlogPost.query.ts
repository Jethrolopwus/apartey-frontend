"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { BlogResponse, BlogSearchParams } from "@/types/blog";

export const useGetAllBlogPostQuery = (params?: BlogSearchParams) => {
  const { data, isLoading, error, refetch } = useQuery<BlogResponse>({
    queryKey: ["Blogs", params?.search, params?.limit, params?.page, params?.category],
    queryFn: () => http.httpGetAllBlogPost(params),
    staleTime: 5 * 60 * 1000, 
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};