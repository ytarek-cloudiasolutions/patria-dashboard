import type { TableSection, ReservationStatus, Reservation } from "./store/tableTypes";

export type { ReservationStatus, Reservation };

export interface AddTableFormData {
  number: string;
  capacity: string;
  section: TableSection;
}

export interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  people: string;
  date: string;
  time: string;
  table: string;
}

export const SECTION_DISPLAY_NAMES: Record<TableSection, string> = {
  main_hall: "Main Hall",
  terrace: "Terrace",
  vip: "VIP",
  counter: "Counter",
};
