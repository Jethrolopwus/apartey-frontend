// "use client";

// import { useQuery } from "@tanstack/react-query";
// import http from "@/services/http";

// export const useGetAdminClaimPropertyDetailsByIdQuery = (id: string) => {
//   return useQuery({
//     queryKey: ["AdminProperty", id],
//     queryFn: () => http.httpGetAdminClaimedPropertyDetails(id),
//     enabled: !!id,
//   });
// };

"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { ApiClaimResponse } from "@/types/admin";

export const useGetAdminClaimPropertyDetailsByIdQuery = (id: string) => {
  return useQuery<ApiClaimResponse, Error>({
    queryKey: ["AdminProperty", id],
    queryFn: () => http.httpGetAdminClaimedPropertyDetails(id),
    enabled: !!id,
  });
};
