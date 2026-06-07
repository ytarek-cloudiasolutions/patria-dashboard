import type { InternalTransfer, Warehouse } from "./types";

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    shortId: "1O9DEE6",
    name: "Main Kitchen",
    address: "123 Roastery St, Alex",
    kind: "Main Warehouse",
  },
  {
    id: "wh-2",
    shortId: "1O9DEE6",
    name: "Main Kitchen",
    address: "123 Roastery St, Alex",
    kind: "Main Warehouse",
  },
  {
    id: "wh-3",
    shortId: "1O9DEE6",
    name: "Barista Kitchen",
    address: "123 Roastery St, Alex",
    kind: "Sub Warehouse",
  },
  {
    id: "wh-4",
    shortId: "1O9DEE6",
    name: "Pastry Kitchen",
    address: "123 Roastery St, Alex",
    kind: "Sub Warehouse",
  },
];

export const INITIAL_TRANSFERS: InternalTransfer[] = [
  {
    id: 1,
    reference: "#TRF-44581",
    fromId: "wh-1",
    fromName: "Main Kitchen",
    toId: "bakery",
    toName: "Bakery Kitchen",
    items: [
      { id: "ti-1", productId: "arabica", quantity: 1 },
      { id: "ti-2", productId: "sugar", quantity: 1 },
    ],
    createdAt: "4/14/2026",
    status: "Pending",
  },
  {
    id: 2,
    reference: "#TRF-552890",
    fromId: "wh-1",
    fromName: "Main Kitchen",
    toId: "wh-4",
    toName: "Pastry Kitchen",
    items: [
      { id: "ti-3", productId: "milk", quantity: 1 },
      { id: "ti-4", productId: "sugar", quantity: 1 },
    ],
    createdAt: "4/14/2026",
    status: "Approved",
  },
];

export const TRANSFER_PRODUCT_OPTIONS = [
  { id: "arabica", label: "Arabica beans" },
  { id: "robusta", label: "Robusta beans" },
  { id: "milk", label: "Whole milk 1L" },
  { id: "sugar", label: "Sugar 1kg" },
  { id: "flour", label: "Flour 1kg" },
];

export const WAREHOUSE_TYPE_OPTIONS = [
  { value: "Main Warehouse", label: "Main Warehouse" },
  { value: "Sub Warehouse", label: "Sub Warehouse" },
];
