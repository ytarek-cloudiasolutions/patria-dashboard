import type { RootState } from "@/app/store";

export const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersPagination = (state: RootState) => state.orders.pagination;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersErrors = (state: RootState) => state.orders.errors;
export const selectOrdersSuccessMessage = (state: RootState) => state.orders.successMessage;
