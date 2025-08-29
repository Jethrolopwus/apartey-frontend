"use client";

interface PaymentSummaryProps {
  selectedTier: string;
  addOns: string[];
  aparteyKeys: number;
  currency: string;
}

const PaymentSummary = ({ 
  selectedTier, 
  addOns, 
  aparteyKeys, 
  currency 
}: PaymentSummaryProps) => {
  // Calculate pricing based on tier and add-ons
  const getTierPrice = (tier: string): number => {
    switch (tier) {
      case "FastSale":
        return 5000;
      case "Premium":
        return 10000;
      case "Standard":
        return 3000;
      default:
        return 5000;
    }
  };

  const getAddOnPrice = (addOn: string): number => {
    switch (addOn) {
      case "liftsToTop":
        return 2000;
      case "certifiedByApartey":
        return 1500;
      default:
        return 0;
    }
  };

  const getAddOnLabel = (addOn: string): string => {
    switch (addOn) {
      case "liftsToTop":
        return "Lift to Top";
      case "certifiedByApartey":
        return "Certified by Apartey";
      default:
        return addOn;
    }
  };

  const tierPrice = getTierPrice(selectedTier);
  const addOnsTotal = addOns.reduce((total, addOn) => total + getAddOnPrice(addOn), 0);
  const aparteyKeysPrice = aparteyKeys * 100; // 100 per key
  const subtotal = tierPrice + addOnsTotal + aparteyKeysPrice;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Payment Summary
      </h2>
      
      <div className="space-y-4">
        {/* Tier Selection */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">{selectedTier} Package</h3>
            <p className="text-sm text-gray-600">Property listing promotion</p>
          </div>
          <span className="font-semibold text-gray-900">
            {tierPrice.toLocaleString()} {currency.toUpperCase()}
          </span>
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Add-ons</h4>
            {addOns.map((addOn) => (
              <div key={addOn} className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">{getAddOnLabel(addOn)}</span>
                <span className="text-sm font-medium text-gray-900">
                  {getAddOnPrice(addOn).toLocaleString()} {currency.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Apartey Keys */}
        {aparteyKeys > 0 && (
          <div className="flex justify-between items-center py-3 border-t border-gray-200">
            <div>
              <h4 className="font-medium text-gray-900">Apartey Keys</h4>
              <p className="text-sm text-gray-600">{aparteyKeys} keys</p>
            </div>
            <span className="font-semibold text-gray-900">
              {aparteyKeysPrice.toLocaleString()} {currency.toUpperCase()}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          <span className="text-xl font-bold text-gray-900">
            {subtotal.toLocaleString()} {currency.toUpperCase()}
          </span>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your payment details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary; 