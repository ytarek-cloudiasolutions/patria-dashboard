import type {
  RatingFilter,
  CategoryFilter,
  Review,
  RatingDistribution,
  HighestRatedCategory,
} from "./types";

export const RATING_FILTERS: RatingFilter[] = [
  "All Ratings",
  "5",
  "4",
  "3",
  "2",
  "1",
];

export const CATEGORY_FILTERS: CategoryFilter[] = [
  "All Categories",
  "Delivery",
  "Dine-in",
  "Pickup",
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    customerName: "Omnia Maher",
    phone: "01201336738",
    orderId: "ORD-281504",
    orderType: "Delivery",
    rating: 4.0,
    maxRating: 5.0,
    comment: '"wow"',
    tags: ["Service speed", "Driver friendliness", "Value for money"],
    date: "3/31/2026, 2:37:57 PM",
    isHidden: false,
  },
  {
    id: "r2",
    customerName: "Esraa",
    phone: "01201536738",
    orderId: "ORD-281504",
    orderType: "Delivery",
    rating: 3.0,
    maxRating: 5.0,
    comment: '"wow"',
    tags: ["Service speed", "Driver friendliness"],
    date: "3/31/2026, 2:37:57 PM",
    isHidden: false,
  },
  {
    id: "r3",
    customerName: "Kareem Nabil",
    phone: "01201536738",
    orderId: "ORD-281504",
    orderType: "Delivery",
    rating: 1.5,
    maxRating: 5.0,
    comment: '"Bad taste"',
    tags: [],
    date: "3/31/2026, 2:37:57 PM",
    isHidden: false,
  },
  {
    id: "r4",
    customerName: "Mennatallah",
    phone: "01201536738",
    orderId: "ORD-281504",
    orderType: "Delivery",
    rating: 4.0,
    maxRating: 5.0,
    comment: '"Great Coffee"',
    tags: ["Service speed", "Driver friendliness", "Value for money"],
    date: "3/31/2026, 2:37:57 PM",
    isHidden: false,
  },
  {
    id: "r5",
    customerName: "Osama Kahled",
    phone: "01201536739",
    orderId: "ORD-281504",
    orderType: "Delivery",
    rating: 3.0,
    maxRating: 5.0,
    comment: '"wow"',
    tags: ["Service speed", "Driver friendliness"],
    date: "3/31/2026, 2:37:57 PM",
    isHidden: false,
  },
];

export const RATING_DISTRIBUTION: RatingDistribution[] = [
  { star: 5, count: 0 },
  { star: 4, count: 1 },
  { star: 3, count: 2 },
  { star: 2, count: 0 },
  { star: 1, count: 0 },
];

export const HIGHEST_RATED_CATEGORIES: HighestRatedCategory[] = [
  { id: "driver", label: "Driver Friendliness", icon: "truck", score: 3 },
  { id: "speed", label: "Service Speed", icon: "zap", score: 3 },
  { id: "value", label: "Value For Money", icon: "dollar", score: 3 },
];
