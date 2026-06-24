export interface ApiResponse<TData> {
  statusCode: number;
  data: TData;
  message: string;
  success: boolean;
}

export type TableSection = "main_hall" | "terrace" | "vip" | "counter";

export type TableStatus = "available" | "occupied";

export interface Table {
  _id: string;
  number: number;
  capacity: number;
  section: TableSection;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetTablesData {
  data: Table[];
  pagination: Pagination;
}

export interface TableData {
  table: Table;
}

export interface CreateTableRequest {
  number: number;
  capacity: number;
  section: string;
}

export interface UpdateTableStatusRequest {
  tableId: string;
  status: TableStatus;
}

export interface DeleteTableRequest {
  tableId: string;
}

export type ReservationStatus =
  | "on_hold"
  | "confirmed"
  | "sitting"
  | "ended"
  | "cancelled";

export interface Reservation {
  _id: string;
  customerName: string;
  phone: string;
  customerEmail?: string;
  numberOfPeople: number;
  date: string;
  time: string;
  tableId: Table;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetReservationsData {
  data: Reservation[];
  pagination: Pagination;
}

export interface ReservationData {
  reservation: Reservation;
}

export interface CreateReservationRequest {
  customerName: string;
  phone: string;
  customerEmail?: string;
  date: string;
  time: string;
  numberOfPeople: number;
  tableId: string;
}

export interface UpdateReservationStatusRequest {
  reservationId: string;
  status: ReservationStatus;
  previousStatus?: ReservationStatus;
}

export interface DeleteReservationRequest {
  reservationId: string;
}

export type GetTablesResponse = ApiResponse<GetTablesData>;
export type CreateTableResponse = ApiResponse<TableData>;
export type UpdateTableStatusResponse = ApiResponse<TableData>;
export type DeleteTableResponse = ApiResponse<null>;

export type GetReservationsResponse = ApiResponse<GetReservationsData>;
export type CreateReservationResponse = ApiResponse<ReservationData>;
export type UpdateReservationStatusResponse = ApiResponse<ReservationData>;
export type DeleteReservationResponse = ApiResponse<null>;

export type TablesOperation =
  | "fetch"
  | "create"
  | "updateStatus"
  | "delete"
  | "fetchReservations"
  | "createReservation"
  | "updateReservationStatus"
  | "deleteReservation";

export type TablesLoadingState = Record<TablesOperation, boolean>;
export type TablesErrorState = Record<TablesOperation, string | null>;

export interface TablesState {
  tables: Table[];
  pagination: Pagination | null;
  togglingTableId: string | null;
  reservations: Reservation[];
  reservationsPagination: Pagination | null;
  togglingReservationId: string | null;
  loading: TablesLoadingState;
  errors: TablesErrorState;
  successMessage: string | null;
}
