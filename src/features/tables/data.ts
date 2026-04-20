import type {
  DiningTable,
  Reservation,
  ReservationStatus,
  TableSection,
} from "./types";

export const TABLE_SECTIONS: TableSection[] = [
  "Main Hall",
  "Terrace",
  "VIP",
  "Counter",
];

export const RESERVATION_STATUS_OPTIONS: ReservationStatus[] = [
  "On Hold",
  "Sitting",
  "cancelled",
  "Confirmed",
  "Ended",
];

export const INITIAL_TABLES: DiningTable[] = [
  {
    id: "1",
    tableNumber: 1,
    section: "Main Hall",
    capacity: 4,
    status: "Available",
  },
  {
    id: "2",
    tableNumber: 3,
    section: "Terrace",
    capacity: 4,
    status: "Unavailable",
  },
  {
    id: "3",
    tableNumber: 6,
    section: "VIP",
    capacity: 4,
    status: "Available",
  },
  {
    id: "4",
    tableNumber: 2,
    section: "Counter",
    capacity: 4,
    status: "Available",
  },
  {
    id: "5",
    tableNumber: 8,
    section: "Main Hall",
    capacity: 4,
    status: "Unavailable",
  },
  {
    id: "6",
    tableNumber: 7,
    section: "Main Hall",
    capacity: 4,
    status: "Available",
  },
  {
    id: "7",
    tableNumber: 6,
    section: "Terrace",
    capacity: 4,
    status: "Unavailable",
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "1",
    customerName: "Layla Ibrahim",
    phone: "+20 122 555 7890",
    people: 4,
    reservationDate: "2026-03-15",
    displayDate: "Mar 15, 2026",
    tableNumber: 1,
    status: "On Hold",
  },
  {
    id: "2",
    customerName: "Ahmed El-Sayed",
    phone: "+20 122 555 7890",
    people: 12,
    reservationDate: "2026-03-15",
    displayDate: "Mar 15, 2026",
    tableNumber: 7,
    status: "Sitting",
  },
  {
    id: "3",
    customerName: "Omar Khaled",
    phone: "+20 122 555 7890",
    people: 3,
    reservationDate: "2026-03-15",
    displayDate: "Mar 15, 2026",
    tableNumber: 4,
    status: "cancelled",
  },
  {
    id: "4",
    customerName: "Youssef Nabil",
    phone: "+20 122 555 7890",
    people: 2,
    reservationDate: "2026-03-15",
    displayDate: "Mar 15, 2026",
    tableNumber: 3,
    status: "Confirmed",
  },
  {
    id: "5",
    customerName: "Youssef Nabil",
    phone: "+20 122 555 7890",
    people: 4,
    reservationDate: "2026-03-15",
    displayDate: "Mar 15, 2026",
    tableNumber: 2,
    status: "Ended",
  },
];
