export const ORDER_ENDPOINTS = {
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  PAY_ORDER: (id: string) => `/orders/${id}/pay`,
};
