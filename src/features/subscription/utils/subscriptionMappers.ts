import type {
  Subscription,
  SubscriptionFrequency,
  SubscriptionStatus,
  PaymentStatus,
  RoastLevel,
  ProductGrind,
} from "../types";

export const mapFrequency = (freq: string): SubscriptionFrequency => {
  const norm = (freq || "").toLowerCase().replace(/[\s-_]/g, "");
  if (norm === "biweekly" || norm === "bi-weekly") return "bi-weekly";
  if (norm === "monthly") return "Monthly";
  return "Weekly";
};

export const mapStatus = (status: string): SubscriptionStatus => {
  const norm = (status || "").toLowerCase();
  if (norm === "paused") return "Paused";
  if (norm === "cancelled") return "Cancelled";
  return "Active";
};

export const mapPaymentStatus = (payment: string): PaymentStatus => {
  const norm = (payment || "").toLowerCase();
  if (norm === "paid") return "Paid";
  if (norm === "failed") return "Failed";
  return "Pending";
};

export const formatDeliveryDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const mapSubscription = (s: any): Subscription => {
  const idStr = String(s._id || s.id);
  const ref = s.reference || `#SUB-${idStr.slice(-6).toUpperCase()}`;

  // Handle nested or flat customerId
  const cust = s.customerId;
  const customerId = cust?._id || (typeof cust === "string" ? cust : "");
  const customerName = cust?.name || "Guest";
  const customerEmail = cust?.email || "N/A";

  // Handle nested or flat productId
  const prod = s.productId;
  const productId = prod?._id || (typeof prod === "string" ? prod : "");
  const productName = prod?.name || "N/A";

  return {
    id: s._id || s.id,
    reference: ref,
    customerId,
    customerName,
    customerEmail,
    productId,
    productName,
    price: prod?.price || 0,
    roast: "Medium" as RoastLevel,
    grind: "Whole Bean" as ProductGrind,
    quantity: s.quantity ?? 1,
    frequency: mapFrequency(s.frequency || ""),
    nextDelivery: formatDeliveryDate(s.nextDeliveryDate || ""),
    nextDeliveryDateRaw: s.nextDeliveryDate ? s.nextDeliveryDate.slice(0, 10) : "",
    paymentStatus: mapPaymentStatus(s.paymentStatus || ""),
    status: mapStatus(s.status || ""),
  };
};

export const mapSubscriptions = (subscriptions: any[]): Subscription[] => {
  return (subscriptions || []).map(mapSubscription);
};

export const mapUserOption = (u: any) => {
  return {
    id: u._id || u.id,
    name: u.name || u.phone || "User",
    email: u.email || "N/A",
  };
};

export const mapProductOption = (p: any) => {
  return {
    id: p._id || p.id,
    name: p.name || "",
    roast: "Medium" as RoastLevel,
    grind: "Whole Bean" as ProductGrind,
  };
};
