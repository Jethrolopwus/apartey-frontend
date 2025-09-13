"use client";

interface PaymentSummaryProps {
  selectedTier: string;
  addOns: string[];
  aparteyKeys: number;
  currency: string;
  totalPrice?: number;
  keysDiscount?: number;
}

const PaymentSummary = ({ 
  selectedTier, 
  addOns, 
  aparteyKeys, 
  currency,
  totalPrice,
  keysDiscount
}: PaymentSummaryProps) => {
  // Use actual pricing from ad promotion form if available
  const getTierPrice = (tier: string): number => {
    // If we have totalPrice from the form, calculate tier price
    if (totalPrice !== undefined) {
      const addOnsTotal = addOns.length * 20000; // Assuming 20k per add-on for NGN
      const keysDiscountAmount = keysDiscount || 0;
      return totalPrice + keysDiscountAmount - addOnsTotal;
    }
    
    // Fallback to default pricing
    switch (tier) {
      case "FastSale":
        return currency === 'ngn' ? 40000 : currency === 'eur' ? 28 : 28;
      case "Turbo Boost":
        return currency === 'ngn' ? 120000 : currency === 'eur' ? 80 : 80;
      case "Easy Start":
        return 0;
      default:
        return currency === 'ngn' ? 40000 : currency === 'eur' ? 28 : 28;
    }
  };

  const getAddOnPrice = (): number => {
    return currency === 'ngn' ? 20000 : currency === 'eur' ? 17 : 18;
  };

  const getAddOnLabel = (addOn: string): string => {
    switch (addOn) {
      case "Check and certify my ad by Apartey experts":
        return "Certified by Apartey";
      case "10 lifts to the top of the list (daily, 7 days)":
        return "Lift to Top (7 days)";
      case "Detailed user engagement analytics":
        return "Advanced Analytics";
      default:
        return addOn;
    }
  };

  const tierPrice = getTierPrice(selectedTier);
  const addOnsTotal = addOns.reduce((total) => total + getAddOnPrice(), 0);
  const finalTotal = totalPrice !== undefined ? totalPrice : (tierPrice + addOnsTotal - (keysDiscount || 0));

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
            {currency === 'ngn' ? '₦' : currency === 'eur' ? '€' : '$'}{tierPrice.toLocaleString()}
          </span>
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && addOns[0] !== '' && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Add-ons</h4>
            {addOns.map((addOn, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">{getAddOnLabel(addOn)}</span>
                <span className="text-sm font-medium text-gray-900">
                  {currency === 'ngn' ? '₦' : currency === 'eur' ? '€' : '$'}{getAddOnPrice().toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">Add-ons Subtotal</span>
              <span className="text-sm font-semibold text-gray-900">
                {currency === 'ngn' ? '₦' : currency === 'eur' ? '€' : '$'}{addOnsTotal.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Apartey Keys Discount */}
        {aparteyKeys > 0 && keysDiscount && keysDiscount > 0 && (
          <div className="flex justify-between items-center py-3 border-t border-gray-200">
            <div>
              <h4 className="font-medium text-green-700">Apartey Keys Discount</h4>
              <p className="text-sm text-gray-600">{aparteyKeys} keys applied</p>
            </div>
            <span className="font-semibold text-green-700">
              -{currency === 'ngn' ? '₦' : currency === 'eur' ? '€' : '$'}{keysDiscount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          <span className="text-xl font-bold text-gray-900">
            {currency === 'ngn' ? '₦' : currency === 'eur' ? '€' : '$'}{finalTotal.toLocaleString()}
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