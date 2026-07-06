import type { RootState } from "@/app/store";
import type { TablesOperation } from "./tableTypes";

export const selectTablesState = (state: RootState) => state.tables;

export const selectTables = (state: RootState) => state.tables.tables;

export const selectTablesPagination = (state: RootState) =>
  state.tables.pagination;

export const selectTablesLoading = (state: RootState) => state.tables.loading;

export const selectTablesErrors = (state: RootState) => state.tables.errors;

export const selectTablesSuccessMessage = (state: RootState) =>
  state.tables.successMessage;

export const selectIsTablesOperationLoading =
  (operation: TablesOperation) => (state: RootState) =>
    state.tables.loading[operation];

export const selectTablesOperationError =
  (operation: TablesOperation) => (state: RootState) =>
    state.tables.errors[operation];

export const selectReservations = (state: RootState) => state.tables.reservations;

export const selectReservationsPagination = (state: RootState) =>
  state.tables.reservationsPagination;

export const selectTogglingReservationId = (state: RootState) =>
  state.tables.togglingReservationId;
