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
}
