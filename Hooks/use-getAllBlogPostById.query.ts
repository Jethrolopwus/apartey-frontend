

"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";

export const useGetAllBlogPostByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["Blogs", id],
    queryFn: () => http.httpGetAllBlogsById(id),
    enabled: !!id,
  });
};
