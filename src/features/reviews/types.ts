export type ReviewCategory =
  | "Service speed"
  | "Driver friendliness"
  | "Value for money"
  | "Food quality"
  | "Packaging";

export type OrderType = "Delivery" | "Pickup" | "Dine-in";

export interface Review {
  id: number;
  customerName: string;
  customerCode: string;
  orderId: string;
  orderType: OrderType;
  rating: number;
  maxRating: number;
  comment: string;
  categories: ReviewCategory[];
  createdAt: string;
  isHidden?: boolean;
}

export interface RatingDistributionRow {
  stars: number;
  count: number;
}

export interface HighestRatedItem {
  label: string;
  count: number;
}
