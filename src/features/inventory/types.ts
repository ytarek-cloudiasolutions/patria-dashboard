export type StockStatus = "Available" | "Low Stock" | "Out Of Stock";
export type UrgencyLevel = "Critical" | "Good" | "Sufficient stock";

export interface InventoryItem {
  id: number;
  name: string;
  image?: string;
  category: string;
  currentQuantity: number;
  minimumQuantity: number;
  status: StockStatus;
  salesRatePerDay: number | null;
  expectedExpiryDate: string | null;
  daysRemaining: number | null;
  urgencyLevel: UrgencyLevel;
}
