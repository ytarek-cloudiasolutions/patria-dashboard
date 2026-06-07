import type { Driver, Zone } from "./types";

const makeOrders = (n: number, prefix: string, assignedTo?: string) =>
  Array.from({ length: n }, (_, idx) => ({
    id: `${prefix}-${idx + 1}`,
    reference: "#ORD-085205",
    customer: "Walk-in Customer",
    status: assignedTo ? ("Assigned" as const) : ("Pending" as const),
    assignedDriverName: assignedTo,
  }));

export const INITIAL_ZONES: Zone[] = [
  {
    id: "kafr-abdo",
    name: "Kafr Abdo",
    orders: makeOrders(7, "kafr-abdo"),
  },
  {
    id: "semouha",
    name: "Semouha",
    orders: [
      ...makeOrders(4, "semouha", "Omnia"),
    ],
  },
  {
    id: "fleeming",
    name: "Fleeming",
    orders: makeOrders(2, "fleeming", "Omnia"),
  },
  {
    id: "el-hadra",
    name: "El Hadra",
    orders: makeOrders(8, "el-hadra"),
  },
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "Omnia Maher",
    whatsappPhone: "+0123456789",
    vehicleType: "Car",
    zones: ["Kafr Abdo", "Semouha"],
    status: "Active",
  },
  {
    id: 2,
    name: "Kareem Nabil",
    whatsappPhone: "+0123456789",
    vehicleType: "Motorcycle",
    zones: ["El Hadra"],
    status: "Active",
  },
];

export const VEHICLE_TYPE_OPTIONS = [
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Car", label: "Car" },
  { value: "Van", label: "Van" },
];

export const DRIVER_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
