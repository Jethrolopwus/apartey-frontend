"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PaymentStep from "@/components/molecules/PaymentStep";
import { useCreateAdsPaymentMutation } from "@/Hooks/use-createAdsPayment.mutation";
import { PaymentWrapperProps } from "@/types/payment";
import { TokenManager } from "@/utils/tokenManager";

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
  const [error, setError] = useState<string | null>(null);
  const [, setRetryCount] = useState(0);
  const isCreatingRef = useRef(false);
  const createAdsPaymentMutation = useCreateAdsPaymentMutation();
  const { status } = useSession();
  const router = useRouter();

  // Calculate fallback pricing
  const getFallbackTotalPrice = () => {
    const tierPrices = {
      'Fast Sale': currency === 'ngn' ? 40000 : currency === 'eur' ? 28 : 28,
      'Turbo Boost': currency === 'ngn' ? 120000 : currency === 'eur' ? 80 : 80,
      'Easy Start': 0
    };
    
    const addOnPrice = currency === 'ngn' ? 20000 : currency === 'eur' ? 17 : 18;
    const aparteyKeyPrice = currency === 'ngn' ? 5000 : currency === 'eur' ? 3 : 3;
    
    const tierPrice = tierPrices[selectedTier as keyof typeof tierPrices] || 0;
    const addOnsTotal = addOns.length * addOnPrice;
    const aparteyKeysTotal = aparteyKeys * aparteyKeyPrice;
    
    return tierPrice + addOnsTotal + aparteyKeysTotal;
  };

  const createPaymentIntent = useCallback(async () => {
    if (isCreatingRef.current) return;
    isCreatingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Check authentication first
      if (status === 'unauthenticated') {
        throw new Error("You must be logged in to create a payment. Please sign in first.");
      }

      if (status === 'authenticated' && !TokenManager.hasToken()) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const paymentData = {
        id: listingId,
        paymentData: {
          selectedTier,
          addOns,
          aparteyKeys,
          currency,
          totalPrice: getFallbackTotalPrice()
        }
      };

      console.log("Creating payment intent with data:", paymentData);
      const response = await createAdsPaymentMutation.mutateAsync(paymentData);
      
      if (response?.clientSecret) {
        setClientSecret(response.clientSecret);
        console.log("Payment intent created successfully");
      } else {
        throw new Error("No client secret received");
      }
    } catch (error: unknown) {
      console.error("Failed to create payment intent:", error);
      
      // Handle specific error cases with retry logic
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        setError("Authentication required. Please sign in to continue with payment.");
      } else if (errorMessage.includes("Failed to fetch property")) {
        setError("Backend service is temporarily unavailable. Please try again later or contact support.");
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
        setError("Server error occurred. Please try again later or contact support if the issue persists.");
      } else {
        setError(errorMessage || "Failed to create payment intent");
      }
    } finally {
      setIsLoading(false);
      isCreatingRef.current = false;
    }
  }, [status, createAdsPaymentMutation, listingId, selectedTier, addOns, aparteyKeys, currency]);

  useEffect(() => {
    // Reset retry count when parameters change
    setRetryCount(0);
    
    // Only attempt to create payment if user is authenticated and has a token
    if (!clientSecret && !isLoading && !error && status === 'authenticated' && TokenManager.hasToken()) {
      createPaymentIntent();
    } else if (status === 'unauthenticated') {
      setError("You must be logged in to create a payment. Please sign in first.");
    } else if (status === 'authenticated' && !TokenManager.hasToken()) {
      setError("Authentication token not found. Please sign in again.");
    }
  }, [listingId, selectedTier, addOns, aparteyKeys, currency, status, clientSecret, createPaymentIntent, error, isLoading]);

  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#C85212',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
      },
    },
  }), [clientSecret]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212] mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes("Authentication") || error.includes("logged in") || error.includes("sign in");
    
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Payment Error</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
          
          <div className="mt-4 flex gap-3 justify-center">
            {isAuthError ? (
              <button
                onClick={() => router.push('/signin')}
                className="px-4 py-2 bg-[#C85212] text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  setError(null);
                  setRetryCount(0);
                  createPaymentIntent();
                }}
                className="px-4 py-2 bg-[#C85212] text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85212] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentStep />
    </Elements>
  );
};

export default PaymentWrapper;