"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPost } from "@/types/admin";

export const useGetAdminBlogPostByIdQuery = (id: string) => {
  return useQuery<AdminPost>({
    queryKey: ["admin-blog-post", id],
    queryFn: () => http.httpGetAdminBlogPostById(id),
    enabled: !!id,
  });
};
