import http from "@/services/http"
import { useQuery } from "@tanstack/react-query"

export const useGetALlReviewsQuery = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['reviews'],
        queryFn: http.httpGetAllReviews,
    })
    
    return { data, isLoading, error, refetch }
}