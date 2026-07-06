export const INVENTORY_ENDPOINTS = {
  INVENTORY: "/inventory",
  SHORTAGES: "/inventory/shortages",
  SYNCHRONIZE: "/inventory/synchronize",
  STOCK: (id: string) => `/inventory/${id}/stock`,
  BULK_UPDATE: "/inventory/bulk-update",
};
