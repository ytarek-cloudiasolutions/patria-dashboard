import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectTables,
  selectTablesErrors,
  selectTablesLoading,
  selectTablesPagination,
  selectTablesState,
  selectTablesSuccessMessage,
  selectReservations,
  selectReservationsPagination,
  selectTogglingReservationId,
} from "../store/tablesSelectors";
import { tablesActions } from "../store/tablesSlice";
import type {
  CreateTableRequest,
  DeleteTableRequest,
  TablesOperation,
  UpdateTableStatusRequest,
  CreateReservationRequest,
  UpdateReservationStatusRequest,
  DeleteReservationRequest,
} from "../store/tableTypes";

export const useTables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tablesState = useSelector(selectTablesState);
  const tables = useSelector(selectTables);
  const pagination = useSelector(selectTablesPagination);
  const loading = useSelector(selectTablesLoading);
  const errors = useSelector(selectTablesErrors);
  const successMessage = useSelector(selectTablesSuccessMessage);

  const reservations = useSelector(selectReservations);
  const reservationsPagination = useSelector(selectReservationsPagination);
  const togglingReservationId = useSelector(selectTogglingReservationId);

  const getTables = useCallback(() => {
    dispatch(tablesActions.getTablesRequest());
  }, [dispatch]);

  const createTable = useCallback(
    (payload: CreateTableRequest) => {
      dispatch(tablesActions.createTableRequest(payload));
    },
    [dispatch],
  );

  const updateTableStatus = useCallback(
    (payload: UpdateTableStatusRequest) => {
      dispatch(tablesActions.updateTableStatusRequest(payload));
    },
    [dispatch],
  );

  const deleteTable = useCallback(
    (payload: DeleteTableRequest) => {
      dispatch(tablesActions.deleteTableRequest(payload));
    },
    [dispatch],
  );

  const getReservations = useCallback(
    (payload: { date: string }) => {
      dispatch(tablesActions.getReservationsRequest(payload));
    },
    [dispatch],
  );

  const createReservation = useCallback(
    (payload: CreateReservationRequest) => {
      dispatch(tablesActions.createReservationRequest(payload));
    },
    [dispatch],
  );

  const updateReservationStatus = useCallback(
    (payload: UpdateReservationStatusRequest) => {
      dispatch(tablesActions.updateReservationStatusRequest(payload));
    },
    [dispatch],
  );

  const deleteReservation = useCallback(
    (payload: DeleteReservationRequest) => {
      dispatch(tablesActions.deleteReservationRequest(payload));
    },
    [dispatch],
  );

  const clearTablesError = useCallback(
    (operation?: TablesOperation) => {
      dispatch(tablesActions.clearTablesError(operation));
    },
    [dispatch],
  );

  const clearTablesMessages = useCallback(() => {
    dispatch(tablesActions.clearTablesMessages());
  }, [dispatch]);

  return {
    ...tablesState,
    tables,
    pagination,
    loading,
    errors,
    successMessage,
    reservations,
    reservationsPagination,
    togglingReservationId,
    getTables,
    createTable,
    updateTableStatus,
    deleteTable,
    getReservations,
    createReservation,
    updateReservationStatus,
    deleteReservation,
    clearTablesError,
    clearTablesMessages,
    isFetchingTables: loading.fetch,
    isCreatingTable: loading.create,
    isUpdatingTableStatus: loading.updateStatus,
    isDeletingTable: loading.delete,
    isFetchingReservations: loading.fetchReservations,
    isCreatingReservation: loading.createReservation,
    isUpdatingReservationStatus: loading.updateReservationStatus,
    isDeletingReservation: loading.deleteReservation,
  };
};
