import { api } from "@/config/api";
import { TABLE_ENDPOINTS } from "../constants/tableConstants";
import type {
  CreateTableRequest,
  CreateTableResponse,
  DeleteTableResponse,
  GetTablesResponse,
  UpdateTableStatusRequest,
  UpdateTableStatusResponse,
  GetReservationsResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  UpdateReservationStatusRequest,
  UpdateReservationStatusResponse,
  DeleteReservationResponse,
} from "../store/tableTypes";

export const getTables = async () => {
  const response = await api.get<GetTablesResponse>(TABLE_ENDPOINTS.TABLES);
  return response.data;
};

export const createTable = async (payload: CreateTableRequest) => {
  const response = await api.post<CreateTableResponse>(
    TABLE_ENDPOINTS.TABLES,
    payload,
  );
  return response.data;
};

export const updateTableStatus = async ({
  tableId,
  status,
}: UpdateTableStatusRequest) => {
  const response = await api.put<UpdateTableStatusResponse>(
    TABLE_ENDPOINTS.TABLE_BY_ID(tableId),
    { status },
  );
  return response.data;
};

export const deleteTable = async (tableId: string) => {
  const response = await api.delete<DeleteTableResponse>(
    TABLE_ENDPOINTS.TABLE_BY_ID(tableId),
  );
  return response.data;
};

export const getReservations = async (date: string) => {
  const response = await api.get<GetReservationsResponse>(
    TABLE_ENDPOINTS.RESERVATIONS,
    { params: { date } },
  );
  return response.data;
};

export const createReservation = async (payload: CreateReservationRequest) => {
  const response = await api.post<CreateReservationResponse>(
    TABLE_ENDPOINTS.RESERVATIONS,
    payload,
  );
  return response.data;
};

export const updateReservationStatus = async ({
  reservationId,
  status,
}: UpdateReservationStatusRequest) => {
  const response = await api.put<UpdateReservationStatusResponse>(
    TABLE_ENDPOINTS.RESERVATION_BY_ID(reservationId),
    { status },
  );
  return response.data;
};

export const deleteReservation = async (reservationId: string) => {
  const response = await api.delete<DeleteReservationResponse>(
    TABLE_ENDPOINTS.RESERVATION_BY_ID(reservationId),
  );
  return response.data;
};

export const tablesApi = {
  getTables,
  createTable,
  updateTableStatus,
  deleteTable,
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
};
