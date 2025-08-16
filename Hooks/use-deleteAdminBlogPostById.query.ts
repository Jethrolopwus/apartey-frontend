"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export const useDeleteAdminBlogPostMutation = () => {
  const queryClient = useQueryClient();
  
  const { data, isPending, error, mutate } = useMutation<void, Error, string>({
    mutationFn: (id: string) => http.httpDeleteAdminBlogPost(id),
    onSuccess: () => {
      // Invalidate and refetch blog posts
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    error,
    mutate,
  };
};
