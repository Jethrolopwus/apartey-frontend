"use client";

import { useSearchParams, useParams } from "next/navigation";
import PaymentWrapper from "@/components/molecules/PaymentWrapper";
import PaymentSummary from "@/components/molecules/PaymentSummary";
import { useGetPropertyByIdQuery } from "@/Hooks/use-getAllPropertiesById.query";

const CheckOutPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const listingId = params.id as string;
  const selectedTier = searchParams.get("tier") || "FastSale";
  const addOns = searchParams.get("addOns")?.split(",") || ["liftsToTop", "certifiedByApartey"];
  const aparteyKeys = parseInt(searchParams.get("aparteyKeys") || "0");
  const currency = searchParams.get("currency") || "ngn";
  
  const { data: property, isLoading, error } = useGetPropertyByIdQuery(listingId);

  if (!listingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Checkout Session
          </h1>
          <p className="text-gray-600">
            No listing ID provided. Please return to the listing page and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600">
            The property you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Secure payment powered by Stripe
          </p>
        </div>
        
        {/* Property Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Property Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> {property.propertyType}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    property.status === 'active' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </p>
                <p><span className="font-medium">Selected Currency:</span> 
                  <span className="font-semibold text-[#C85212]">{currency.toUpperCase()}</span>
                </p>
                <p><span className="font-medium">Property Currency:</span> {property.price?.currency}</p>
                {property.price?.salePrice && (
                  <p><span className="font-medium">Sale Price:</span> {property.price.salePrice.toLocaleString()} {property.price.currency}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Location</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Address:</span></p>
                <p className="ml-4">{property.location?.fullAddress}</p>
                <p><span className="font-medium">Country:</span> {property.location?.country}</p>
                <p><span className="font-medium">State/Region:</span> {property.location?.stateOrRegion}</p>
                <p><span className="font-medium">District:</span> {property.location?.district}</p>
              </div>
            </div>
          </div>
        </div>
        
    
        <PaymentSummary
          selectedTier={selectedTier}
          addOns={addOns}
          aparteyKeys={aparteyKeys}
          currency={currency}
        />
        
   
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment Information
          </h2>
          <PaymentWrapper
            listingId={listingId}
            selectedTier={selectedTier}
            addOns={addOns}
            aparteyKeys={aparteyKeys}
            currency={currency}
          />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your payment information is encrypted and secure. 
            We never store your payment details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;