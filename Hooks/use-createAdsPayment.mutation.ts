import http from "@/services/http";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CreateAdsPaymentRequest, PaymentIntentResponse } from "@/types/payment";

export const useCreateAdsPaymentMutation = () => {
  return useMutation({
    mutationFn: (data: CreateAdsPaymentRequest): Promise<PaymentIntentResponse> => 
      http.httpCreateAdsPayment(data),
    
    onSuccess: (data) => {
      if (data?.clientSecret) {
        toast.success("Payment intent created successfully");
      } else {
        toast.success("Ads payment created successfully");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};