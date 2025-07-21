import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/services/http";

export const useDeleteNotificationById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await http.httpDeleteNotificationById(id);
      } catch (error) {
        throw {
          message: 'Failed to delete Notification',
          status: (error as any)?.response?.status
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notifications"] });
    },
    onError: (error) => {
      console.error('Error deleting Notification:', error);
    }
  });
};