
"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const PaymentStep = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded");
      return;
    }

    setIsPaying(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // You can customize the return URL based on your needs
          return_url: `${window.location.origin}/check-out/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        toast.error(result.error.message || "Payment failed");
        setIsPaying(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        
      
        setTimeout(() => {
          router.push("/homeowner-profile");
        }, 3000); 
        
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Complete Payment
        </h2>
        <p className="text-gray-600 text-sm">
          Enter your payment details to complete your purchase
        </p>
      </div>
      
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      <button
        onClick={handlePayment}
        disabled={!stripe || isPaying}
        className="w-full bg-[#C85212] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPaying ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;