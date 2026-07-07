export const PRODUCT_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (productId: string) => `/products/${productId}`,
  TOGGLE: (productId: string) => `/products/${productId}/toggle`,
} as const;
