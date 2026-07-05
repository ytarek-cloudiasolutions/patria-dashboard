export const OFFER_ENDPOINTS = {
  OFFERS: "/offers",
  OFFER_BY_ID: (id: string) => `/offers/${id}`,
  TOGGLE: (id: string) => `/offers/${id}/toggle`,
};
