"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentStep from "@/components/molecules/PaymentStep";
import { useCreateAdsPaymentMutation } from "@/Hooks/use-createAdsPayment.mutation";
import { PaymentWrapperProps } from "@/types/payment";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentWrapper = ({ 
  listingId, 
  selectedTier = "FastSale", 
  addOns = ["liftsToTop", "certifiedByApartey"], 
  aparteyKeys = 0, 
  currency = "ngn" 
}: PaymentWrapperProps) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isCreatingRef = useRef(false);
  const createAdsPaymentMutation = useCreateAdsPaymentMutation();

  // Memoize the options to prevent unnecessary re-renders
  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  }), [clientSecret]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!listingId || isCreatingRef.current) return;
      
      isCreatingRef.current = true;
      setIsLoading(true);
      
      try {
        const response = await createAdsPaymentMutation.mutateAsync({
          id: listingId,
          paymentData: {
            selectedTier,
            addOns,
            aparteyKeys,
            currency,
          },
        });
        
        if (response?.clientSecret) {
          setClientSecret(response.clientSecret);
        } else {
          console.error("No client secret in response:", response);
        }
      } catch (error: unknown) {
        console.error("Failed to create payment intent:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
      } finally {
        setIsLoading(false);
        isCreatingRef.current = false;
      }
    };

    createPaymentIntent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]); // Only depend on listingId to prevent infinite loops

  if (isLoading || !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? "Creating payment intent..." : "Loading payment form..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Elements stripe={stripePromise} options={options}>
        <PaymentStep />
      </Elements>
    </div>
  );
};

export default PaymentWrapper; 