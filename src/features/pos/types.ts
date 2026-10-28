export type OrderType = "dine-in" | "takeaway";

export type PaymentMethod = "cash" | "card" | "instapay" | "mix";

/** Horizontal category tab shown above the product grid. */
export type PosCategory = {
  id: string;
  label: string;
  imageUrl: string;
  image?: string;
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
  variantGroups?: any[];
  recipe?: any[];
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
  excludedIngredients?: Array<{ productId: string; name: string }>;
  variants?: Array<{ name: string; option: string; price?: number }>;
  selectedVariants?: Record<string, string>;
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
  /** Sum of this employee's unpaid POS orders (EGP). */
  total: number;
  /** Same as `total` until orders are settled — the backend has no partial-order payment. */
  remaining: number;
  /** The unpaid orders behind `remaining`, oldest first — settled FIFO when a payment is registered. */
  pendingOrders: { id: string; total: number }[];
  payBook: EmployeeAccountEntry[];
};

/** A held / unpaid order waiting on a table. */
export type PendingOrder = {
  id: string;
  table: string;
  itemCount: number;
  time: string;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    qty: number;
    unitPrice: number;
    instructions?: string;
    extras?: CartExtra[];
    variants?: Array<{ name: string; option: string; price?: number }>;
  }>;
  guestCount?: number;
  customerCount?: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  discount?: number;
  discountAmount?: number;
  discountValue?: number;
  discountReason?: string;
  gross?: number;
  subtotal?: number;
  tax?: number;
};

/** Totals derived from the current cart. */
export type CartTotals = {
  subtotal: number;
  extras: number;
  tax: number;
  discount?: number;
  total: number;
  itemCount: number;
};

export type PosCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier?: string;
  loyaltyPoints?: number;
};

/**
 * Strips variant descriptors (e.g. "Size: S", "Size: Large") from item notes
 * so that variants are not erroneously treated as customer special instructions.
 */
export function extractCleanItemNotes(
  notes?: string,
  variants?: Array<{ name?: string; group?: string; option?: string }>,
): string {
  if (!notes || typeof notes !== "string") return "";
  const trimmed = notes.trim();
  if (!trimmed) return "";

  // Split by common delimiters (e.g. " - ", ",", or ";")
  const parts = trimmed.split(/\s*-\s*|,\s*|;\s*/);
  const nonVariantParts = parts.filter((part) => {
    const cleanPart = part.trim().toLowerCase();
    if (!cleanPart) return false;

    // Check against provided variants
    if (variants && variants.length > 0) {
      const isVariant = variants.some((v) => {
        const group = (v.group || v.name || "").trim().toLowerCase();
        const option = (v.option || "").trim().toLowerCase();
        if (!option) return false;
        return (
          cleanPart === `${group}: ${option}` ||
          cleanPart === `${group}:${option}` ||
          cleanPart === option
        );
      });
      if (isVariant) return false;
    }

    // Generic match for typical variant patterns (e.g. "Size: S", "Roast Level: Medium", etc.)
    if (/^(size|roast\s*level|grind\s*type|type):\s*[A-Za-z0-9_-]+$/i.test(cleanPart)) {
      return false;
    }

    return true;
  });

  return nonVariantParts.join(" - ").trim();
}

