export const PRODUCT_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (productId: string) => `/products/${productId}`,
  SCAN_BY_BARCODE: (code: string) => `/products/scan/${encodeURIComponent(code)}`,
  TOGGLE: (productId: string) => `/products/${productId}/toggle`,
} as const;

