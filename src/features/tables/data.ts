import type {
  Reservation,
  ReservationStatus,
  RestaurantTable,
  TableSection,
} from "./types";

export const TABLE_SECTIONS: TableSection[] = [
  "Main Hall",
  "Terrace",
  "VIP",
  "Counter",
];

export const SECTION_OPTIONS: { value: TableSection; label: string }[] = [
  { value: "Main Hall", label: "Main Hall" },
  { value: "Terrace", label: "Terrace" },
  { value: "VIP", label: "VIP" },
  { value: "Counter", label: "Counter" },
];

export const RESERVATION_STATUS_OPTIONS: {
  value: ReservationStatus;
  label: string;
}[] = [
  { value: "On Hold", label: "On Hold" },
  { value: "Sitting", label: "Sitting" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "Ended", label: "Ended" },
];

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: 1, number: 1, capacity: 4, section: "Main Hall", status: "Available" },
  { id: 2, number: 3, capacity: 4, section: "Main Hall", status: "Unavailable" },
  { id: 3, number: 6, capacity: 4, section: "Main Hall", status: "Available" },
  { id: 4, number: 2, capacity: 4, section: "Main Hall", status: "Available" },
  { id: 5, number: 8, capacity: 4, section: "Main Hall", status: "Unavailable" },
  { id: 6, number: 7, capacity: 4, section: "Main Hall", status: "Available" },
  { id: 7, number: 6, capacity: 4, section: "Main Hall", status: "Unavailable" },
  { id: 8, number: 1, capacity: 2, section: "Terrace", status: "Available" },
  { id: 9, number: 2, capacity: 2, section: "Terrace", status: "Available" },
  { id: 10, number: 1, capacity: 6, section: "VIP", status: "Available" },
  { id: 11, number: 1, capacity: 1, section: "Counter", status: "Available" },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    customer: "Layla Ibrahim",
    phone: "+20 122 555 7890",
    people: 4,
    date: "Mar 15, 2026",
    table: 1,
    status: "On Hold",
  },
  {
    id: 2,
    customer: "Ahmed El-Sayed",
    phone: "+20 122 555 7890",
    people: 12,
    date: "Mar 15, 2026",
    table: 9,
    status: "Sitting",
  },
  {
    id: 3,
    customer: "Omar Khaled",
    phone: "+20 122 555 7890",
    people: 3,
    date: "Mar 15, 2026",
    table: 4,
    status: "cancelled",
  },
  {
    id: 4,
    customer: "Youssef Nabil",
    phone: "+20 122 555 7890",
    people: 2,
    date: "Mar 15, 2026",
    table: 3,
    status: "Confirmed",
  },
  {
    id: 5,
    customer: "Youssef Nabil",
    phone: "+20 122 555 7890",
    people: 4,
    date: "Mar 15, 2026",
    table: 2,
    status: "Ended",
  },
];
