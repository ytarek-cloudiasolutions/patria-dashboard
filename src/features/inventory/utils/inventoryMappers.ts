import type { InventoryItem, StockStatus, UrgencyLevel } from "../types";
import { resolveImageUrl } from "@/features/products/utils/productMappers";

export const mapBackendStatusToStockStatus = (
  status: string,
  qty: number,
  threshold: number,
): StockStatus => {
  const norm = (status || "").toLowerCase().replace(/_/g, " ");
  if (norm === "out of stock" || qty === 0) return "Out Of Stock";
  if (norm === "low stock" || qty < threshold) return "Low Stock";
  return "Available";
};

export const mapUrgencyLevel = (level?: string): UrgencyLevel => {
  if (!level) return "Sufficient stock";
  const norm = level.toLowerCase();
  if (norm === "critical" || norm === "high" || norm === "red") {
    return "Critical";
  }
  if (norm === "good" || norm === "medium" || norm === "warning") {
    return "Good";
  }
  return "Sufficient stock";
};

export const mapInventoryItem = (item: any): InventoryItem => {
  const categoryName =
    typeof item.categoryId === "string"
      ? item.categoryId
      : typeof item.categoryId === "object" && item.categoryId !== null
        ? item.categoryId.name
        : item.category || "";

  const qty = item.stockQty ?? item.currentQuantity ?? 0;
  const threshold = item.lowStockThreshold ?? item.minimumQuantity ?? 5;
  const status = mapBackendStatusToStockStatus(item.status || "", qty, threshold);

  return {
    id: item._id || item.id,
    name: item.name || "",
    image: resolveImageUrl(item.images || item.image),
    category: categoryName,
    currentQuantity: qty,
    minimumQuantity: threshold,
    status,
    salesRatePerDay: item.salesRatePerDay ?? null,
    expectedExpiryDate: item.expectedExpiryDate ?? null,
    daysRemaining: item.daysRemaining ?? null,
    urgencyLevel: mapUrgencyLevel(item.urgencyLevel),
  };
};

export const mapInventoryItems = (items: any[]): InventoryItem[] => {
  return (items || []).map(mapInventoryItem);
};

export const mapShortageItem = (item: any): InventoryItem => {
  const product = item.product || {};
  const categoryName =
    typeof product.categoryId === "string"
      ? product.categoryId
      : typeof product.categoryId === "object" && product.categoryId !== null
        ? product.categoryId.name
        : product.category || "";

  const qty = item.currentQuantity ?? product.stockQty ?? 0;
  const threshold = product.lowStockThreshold ?? 5;
  const status = qty === 0 ? "Out Of Stock" : qty < threshold ? "Low Stock" : "Available";

  return {
    id: product._id || product.id || item.id,
    name: product.name || "",
    image: resolveImageUrl(product.images || product.image),
    category: categoryName,
    currentQuantity: qty,
    minimumQuantity: threshold,
    status,
    salesRatePerDay: item.salesRatePerDay ?? null,
    expectedExpiryDate: item.expectedExpiryDate ?? null,
    daysRemaining: item.daysRemaining ?? null,
    urgencyLevel: mapUrgencyLevel(item.urgencyLevel),
  };
};

export const mapShortageItems = (items: any[]): InventoryItem[] => {
  return (items || []).map(mapShortageItem);
};
