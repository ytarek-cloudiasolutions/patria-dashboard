import type { Customer, DiscountType, Offer, OfferProduct } from "./types";

export const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: "percentage", label: "Percentage %" },
  { value: "fixed", label: "Fixed amount (EGP)" },
];

export const OFFER_PRODUCTS: OfferProduct[] = [
  { id: 1, name: "Kunafa Tiramsu", price: 85.2 },
  { id: 2, name: "Eish el Saraya", price: 85.2 },
  { id: 3, name: "Middle Eastern Roast Beef", price: 85.2 },
  { id: 4, name: "Baklava Cheesecake", price: 85.2 },
  { id: 5, name: "Umm Ali", price: 85.2 },
  { id: 6, name: "Mahalabia", price: 85.2 },
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 1,
    offerStatus: true,
    offerTitle: "Ramadan Kareem",
    offerDescription: "20% off all orders - celebrate the holy month",
    offerPercentage: 20,
    discountType: "percentage",
    offerValidPeriod: "Mar 1 - Apr 10, 2026",
    numberOfProducts: 2,
    offerImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    id: 2,
    offerStatus: true,
    offerTitle: "Welcome Offer",
    offerDescription: "15% off your first order - enjoy ERB Roastery",
    offerPercentage: 15,
    discountType: "percentage",
    offerValidPeriod: "Mar 1 - Apr 10, 2026",
    numberOfProducts: 2,
    offerImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    id: 3,
    offerStatus: true,
    offerTitle: "Weekend Brunch Deal",
    offerDescription:
      "50 EGP off on orders above 350 EGP every Friday & Saturday",
    offerPercentage: 50,
    discountType: "fixed",
    offerValidPeriod: "Mar 1 - Apr 10, 2026",
    numberOfProducts: 2,
    offerImage:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80",
  },
  {
    id: 4,
    offerStatus: false,
    offerTitle: "Ramadan Kareem",
    offerDescription: "20% off all orders - celebrate the holy month",
    offerPercentage: 20,
    discountType: "percentage",
    offerValidPeriod: "Mar 1 - Apr 10, 2026",
    numberOfProducts: 2,
    offerImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
];

export const CUSTOMER_COUNT_OPTIONS: { value: number | "all"; label: string }[] =
  [
    { value: 25, label: "25 Customer" },
    { value: 50, label: "50 Customer" },
    { value: 100, label: "100 Customer" },
    { value: 200, label: "200 Customer" },
    { value: 500, label: "500 Customer" },
    { value: "all", label: "All Customers" },
  ];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: "Omnia Maher Galal", phone: "01288716491" },
  { id: 2, name: "Liam Johnson", phone: "01345678901" },
  { id: 3, name: "Aisha Patel", phone: "01456789012" },
  { id: 4, name: "Carlos Mendoza", phone: "01567890123" },
  { id: 5, name: "Sofia Kim", phone: "01678901234" },
];
