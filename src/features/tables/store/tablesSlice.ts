import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateTableRequest,
  DeleteTableRequest,
  Pagination,
  Table,
  TablesErrorState,
  TablesLoadingState,
  TablesOperation,
  TablesState,
  UpdateTableStatusRequest,
  Reservation,
  CreateReservationRequest,
  UpdateReservationStatusRequest,
  DeleteReservationRequest,
  ReservationStatus,
} from "./tableTypes";


const initialLoading: TablesLoadingState = {
  fetch: false,
  create: false,
  updateStatus: false,
  delete: false,
  fetchReservations: false,
  createReservation: false,
  updateReservationStatus: false,
  deleteReservation: false,
};

const initialErrors: TablesErrorState = {
  fetch: null,
  create: null,
  updateStatus: null,
  delete: null,
  fetchReservations: null,
  createReservation: null,
  updateReservationStatus: null,
  deleteReservation: null,
};

const setOperationLoading = (
  state: TablesState,
  operation: TablesOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: TablesState,
  operation: TablesOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const initialState: TablesState = {
  tables: [],
  pagination: null,
  togglingTableId: null,
  reservations: [],
  reservationsPagination: null,
  togglingReservationId: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    getTablesRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getTablesSuccess: (
      state,
      action: PayloadAction<{
        tables: Table[];
        pagination: Pagination;
        message: string;
      }>,
    ) => {
      state.loading.fetch = false;
      state.tables = action.payload.tables || [];
      state.pagination = action.payload.pagination || null;
      state.successMessage = action.payload.message;
    },
    getTablesFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createTableRequest: (
      state,
      _action: PayloadAction<CreateTableRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createTableSuccess: (
      state,
      action: PayloadAction<{ table: Table; message: string }>,
    ) => {
      state.loading.create = false;
      state.tables = [action.payload.table, ...state.tables];
      state.successMessage = action.payload.message;
    },
    createTableFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateTableStatusRequest: (
      state,
      action: PayloadAction<UpdateTableStatusRequest>,
    ) => {
      // Optimistic update: immediately toggle the status in the UI
      state.loading.updateStatus = true;
      state.errors.updateStatus = null;
      state.successMessage = null;
      state.togglingTableId = action.payload.tableId;
      const table = state.tables.find(
        (t) => t._id === action.payload.tableId,
      );
      if (table) {
        table.status = action.payload.status;
      }
    },
    updateTableStatusSuccess: (
      state,
      action: PayloadAction<{ table: Table; message: string }>,
    ) => {
      state.loading.updateStatus = false;
      state.togglingTableId = null;
      state.tables = state.tables.map((table) =>
        table._id === action.payload.table._id
          ? action.payload.table
          : table,
      );
      state.successMessage = action.payload.message;
    },
    updateTableStatusFailure: (
      state,
      action: PayloadAction<{
        error: string;
        tableId: string;
        previousStatus: TableStatus;
      }>,
    ) => {
      state.loading.updateStatus = false;
      state.togglingTableId = null;
      state.errors.updateStatus = action.payload.error;
      // Rollback the optimistic update
      const table = state.tables.find(
        (t) => t._id === action.payload.tableId,
      );
      if (table) {
        table.status = action.payload.previousStatus;
      }
    },

    deleteTableRequest: (
      state,
      _action: PayloadAction<DeleteTableRequest>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteTableSuccess: (
      state,
      action: PayloadAction<{ tableId: string; message: string }>,
    ) => {
      state.loading.delete = false;
      state.tables = state.tables.filter(
        (table) => table._id !== action.payload.tableId,
      );
      state.successMessage = action.payload.message;
    },
    deleteTableFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    getReservationsRequest: (state, _action: PayloadAction<{ date: string }>) => {
      setOperationLoading(state, "fetchReservations");
    },
    getReservationsSuccess: (
      state,
      action: PayloadAction<{
        reservations: Reservation[];
        pagination: Pagination;
        message: string;
      }>,
    ) => {
      state.loading.fetchReservations = false;
      state.reservations = action.payload.reservations || [];
      state.reservationsPagination = action.payload.pagination || null;
      state.successMessage = action.payload.message;
    },
    getReservationsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchReservations", action.payload);
    },

    createReservationRequest: (
      state,
      _action: PayloadAction<CreateReservationRequest>,
    ) => {
      setOperationLoading(state, "createReservation");
    },
    createReservationSuccess: (
      state,
      action: PayloadAction<{ reservation: Reservation; message: string }>,
    ) => {
      state.loading.createReservation = false;
      state.reservations = [action.payload.reservation, ...state.reservations];
      state.successMessage = action.payload.message;
    },
    createReservationFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "createReservation", action.payload);
    },

    updateReservationStatusRequest: (
      state,
      action: PayloadAction<UpdateReservationStatusRequest>,
    ) => {
      state.loading.updateReservationStatus = true;
      state.errors.updateReservationStatus = null;
      state.successMessage = null;
      state.togglingReservationId = action.payload.reservationId;
      const reservation = state.reservations.find(
        (r) => r._id === action.payload.reservationId,
      );
      if (reservation) {
        reservation.status = action.payload.status;
      }
    },
    updateReservationStatusSuccess: (
      state,
      action: PayloadAction<{ reservation: Reservation; message: string }>,
    ) => {
      state.loading.updateReservationStatus = false;
      state.togglingReservationId = null;
      state.reservations = state.reservations.map((r) =>
        r._id === action.payload.reservation._id
          ? action.payload.reservation
          : r,
      );
      state.successMessage = action.payload.message;
    },
    updateReservationStatusFailure: (
      state,
      action: PayloadAction<{
        error: string;
        reservationId: string;
        previousStatus: ReservationStatus;
      }>,
    ) => {
      state.loading.updateReservationStatus = false;
      state.togglingReservationId = null;
      state.errors.updateReservationStatus = action.payload.error;
      const reservation = state.reservations.find(
        (r) => r._id === action.payload.reservationId,
      );
      if (reservation) {
        reservation.status = action.payload.previousStatus;
      }
    },

    deleteReservationRequest: (
      state,
      action: PayloadAction<DeleteReservationRequest>,
    ) => {
      state.loading.deleteReservation = true;
      state.errors.deleteReservation = null;
      state.successMessage = null;
      state.togglingReservationId = action.payload.reservationId;
    },
    deleteReservationSuccess: (
      state,
      action: PayloadAction<{ reservationId: string; message: string }>,
    ) => {
      state.loading.deleteReservation = false;
      state.togglingReservationId = null;
      state.reservations = state.reservations.filter(
        (r) => r._id !== action.payload.reservationId,
      );
      state.successMessage = action.payload.message;
    },
    deleteReservationFailure: (state, action: PayloadAction<string>) => {
      state.loading.deleteReservation = false;
      state.togglingReservationId = null;
      state.errors.deleteReservation = action.payload;
    },

    clearTablesError: (
      state,
      action: PayloadAction<TablesOperation | undefined>,
    ) => {
      if (action.payload) {
        state.errors[action.payload] = null;
        return;
      }

      state.errors = { ...initialErrors };
    },
    clearTablesMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

// Import the type here to avoid circular dependency at the top level
type TableStatus = import("./tableTypes").TableStatus;

export const tablesActions = tablesSlice.actions;
export default tablesSlice.reducer;
