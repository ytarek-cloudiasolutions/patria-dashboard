import type { Offer } from "./types";

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
