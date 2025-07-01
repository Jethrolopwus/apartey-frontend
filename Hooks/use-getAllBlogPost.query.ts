"use client";
import http from "@/services/http";
import { useQuery } from "@tanstack/react-query";
import { PropertiesResponse, Article } from "@/types/generated";

export interface useGetAllBlogPostQueryParams {
  limit?: number;
  byId?: number;
}

export interface BlogPostResponse {
  data: Article[];
}

export const useGetAllBlogPostQuery = (params?: useGetAllBlogPostQueryParams) => {
  const { data, isLoading, error, refetch } = useQuery<BlogPostResponse>({
    queryKey: ["Blogs", params?.limit, params?.byId],
    queryFn: () => http.httpGetAllBlogPost(params?.limit, params?.byId),
    staleTime: 5 * 60 * 1000, 
    retry: 2,
  });

  return { data, isLoading, error, refetch };
};