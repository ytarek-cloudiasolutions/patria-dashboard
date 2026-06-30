export const CUSTOMER_ENDPOINTS = {
  CUSTOMERS: "/customers",
  STATS: "/customers/stats",
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,
};
