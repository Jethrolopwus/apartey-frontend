"use client";

import CheckoutButton from "./CheckoutButton";

interface PropertyCheckoutButtonProps {
  propertyId: string;
  className?: string;
}

const PropertyCheckoutButton = ({ propertyId, className = "" }: PropertyCheckoutButtonProps) => {
  return (
    <CheckoutButton
      propertyId={propertyId}
      selectedTier="FastSale"
      addOns={["liftsToTop", "certifiedByApartey"]}
      aparteyKeys={100}
      currency="ngn"
      className={className}
    >
      Proceed to Checkout
    </CheckoutButton>
  );
};

export default PropertyCheckoutButton; 