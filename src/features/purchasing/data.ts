// data.ts
import type { ProcurementOverview, PurchaseOrder } from "./types";

export const PROCUREMENT_OVERVIEW: ProcurementOverview = {
  totalPurchases: "EGP 12,000",
  pendingRequests: 1,
  requestsReceived: 3,
  cancelled: 0,
};

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-202604-0001",
    type: "purchase order",
    supplier: "Bean's supplier",
    contactEmail: "smohamed@gmail.com",
    destination: "Main Warehouses",
    totalAmount: 1250,
    paid: 250,
    status: "Unpaid",
  },
  {
    id: "2",
    poNumber: "PO-202605-0002",
    type: "purchase order",
    supplier: "Coffee's supplier",
    contactEmail: "mnabil@gmail.com",
    destination: "Main Warehouses",
    totalAmount: 700,
    paid: 700,
    status: "Paid",
  },
];

export const SUPPLIER_OPTIONS = [
  { id: "1", name: "Bean's supplier" },
  { id: "2", name: "Coffee's supplier" },
  { id: "3", name: "Turkish supplier" },
];

export const WAREHOUSE_OPTIONS = [
  "Main Warehouses",
  "Secondary Warehouse",
  "Kitchen Storage",
];

export const PRODUCT_SKU_OPTIONS = [
  "SKU-001 - Arabica Beans",
  "SKU-002 - Turkish Coffee",
  "SKU-003 - Barista Blend",
  "SKU-004 - Espresso Roast",
];