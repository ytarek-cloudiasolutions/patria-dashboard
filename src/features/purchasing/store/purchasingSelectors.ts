import type { RootState } from "@/app/store";
import type { PurchasingState, PurchasingOperation } from "./purchasingTypes";

// Extended to include the purchasing slice (added to rootReducer separately)
type AppState = RootState & { purchasing: PurchasingState };

export const selectPurchasingState = (state: AppState) => state.purchasing;

export const selectPurchaseOrders = (state: AppState) =>
  state.purchasing.purchaseOrders;

export const selectPurchasingPagination = (state: AppState) =>
  state.purchasing.pagination;

export const selectPurchasingLoading = (state: AppState) =>
  state.purchasing.loading;

export const selectPurchasingErrors = (state: AppState) =>
  state.purchasing.errors;

export const selectPurchasingSuccessMessage = (state: AppState) =>
  state.purchasing.successMessage;

export const selectIsPurchasingOperationLoading =
  (operation: PurchasingOperation) => (state: AppState) =>
    state.purchasing.loading[operation];

export const selectPurchasingOperationError =
  (operation: PurchasingOperation) => (state: AppState) =>
    state.purchasing.errors[operation];
