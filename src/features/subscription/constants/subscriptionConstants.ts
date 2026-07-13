export const SUBSCRIPTION_ENDPOINTS = {
  SUBSCRIPTIONS: "/subscriptions",
  STATS: "/subscriptions/stats",
  SUBSCRIPTION_BY_ID: (id: string) => `/subscriptions/${id}`,
  USERS: "/customers",
  PRODUCTS: "/products",
  RENEWALS: "/subscriptions/renewals",
};
