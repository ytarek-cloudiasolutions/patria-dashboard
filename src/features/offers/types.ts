export type OfferStatus = "Active" | "Inactive";
export type DiscountType = "percentage" | "fixed";

export interface Offer {
  id: number;
  offerStatus: boolean;
  offerTitle: string;
  offerDescription: string;
  offerPercentage: number;
  discountType: DiscountType;
  offerValidPeriod: string;
  numberOfProducts: number;
  offerImage?: string;
}

export interface OfferProduct {
  id: number;
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
  productIds: number[];
}

export interface BroadcastFormData {
  title: string;
  body: string;
}
