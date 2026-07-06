import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createTable,
  deleteTable,
  getTables,
  updateTableStatus,
  getReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
} from "../api/tablesApi";
import { getTableErrorMessage } from "../utils/tableHelpers";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { tablesActions } from "./tablesSlice";
import type {
  CreateTableRequest,
  CreateTableResponse,
  DeleteTableRequest,
  DeleteTableResponse,
  GetTablesResponse,
  UpdateTableStatusRequest,
  UpdateTableStatusResponse,
  GetReservationsResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  UpdateReservationStatusRequest,
  UpdateReservationStatusResponse,
  DeleteReservationRequest,
  DeleteReservationResponse,
} from "./tableTypes";

function* handleGetTables() {
  try {
    const response: GetTablesResponse = yield call(getTables);
    const body = (response as any).data || response;
    const tablesList = body.data || body.tables || body || [];
    const pagination = body.pagination || null;

    yield put(
      tablesActions.getTablesSuccess({
        tables: tablesList,
        pagination,
        message: response.message || "Success",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.getTablesFailure(errorMessage));
  }
}

function* handleCreateTable(action: PayloadAction<CreateTableRequest>) {
  try {
    const response: CreateTableResponse = yield call(
      createTable,
      action.payload,
    );
    const body = (response as any).data || response;
    const table = body.table || body;

    yield call(showSuccessToast, response.message || "Table created successfully");
    yield put(
      tablesActions.createTableSuccess({
        table,
        message: response.message || "Table created successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.createTableFailure(errorMessage));
  }
}

function* handleUpdateTableStatus(
  action: PayloadAction<UpdateTableStatusRequest>,
) {
  // Store the previous status for rollback on failure
  const previousStatus =
    action.payload.status === "available" ? "occupied" : "available";

  try {
    const response: UpdateTableStatusResponse = yield call(
      updateTableStatus,
      action.payload,
    );
    const body = (response as any).data || response;
    const table = body.table || body;

    yield call(showSuccessToast, response.message || "Status updated successfully");
    yield put(
      tablesActions.updateTableStatusSuccess({
        table,
        message: response.message || "Status updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(
      tablesActions.updateTableStatusFailure({
        error: errorMessage,
        tableId: action.payload.tableId,
        previousStatus,
      }),
    );
  }
}

function* handleDeleteTable(action: PayloadAction<DeleteTableRequest>) {
  try {
    const response: DeleteTableResponse = yield call(
      deleteTable,
      action.payload.tableId,
    );

    yield call(showSuccessToast, response.message || "Table deleted successfully");
    yield put(
      tablesActions.deleteTableSuccess({
        tableId: action.payload.tableId,
        message: response.message || "Table deleted successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.deleteTableFailure(errorMessage));
  }
}

function* handleGetReservations(action: PayloadAction<{ date: string }>) {
  try {
    const response: GetReservationsResponse = yield call(
      getReservations,
      action.payload.date,
    );
    const body = (response as any).data || response;
    const reservationsList = body.data || body.reservations || body || [];
    const pagination = body.pagination || null;

    yield put(
      tablesActions.getReservationsSuccess({
        reservations: reservationsList,
        pagination,
        message: response.message || "Success",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.getReservationsFailure(errorMessage));
  }
}

function* handleCreateReservation(
  action: PayloadAction<CreateReservationRequest>,
) {
  try {
    const response: CreateReservationResponse = yield call(
      createReservation,
      action.payload,
    );
    const body = (response as any).data || response;
    const reservation = body.reservation || body;

    yield call(showSuccessToast, response.message || "Reservation created successfully");
    yield put(
      tablesActions.createReservationSuccess({
        reservation,
        message: response.message || "Reservation created successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.createReservationFailure(errorMessage));
  }
}

function* handleUpdateReservationStatus(
  action: PayloadAction<UpdateReservationStatusRequest>,
) {
  const { reservationId, status, previousStatus } = action.payload;

  try {
    const response: UpdateReservationStatusResponse = yield call(
      updateReservationStatus,
      { reservationId, status },
    );
    const body = (response as any).data || response;
    const reservation = body.reservation || body;

    yield call(showSuccessToast, response.message || "Status updated successfully");
    yield put(
      tablesActions.updateReservationStatusSuccess({
        reservation,
        message: response.message || "Status updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(
      tablesActions.updateReservationStatusFailure({
        error: errorMessage,
        reservationId,
        previousStatus: previousStatus!,
      }),
    );
  }
}

function* handleDeleteReservation(
  action: PayloadAction<DeleteReservationRequest>,
) {
  const { reservationId } = action.payload;
  try {
    const response: DeleteReservationResponse = yield call(
      deleteReservation,
      reservationId,
    );

    yield call(showSuccessToast, response.message || "Reservation deleted successfully");
    yield put(
      tablesActions.deleteReservationSuccess({
        reservationId,
        message: response.message || "Reservation deleted successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getTableErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(tablesActions.deleteReservationFailure(errorMessage));
  }
}

export default function* tablesSaga() {
  yield all([
    takeLatest(tablesActions.getTablesRequest.type, handleGetTables),
    takeLatest(tablesActions.createTableRequest.type, handleCreateTable),
    takeLatest(
      tablesActions.updateTableStatusRequest.type,
      handleUpdateTableStatus,
    ),
    takeLatest(tablesActions.deleteTableRequest.type, handleDeleteTable),
    takeLatest(tablesActions.getReservationsRequest.type, handleGetReservations),
    takeLatest(
      tablesActions.createReservationRequest.type,
      handleCreateReservation,
    ),
    takeLatest(
      tablesActions.updateReservationStatusRequest.type,
      handleUpdateReservationStatus,
    ),
    takeLatest(
      tablesActions.deleteReservationRequest.type,
      handleDeleteReservation,
    ),
  ]);
}
