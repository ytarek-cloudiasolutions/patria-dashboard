import type { Driver, DriverStatus, VehicleType, Zone } from "./types";


export const VEHICLE_TYPES: VehicleType[] = ["Motorcycle", "Car", "Van"];

export const STATUS_OPTIONS: DriverStatus[] = ["Active", "Inactive"];

export const VISIBLE_ORDERS_COUNT = 4;

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "Omnia Maher",
    phone: "+0123456789",
    vehicle: "Car",
    zones: ["Kafr Abdo", "Semouha"],
    status: "Active",
  },
  {
    id: 2,
    name: "Kareem Nabil",
    phone: "+0123456789",
    vehicle: "Motorcycle",
    zones: ["El Hadra"],
    status: "Active",
  },
];

export const ZONES_DATA: Zone[] = [
  {
    id: 1,
    name: "Kafr Abdo",
    totalOrders: 7,
    orders: [
      { id: "#ORD-085205", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085206", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085207", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085208", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085209", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085210", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085211", customer: "Walk-in Customer", status: "pending" },
    ],
  },
  {
    id: 2,
    name: "Semouha",
    totalOrders: 4,
    orders: [
      { id: "#ORD-085205", customer: "Walk-in Customer", status: "omnia" },
      { id: "#ORD-085206", customer: "Walk-in Customer", status: "omnia" },
      { id: "#ORD-085207", customer: "Walk-in Customer", status: "omnia" },
      { id: "#ORD-085208", customer: "Walk-in Customer", status: "omnia" },
    ],
  },
  {
    id: 3,
    name: "Fleeming",
    totalOrders: 2,
    orders: [
      { id: "#ORD-085205", customer: "Walk-in Customer", status: "omnia" },
      { id: "#ORD-085206", customer: "Walk-in Customer", status: "omnia" },
    ],
  },
  {
    id: 4,
    name: "El Hadra",
    totalOrders: 8,
    orders: [
      { id: "#ORD-085205", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085206", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085207", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085208", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085209", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085210", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085211", customer: "Walk-in Customer", status: "pending" },
      { id: "#ORD-085212", customer: "Walk-in Customer", status: "pending" },
    ],
  },
];