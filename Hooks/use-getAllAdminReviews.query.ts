// "use client";
// import http from "@/services/http";
// import { useQuery } from "@tanstack/react-query";
// import { AdminReviewsResponse, GetAllUserQueryParams } from "@/types/admin";

// export const useGetAllAdminReviewsQuery = (params?: GetAllUserQueryParams) => {
//   const { data, isLoading, error, refetch } = useQuery<AdminReviewsResponse>({
//     queryKey: ["Users", params?.limit],
//     queryFn: async () => {
//       const res = await http.httpGetAdminAllUsers(params?.limit);
//       return {
//         reviews: res.users.map((user: any) => ({
//           property: user.property,
//           reviewer: user.reviewer,
//           rating: user.rating,
//           comment: user.comment,
//           date: user.date,
//         })),
//         pagination: res.pagination,
//       } as AdminReviewsResponse;
//     },
//   });

//   return { data, isLoading, error, refetch };
// };

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { AdminReviewsResponse } from "@/types/admin";

type GetAllUserQueryParams = {
  search: string | undefined;
  sortBy: string;
  limit: number;
  page:number
};
export const useGetAllAdminReviewsQuery = (params?: GetAllUserQueryParams) => {
  const query = useQuery<AdminReviewsResponse>({
    queryKey: ["Reviews", params],
    queryFn: async () => {
      const res = await http.httpGetAdminAllReviews(
        params?.search,
        params?.sortBy,
        params?.page,
        params?.limit
      );
      if (!res || !res.reviews) {
        throw new Error("Failed to fetch reviews");
      }
      const mappedResponse: AdminReviewsResponse = {
        reviews: res.reviews.map((review: any) => ({
          id: review.id,
          property: review.property,
          reviewer: review.reviewer,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          date: review.date,
        })),
        pagination: res.pagination,
      };
      return mappedResponse;
    },
  });

  return query;
};
