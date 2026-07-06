import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { warehousesActions } from "../store/warehousesSlice";
import {
  selectWarehouses,
  selectTransfers,
  selectWarehousesLoading,
  selectWarehousesErrors,
} from "../store/warehousesSelectors";
import type {
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateTransferRequest,
  UpdateTransferStatusRequest,
} from "../store/warehousesTypes";

export const useWarehouses = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const select = useSelector as (selector: (s: any) => any) => any;

  const warehouses = select(selectWarehouses);
  const transfers = select(selectTransfers);
  const loading = select(selectWarehousesLoading);
  const errors = select(selectWarehousesErrors);

  const getWarehouses = useCallback(() => {
    dispatch(warehousesActions.getWarehousesRequest());
  }, [dispatch]);

  const createWarehouse = useCallback(
    (data: CreateWarehouseRequest) => {
      dispatch(warehousesActions.createWarehouseRequest(data));
    },
    [dispatch],
  );

  const updateWarehouse = useCallback(
    (id: string, data: UpdateWarehouseRequest) => {
      dispatch(warehousesActions.updateWarehouseRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteWarehouse = useCallback(
    (id: string) => {
      dispatch(warehousesActions.deleteWarehouseRequest({ id }));
    },
    [dispatch],
  );

  const getTransfers = useCallback(() => {
    dispatch(warehousesActions.getTransfersRequest());
  }, [dispatch]);

  const createTransfer = useCallback(
    (data: CreateTransferRequest) => {
      dispatch(warehousesActions.createTransferRequest(data));
    },
    [dispatch],
  );

  const updateTransferStatus = useCallback(
    (id: string, data: UpdateTransferStatusRequest) => {
      dispatch(warehousesActions.updateTransferStatusRequest({ id, data }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(warehousesActions.clearWarehousesMessages());
  }, [dispatch]);

  return {
    warehouses,
    transfers,
    loading,
    errors,
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getTransfers,
    createTransfer,
    updateTransferStatus,
    clearMessages,
  };
};

export default useWarehouses;
