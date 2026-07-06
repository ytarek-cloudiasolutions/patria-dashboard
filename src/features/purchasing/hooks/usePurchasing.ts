import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { PurchasingState, GetPurchaseOrdersRequest, CreatePurchaseOrderRequest } from "../store/purchasingTypes";
import { purchasingActions } from "../store/purchasingSlice";
import type { RootState } from "@/app/store";

type AppState = RootState & { purchasing: PurchasingState };

export const usePurchasing = () => {
  const dispatch = useDispatch();

  const purchaseOrders = useSelector(
    (state: AppState) => state.purchasing.purchaseOrders,
  );
  const pagination = useSelector(
    (state: AppState) => state.purchasing.pagination,
  );
  const loading = useSelector((state: AppState) => state.purchasing.loading);
  const errors = useSelector((state: AppState) => state.purchasing.errors);
  const successMessage = useSelector(
    (state: AppState) => state.purchasing.successMessage,
  );

  const getPurchaseOrders = useCallback(
    (params?: GetPurchaseOrdersRequest) => {
      dispatch(purchasingActions.getPurchaseOrdersRequest(params));
    },
    [dispatch],
  );

  const createPurchaseOrder = useCallback(
    (data: CreatePurchaseOrderRequest) => {
      dispatch(purchasingActions.createPurchaseOrderRequest(data));
    },
    [dispatch],
  );

  const submitPurchaseOrder = useCallback(
    (id: string) => {
      dispatch(purchasingActions.submitPurchaseOrderRequest({ id }));
    },
    [dispatch],
  );

  const cancelPurchaseOrder = useCallback(
    (id: string) => {
      dispatch(purchasingActions.cancelPurchaseOrderRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(purchasingActions.clearPurchasingMessages());
  }, [dispatch]);

  return {
    purchaseOrders,
    pagination,
    loading,
    errors,
    successMessage,
    getPurchaseOrders,
    createPurchaseOrder,
    submitPurchaseOrder,
    cancelPurchaseOrder,
    clearMessages,
  };
};
export default usePurchasing;
