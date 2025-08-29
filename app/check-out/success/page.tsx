"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // You can add additional verification logic here
    // like calling your backend to confirm the payment status
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          {paymentIntentId && (
            <p className="text-sm text-gray-500 mb-6">
              Payment ID: {paymentIntentId}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-800 inline-block"
          >
            Return to Home
          </Link>
          
          <Link
            href="/profile"
            className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-200 inline-block"
          >
            View My Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage; 