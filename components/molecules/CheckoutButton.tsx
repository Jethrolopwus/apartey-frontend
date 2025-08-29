"use client";

import Link from "next/link";

interface CheckoutButtonProps {
  propertyId: string;
  selectedTier?: string;
  addOns?: string[];
  aparteyKeys?: number;
  currency?: string;
  className?: string;
  children?: React.ReactNode;
}

const CheckoutButton = ({
  propertyId,
  selectedTier = "FastSale",
  addOns = ["liftsToTop", "certifiedByApartey"],
  aparteyKeys = 0,
  currency = "ngn",
  className = "",
  children
}: CheckoutButtonProps) => {
  // Build the checkout URL with query parameters
  const buildCheckoutUrl = () => {
    const params = new URLSearchParams({
      tier: selectedTier,
      addOns: addOns.join(","),
      aparteyKeys: aparteyKeys.toString(),
      currency: currency,
    });
    
    return `/check-out/${propertyId}?${params.toString()}`;
  };

  return (
    <Link
      href={buildCheckoutUrl()}
      className={`inline-block bg-black text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-800 ${className}`}
    >
      {children || "Proceed to Checkout"}
    </Link>
  );
};

export default CheckoutButton; 