import type { WarehouseType, Warehouse, Transfer } from "./types";

export const WAREHOUSE_TYPES: WarehouseType[] = [
  "Main Warehouse",
  "Sub Warehouse",
];

export const PRODUCT_SKU_OPTIONS = [
  { label: "SKU-001 - Arabica Beans", value: "SKU-001" },
  { label: "SKU-002 - Turkish Coffee", value: "SKU-002" },
  { label: "SKU-003 - Barista Blend", value: "SKU-003" },
  { label: "SKU-004 - Espresso Roast", value: "SKU-004" },
  { label: "SKU-005 - Pastry Mix", value: "SKU-005" },
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    name: "Main Kitchen",
    address: "123 Roastery St, Alex",
    type: "Main Warehouse",
  },
  {
    id: "wh-2",
    name: "Main Kitchen",
    address: "123 Roastery St, Alex",
    type: "Main Warehouse",
  },
  {
    id: "wh-3",
    name: "Barista Kitchen",
    address: "123 Roastery St, Alex",
    type: "Sub Warehouse",
  },
  {
    id: "wh-4",
    name: "Pastry Kitchen",
    address: "123 Roastery St, Alex",
    type: "Sub Warehouse",
  },
];

export const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: "#TRF-445581",
    from: "Main Kitchen",
    to: "Bakery Kitchen",
    items: 2,
    date: "4/14/2026",
    status: "Pending",
  },
  {
    id: "#TRF-552890",
    from: "Main Kitchen",
    to: "Pastry Kitchen",
    items: 2,
    date: "4/14/2026",
    status: "Approved",
  },
];
