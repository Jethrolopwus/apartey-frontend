import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminPost, UpdateAdminPostData } from "@/types/admin";

export const useUpdateAdminBlogPostMutation = () => {
  const queryClient = useQueryClient();
  
  const { data, isPending, error, mutate } = useMutation<
    AdminPost, 
    Error, 
    UpdateAdminPostData | globalThis.FormData
  >({
    mutationFn: (data: UpdateAdminPostData | globalThis.FormData) => {
      if (data instanceof globalThis.FormData) {
        // Handle FormData case
        const id = data.get('id') as string;
        return http.httpUpdateAdminBlogPost(id, data);
      } else {
        // Handle regular object case
        const { id, ...updateData } = data;
        return http.httpUpdateAdminBlogPost(id, updateData);
      }
    },
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
