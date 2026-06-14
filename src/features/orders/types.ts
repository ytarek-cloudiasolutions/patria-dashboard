export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "On The Way"
  | "Delivered"
  | "Cancelled";

export type OrderSource = "application" | "pos" | "call";

export type OrderStatusFilter = "All Categories" | OrderStatus;

export type OrderCategory =
  | "All Categories"
  | "Sandwiches"
  | "Coffee"
  | "Bakery"
  | "Meals";

export type PaymentState = "Paid" | "Waiting for payment" | "None";

export interface OrderLineItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  zone?: string;
  date: string;
  time: string;
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: OrderStatus;
  category: Exclude<OrderCategory, "All Categories">;
  source: OrderSource;
  paymentMethod: string;
  paymentState: PaymentState;
  items: OrderLineItem[];
  driver?: string;
}

export interface OrdersSummary {
  revenue: number;
  totalOrders: number;
  pending: number;
  delivered: number;
}

/** A single selectable add-on for a product (multi-select checkboxes). */
export interface ProductExtra {
  id: number;
  name: string;
  price: number;
}

/** One option inside a single-select variant group (radio buttons). */
export interface ProductVariantOption {
  id: number;
  name: string;
  price: number;
}

/** A required single-select group such as "Roast Level" or "Grind Type". */
export interface ProductVariantGroup {
  id: number;
  name: string;
  required?: boolean;
  options: ProductVariantOption[];
}

export interface ProductOption {
  id: number;
  name: string;
  unitPrice: number;
  category: Exclude<OrderCategory, "All Categories">;
  customizable?: boolean;
  variantGroups?: ProductVariantGroup[];
  extras?: ProductExtra[];
}

/** A configured product sitting in the order builder cart. */
export interface CartLineItem {
  /** Unique per cart line (a product configured differently is a new line). */
  uid: string;
  productId: number;
  name: string;
  basePrice: number;
  /** Per-unit price including the selected variants + extras. */
  unitPrice: number;
  quantity: number;
  variantSelections: { groupName: string; optionName: string; price: number }[];
  extras: { name: string; price: number }[];
  specialRequest?: string;
}

/** A delivery zone available when taking a phone/call order. */
export interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  minOrder: number;
}

export interface Driver {
  id: string;
  name: string;
}

/** A customer record matched by phone number during a call order. */
export interface CustomerLookup {
  name: string;
  phone: string;
  lastAddress: string;
  tier: string;
}
