import type { RootState } from "@/app/store";

export const selectKitchenState = (state: RootState) => state.kitchen;

export const selectKitchenOrders = (state: RootState) => state.kitchen.kitchenOrders;
export const selectKitchenLoading = (state: RootState) => state.kitchen.loading;
export const selectKitchenErrors = (state: RootState) => state.kitchen.errors;
export const selectKitchenSuccessMessage = (state: RootState) => state.kitchen.successMessage;

export const selectIsFetchingKitchenOrders = (state: RootState) => state.kitchen.loading.fetch;
export const selectIsUpdatingKitchenOrder = (state: RootState) => state.kitchen.loading.update;

export const selectFetchKitchenOrdersError = (state: RootState) => state.kitchen.errors.fetch;
export const selectUpdateKitchenOrderError = (state: RootState) => state.kitchen.errors.update;
