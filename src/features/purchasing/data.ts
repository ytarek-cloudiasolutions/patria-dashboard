import type {
  ProductOption,
  PurchaseOrder,
  SupplierOption,
  WarehouseOption,
} from "./types";

export const SUPPLIER_OPTIONS: SupplierOption[] = [
  { id: "bean", label: "Bean's supplier", email: "smohamed@gmail.com" },
  { id: "coffee", label: "Coffee's supplier", email: "mnabil@gmail.com" },
  { id: "dairy", label: "Dairy depot", email: "orders@dairydepot.com" },
];

export const WAREHOUSE_OPTIONS: WarehouseOption[] = [
  { id: "main", label: "Main Warehouses" },
  { id: "north", label: "North Branch" },
  { id: "south", label: "South Branch" },
];

export const PRODUCT_OPTIONS: ProductOption[] = [
  { id: "arabica", label: "Arabica beans", defaultCost: 95 },
  { id: "robusta", label: "Robusta beans", defaultCost: 70 },
  { id: "milk", label: "Whole milk 1L", defaultCost: 25 },
  { id: "sugar", label: "Sugar 1kg", defaultCost: 18 },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: "PO-202604-0001",
    kind: "purchase order",
    supplierId: "bean",
    supplierName: "Bean's supplier",
    contactEmail: "smohamed@gmail.com",
    warehouseId: "main",
    warehouseName: "Main Warehouses",
    totalAmount: 1250,
    paid: 250,
    status: "Unpaid",
    expectedDeliveryDate: "2026-04-15",
    items: [
      { id: "li-1", productId: "arabica", quantity: 10, unitCost: 95 },
      { id: "li-2", productId: "sugar", quantity: 20, unitCost: 18 },
    ],
  },
  {
    id: 2,
    poNumber: "PO-202605-0002",
    kind: "purchase order",
    supplierId: "coffee",
    supplierName: "Coffee's supplier",
    contactEmail: "mnabil@gmail.com",
    warehouseId: "main",
    warehouseName: "Main Warehouses",
    totalAmount: 700,
    paid: 700,
    status: "Paid",
    expectedDeliveryDate: "2026-04-20",
    items: [{ id: "li-3", productId: "robusta", quantity: 10, unitCost: 70 }],
  },
];

export const PURCHASING_STATUS_FILTERS = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: "Paid" },
  { label: "Unpaid", value: "Unpaid" },
  { label: "Pending", value: "Pending" },
  { label: "Canceled", value: "Canceled" },
];
