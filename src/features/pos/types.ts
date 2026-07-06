export type OrderType = "dine-in" | "takeaway";

export type PaymentMethod = "cash" | "card" | "mix";

/** Horizontal category tab shown above the product grid. */
export type PosCategory = {
  id: string;
  label: string;
  imageUrl: string;
};

/** An optional add-on a product can be customized with. */
export type ProductExtra = {
  id: string;
  name: string;
  price: number;
};

export type PosProduct = {
  id: string;
  name: string;
  price: number;
  /** Original price, shown struck-through when the product is on sale. */
  originalPrice?: number;
  category: string;
  imageUrl: string;
  /** Tailwind background class used behind the product image. */
  accent?: string;
  /** Low-stock label, e.g. "Low - 7". */
  stockBadge?: string;
  /** Extras the customer can pick when adding this product. */
  extras?: ProductExtra[];
};

/** A product extra with its selected state inside a cart line. */
export type CartExtra = ProductExtra & { selected: boolean };

/** A single line in the order cart (a customized product instance). */
export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  extras: CartExtra[];
  instructions?: string;
};

export type StaffPosition = "Admin" | "Manager" | "Barista" | "Staff";

export type StaffMember = {
  id: string;
  name: string;
  role?: string;
  /** Remaining balance on the staff member's account. */
  remaining?: number;
};

export type ShiftPaymentSummary = {
  method: PaymentMethod;
  label: string;
  amount: number;
};

/** A single charge in an employee account's pay book. */
export type EmployeeAccountEntry = {
  amount: number;
  method: "Cash" | "Card";
  date: string;
};

export type EmployeeAccount = {
  id: string;
  name: string;
  daysLeft: number;
  total: number;
  remaining: number;
  payBook: EmployeeAccountEntry[];
};

/** A held / unpaid order waiting on a table. */
export type PendingOrder = {
  id: string;
  table: string;
  itemCount: number;
  time: string;
  total: number;
};

/** Totals derived from the current cart. */
export type CartTotals = {
  subtotal: number;
  extras: number;
  tax: number;
  total: number;
  itemCount: number;
};
