import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type {
  ProductionState,
  CreateBatchRequest,
  UpdateBatchStatusRequest,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
} from "../store/productionTypes";
import { productionActions } from "../store/productionSlice";

type AppState = RootState & { production: ProductionState };

export const useProduction = () => {
  const dispatch = useDispatch();

  const batches = useSelector((state: AppState) => state.production.batches);
  const equipment = useSelector(
    (state: AppState) => state.production.equipment,
  );
  const loading = useSelector((state: AppState) => state.production.loading);
  const errors = useSelector((state: AppState) => state.production.errors);
  const successMessage = useSelector(
    (state: AppState) => state.production.successMessage,
  );

  const getBatches = useCallback(() => {
    dispatch(productionActions.getBatchesRequest());
  }, [dispatch]);

  const createBatch = useCallback(
    (data: CreateBatchRequest) => {
      dispatch(productionActions.createBatchRequest(data));
    },
    [dispatch],
  );

  const updateBatchStatus = useCallback(
    (id: string, data: UpdateBatchStatusRequest) => {
      dispatch(productionActions.updateBatchStatusRequest({ id, data }));
    },
    [dispatch],
  );

  const getEquipment = useCallback(() => {
    dispatch(productionActions.getEquipmentRequest());
  }, [dispatch]);

  const createEquipment = useCallback(
    (data: CreateEquipmentRequest) => {
      dispatch(productionActions.createEquipmentRequest(data));
    },
    [dispatch],
  );

  const updateEquipment = useCallback(
    (id: string, data: UpdateEquipmentRequest) => {
      dispatch(productionActions.updateEquipmentRequest({ id, data }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(productionActions.clearProductionMessages());
  }, [dispatch]);

  return {
    batches,
    equipment,
    loading,
    errors,
    successMessage,
    getBatches,
    createBatch,
    updateBatchStatus,
    getEquipment,
    createEquipment,
    updateEquipment,
    clearMessages,
  };
};
export default useProduction;
