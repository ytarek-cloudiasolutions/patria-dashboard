export type TableSection = "Main Hall" | "Terrace" | "VIP" | "Counter";

export type TableAvailability = "Available" | "Unavailable";

export type ReservationStatus =
  | "On Hold"
  | "Sitting"
  | "cancelled"
  | "Confirmed"
  | "Ended";

export interface DiningTable {
  id: string;
  tableNumber: number;
  section: TableSection;
  capacity: number;
  status: TableAvailability;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  people: number;
  reservationDate: string;
  displayDate: string;
  tableNumber: number;
  status: ReservationStatus;
}

export interface AddTableFormData {
  tableNumber: string;
  capacity: string;
  section: TableSection;
}

export interface AddReservationFormData {
  customerName: string;
  phone: string;
  people: string;
  date: string;
  time: string;
  tableId: string;
}

export interface SectionTabsProps {
  activeSection: TableSection;
  onSectionChange: (section: TableSection) => void;
}
