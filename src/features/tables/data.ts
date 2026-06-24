import type { TableSection } from "./store/tableTypes";
import type { Reservation, ReservationStatus } from "./types";

export const TABLE_SECTIONS: TableSection[] = [
  "main_hall",
  "terrace",
  "vip",
  "counter",
];

export const SECTION_OPTIONS: { value: TableSection; label: string }[] = [
  { value: "main_hall", label: "Main Hall" },
  { value: "terrace", label: "Terrace" },
  { value: "vip", label: "VIP" },
  { value: "counter", label: "Counter" },
];

export const RESERVATION_STATUS_OPTIONS: {
  value: ReservationStatus;
  label: string;
}[] = [
    { value: "on_hold", label: "On Hold" },
    { value: "sitting", label: "Sitting" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "ended", label: "Ended" },
  ];

export const INITIAL_RESERVATIONS: Reservation[] = [];
