import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPost, CreateAdminPostData } from "@/types/admin";

export const useCreateAdminBlogPostMutation = () => {
  const queryClient = useQueryClient();
  
  const { data, isPending, error, mutate } = useMutation<
    AdminPost,
    Error,
    CreateAdminPostData | globalThis.FormData
  >({
    mutationFn: (data: CreateAdminPostData | globalThis.FormData) =>
      http.httpCreateAdminBlogPost(data),
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
