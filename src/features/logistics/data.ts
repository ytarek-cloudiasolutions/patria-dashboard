import type { Driver, Zone, ZoneOrder, ZoneOrderStatus } from "./types";

const ADDRESS = "Maple Heights, Hilpert Stravenue, Kafr Abdo, Alexandria";

let orderSeq = 85204;
const makeOrder = (
  customer: string,
  amount: number,
  status: ZoneOrderStatus,
  assignedDriverName?: string,
): ZoneOrder => {
  const ref = `#ORD-0${++orderSeq}`;
  return {
    id: ref + "-" + Math.random().toString(36).slice(2, 7),
    reference: ref,
    customer,
    address: ADDRESS,
    amount,
    status,
    assignedDriverName,
  };
};

export const INITIAL_ZONES: Zone[] = [
  {
    id: "kafr-abdo",
    name: "Kafr Abdo",
    orders: [
      makeOrder("Leila Hassan", 1100, "Waiting"),
      makeOrder("Leila Hassan", 1100, "Waiting"),
      makeOrder("Samir El-Masry", 950, "Processing"),
      makeOrder("Farid Nabil", 1500, "Cancelled"),
    ],
  },
  {
    id: "mohaaram-bek",
    name: "Mohaaram Bek",
    orders: [makeOrder("Leila Hassan", 1100, "Processing", "Kareem")],
  },
  {
    id: "fleeming",
    name: "Fleeming",
    orders: [makeOrder("Leila Hassan", 1100, "Waiting")],
  },
  {
    id: "gleem",
    name: "Gleem",
    orders: [makeOrder("Leila Hassan", 1100, "Processing", "Kareem")],
  },
];

const makeDriver = (
  id: number,
  name: string,
  phone: string,
  vehicleType: Driver["vehicleType"],
  plate: string,
  zones: string[],
  status: Driver["status"],
  ordersToday: number,
  hourlyRate: number,
  dutyTime: string,
): Driver => ({
  id,
  name,
  whatsappPhone: phone,
  vehicleType,
  plateNumber: plate,
  zones,
  status,
  ordersToday,
  hourlyRate,
  salaryNow: Number((hourlyRate * (ordersToday / 3 + 4)).toFixed(2)),
  dutyTime,
});

export const INITIAL_DRIVERS: Driver[] = [
  makeDriver(1, "Omnia Maher", "01288716592", "Car", "ABCD 1234", ["Kafr Abdo", "Semouha"], "Active", 21, 21, "08:12:22"),
  makeDriver(2, "Alex Lentz", "01288716593", "Motorcycle", "XYZ 5678", ["El Hadra"], "On-Route", 18, 21, "09:05:30"),
  makeDriver(3, "Rita Nasaar", "01288716594", "Car", "LMN 2345", ["Gleem"], "Active", 10, 21, "10:00:00"),
  makeDriver(4, "Rita Hassan", "01288716595", "Van", "QRS 6789", ["Roushdy"], "Active", 14, 21, "10:00:00"),
  makeDriver(5, "Mark Klina", "01288716596", "Motorcycle", "TUV 3456", ["Sporting"], "Off-Duty", 7, 21, "11:30:00"),
  makeDriver(6, "Julia Smith", "01288716597", "Car", "WXY 7890", ["Sidi Gaber"], "Active", 12, 21, "09:15:00"),
];

export const VEHICLE_TYPE_OPTIONS = [
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Car", label: "Car" },
  { value: "Van", label: "Van" },
];

export const DRIVER_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "On-Route", label: "On-Route" },
  { value: "Off-Duty", label: "Off-Duty" },
];

/** Delivery zones a driver can be assigned to (multi-select). */
export const ZONE_OPTIONS = [
  "Kafr Abdo",
  "Semouha",
  "Fleeming",
  "Gleem",
  "Roushdy",
  "Sporting",
  "Sidi Gaber",
];
