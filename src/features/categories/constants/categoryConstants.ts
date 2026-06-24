export const CATEGORY_ENDPOINTS = {
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (categoryId: string) => `/categories/${categoryId}`,
} as const;
