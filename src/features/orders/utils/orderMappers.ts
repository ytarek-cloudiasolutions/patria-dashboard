import type { Order, OrderStatus, OrderSource, PaymentState } from "../types";

export const mapOrderStatus = (backendStatus: string): OrderStatus => {
  const status = (backendStatus || "").toLowerCase();
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "On The Way";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
};

export const mapOrderStatusToBackend = (uiStatus: OrderStatus): string => {
  switch (uiStatus) {
    case "Pending":
      return "pending";
    case "Confirmed":
      return "confirmed";
    case "Preparing":
      return "preparing";
    case "On The Way":
      return "ready";
    case "Delivered":
      return "delivered";
    case "Cancelled":
      return "cancelled";
    default:
      return "pending";
  }
};

export const mapOrder = (o: any): Order => {
  const dateObj = o.createdAt ? new Date(o.createdAt) : new Date();
  const dateStr = dateObj.toLocaleDateString("en-GB");
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const items = (o.items || []).map((item: any, idx: number) => {
    const product = item.productId || item.product || {};
    return {
      id: product._id || product.id || String(idx),
      productId: product._id || product.id,
      name: product.name || "Unknown Product",
      quantity: item.quantity || 0,
      unitPrice: item.price || product.price || 0,
      note: item.notes || "",
    };
  });

  const subtotal = items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);

  let paymentState: PaymentState = "Waiting for payment";
  if (o.paymentStatus === "paid" || o.isPaid) {
    paymentState = "Paid";
  }

  const rawCat = items[0]?.category || "Coffee";
  const category =
    rawCat === "Bakery" || rawCat === "Meals" || rawCat === "Sandwiches"
      ? rawCat
      : "Coffee";

  return {
    id: o._id || o.id,
    customerName: o.customerId?.name || o.customerName || "Walk-in Customer",
    customerPhone: o.customerId?.phone || o.customerPhone || "",
    customerEmail: o.customerId?.email || o.customerEmail || "",
    address: o.address || "In Store",
    zone: o.zone || "",
    date: dateStr,
    time: timeStr,
    total: o.totalAmount || o.total || subtotal,
    subtotal: o.subtotal || subtotal,
    discount: o.discount || 0,
    deliveryFee: o.deliveryFee || 0,
    status: mapOrderStatus(o.status),
    category,
    source: (o.source || (o.type === "takeaway" ? "call" : "application")).toLowerCase() as OrderSource,
    paymentMethod: o.paymentMethod || "Cash on delivery",
    paymentState,
    items,
    driver: o.driver || undefined,
  };
};

export const mapOrders = (orders: any[]): Order[] => {
  return (orders || []).map(mapOrder);
};
