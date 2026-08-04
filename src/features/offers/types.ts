export type OfferStatus = "Active" | "Inactive";
export type DiscountType = "percentage" | "fixed";

export interface Offer {
  id: string | number;
  offerStatus: boolean;
  offerTitle: string;
  offerDescription: string;
  offerPercentage: number;
  discountType: DiscountType;
  offerValidPeriod: string;
  numberOfProducts: number;
  offerImage?: string;
  startDate?: string;
  endDate?: string;
  usageCount?: number;
  code?: string;
  usageLimit?: number | null;
  minOrderAmount?: number | null;
  claimsCount?: number;
  productIds?: string[];
}

export interface OfferProduct {
  id: string;
  name: string;
  price: number;
}

export interface OfferFormData {
  productName: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  startDate: string;
  endDate: string;
  bannerImage?: string;
  productIds: string[];
  code?: string;
  usageLimit?: string;
  minOrderAmount?: string;
}

export interface BroadcastFormData {
  title: string;
  body: string;
}

export type WhatsAppTargetType = "random" | "select";

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
}

export interface WhatsAppBroadcastFormData {
  targetType: WhatsAppTargetType;
  customerCount: number | "all" | null;
  customNumber: string;
  selectedCustomerIds: (string | number)[];
  image: File | null;
  body: string;
}
