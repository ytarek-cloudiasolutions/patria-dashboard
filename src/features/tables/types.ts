export type TableSection = "Main Hall" | "Terrace" | "VIP" | "Counter";

export type TableStatus = "Available" | "Unavailable";

export interface RestaurantTable {
  id: number;
  number: number;
  capacity: number;
  section: TableSection;
  status: TableStatus;
}

export type ReservationStatus =
  | "On Hold"
  | "Sitting"
  | "Confirmed"
  | "cancelled"
  | "Ended";

export interface Reservation {
  id: number;
  customer: string;
  phone: string;
  people: number;
  date: string;
  table: number;
  status: ReservationStatus;
}

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
