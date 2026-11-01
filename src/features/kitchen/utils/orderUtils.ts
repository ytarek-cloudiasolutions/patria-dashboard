/**
 * Consistently formats the human-readable display ID for a kitchen order.
 * E.g. "ORD-299556" -> "#ORD-299556", "#ORD-101" -> "#ORD-101",
 * or falls back to last 6 chars of Mongo _id -> "#A33A92".
 */
export function formatKitchenOrderId(order: {
  orderId?: string;
  orderNumber?: string;
  _id: string;
}): string {
  const raw = (
    order.orderId ||
    order.orderNumber ||
    (order._id ? order._id.slice(-6).toUpperCase() : "")
  ).trim();

  if (!raw) return "";
  return raw.startsWith("#") ? raw : `#${raw}`;
}

