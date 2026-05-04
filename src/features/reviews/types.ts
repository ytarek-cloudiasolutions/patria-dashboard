export type OrderType = "Delivery" | "Dine-in" | "Pickup";

export type ReviewTag =
  | "Service speed"
  | "Driver friendliness"
  | "Value for money";

export type RatingFilter = "All Ratings" | "5" | "4" | "3" | "2" | "1";

export type CategoryFilter = "All Categories" | OrderType;

export interface Review {
  id: string;
  customerName: string;
  phone: string;
  orderId: string;
  orderType: OrderType;
  rating: number;
  maxRating: number;
  comment: string;
  tags: ReviewTag[];
  date: string;
  isHidden: boolean;
}

export interface RatingDistribution {
  star: number;
  count: number;
}

export interface HighestRatedCategory {
  id: string;
  label: string;
  icon: string;
  score: number;
}