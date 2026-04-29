export type StockStatus = "Out Of Stock" | "Low Stock" | "In Stock";

export type UrgencyLevel = "Critical" | "Good" | "Sufficient stock";

export type InventoryTab = "stock" | "shortages";

export interface InventoryProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryColor: string;
  currentQuantity: number;
  minimumQuantity: number;
  status: StockStatus;
}

export interface ShortageProduct {
  id: string;
  name: string;
  currentQuantity: number;
  salesRatePerDay: number | null;
  daysRemaining: number | null;
  expectedExpiryDate: string | null;
  urgencyLevel: UrgencyLevel;
}

export interface InventoryOverview {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  inventoryValue: string;
}

export interface AdjustedQuantity {
  productId: string;
  quantity: number;
}