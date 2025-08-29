export interface PaymentData {
  selectedTier: string;
  addOns: string[];
  aparteyKeys: number;
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId?: string;
  status?: string;
}

export interface PaymentWrapperProps {
  listingId: string;
  selectedTier?: string;
  addOns?: string[];
  aparteyKeys?: number;
  currency?: string;
}

export interface CreateAdsPaymentRequest {
  id: string;
  paymentData: PaymentData;
} 