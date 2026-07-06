import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { inventoryActions } from "../store/inventorySlice";
import type { UpdateStockRequest, BulkUpdateStockRequest } from "../store/inventoryTypes";

export const useInventory = () => {
  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.inventory.items);
  const shortages = useSelector((state: RootState) => state.inventory.shortages);
  const stats = useSelector((state: RootState) => state.inventory.stats);
  const loading = useSelector((state: RootState) => state.inventory.loading);
  const errors = useSelector((state: RootState) => state.inventory.errors);
  const successMessage = useSelector((state: RootState) => state.inventory.successMessage);

  const getInventoryList = useCallback(() => {
    dispatch(inventoryActions.getInventoryRequest());
  }, [dispatch]);

  const getShortagesList = useCallback(() => {
    dispatch(inventoryActions.getShortagesRequest());
  }, [dispatch]);

  const syncInventory = useCallback(() => {
    dispatch(inventoryActions.syncInventoryRequest());
  }, [dispatch]);

  const updateItemStock = useCallback(
    (id: string, data: UpdateStockRequest) => {
      dispatch(inventoryActions.updateStockRequest({ id, data }));
    },
    [dispatch],
  );

  const bulkUpdateItemsStock = useCallback(
    (data: BulkUpdateStockRequest) => {
      dispatch(inventoryActions.bulkUpdateStockRequest(data));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(inventoryActions.clearInventoryMessages());
  }, [dispatch]);

  return {
    items,
    shortages,
    stats,
    loading,
    errors,
    successMessage,
    getInventoryList,
    getShortagesList,
    syncInventory,
    updateItemStock,
    bulkUpdateItemsStock,
    clearMessages,
  };
};
export default useInventory;
