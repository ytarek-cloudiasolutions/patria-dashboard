import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectOrdersState,
  selectOrders,
  selectOrdersPagination,
  selectSelectedOrder,
  selectOrdersLoading,
  selectOrdersErrors,
  selectOrdersSuccessMessage,
} from "../store/ordersSelectors";
import { ordersActions } from "../store/ordersSlice";
import type { GetOrdersRequest, CreateOrderRequest, OrdersOperation } from "../store/orderTypes";

export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ordersState = useSelector(selectOrdersState);
  const orders = useSelector(selectOrders);
  const pagination = useSelector(selectOrdersPagination);
  const selectedOrder = useSelector(selectSelectedOrder);
  const loading = useSelector(selectOrdersLoading);
  const errors = useSelector(selectOrdersErrors);
  const successMessage = useSelector(selectOrdersSuccessMessage);

  const getOrdersList = useCallback(
    (params?: GetOrdersRequest) => {
      dispatch(ordersActions.getOrdersRequest(params));
    },
    [dispatch],
  );

  const createNewOrder = useCallback(
    (data: CreateOrderRequest) => {
      dispatch(ordersActions.createOrderRequest(data));
    },
    [dispatch],
  );

  const getOrderDetails = useCallback(
    (orderId: string) => {
      dispatch(ordersActions.getOrderByIdRequest(orderId));
    },
    [dispatch],
  );

  const updateOrderStatusValue = useCallback(
    (payload: { orderId: string; status: string }) => {
      dispatch(ordersActions.updateOrderStatusRequest(payload));
    },
    [dispatch],
  );

  const deleteOrderValue = useCallback(
    (orderId: string) => {
      dispatch(ordersActions.deleteOrderRequest(orderId));
    },
    [dispatch],
  );

  const clearOrdersError = useCallback(
    (operation?: OrdersOperation) => {
      dispatch(ordersActions.clearOrdersError(operation));
    },
    [dispatch],
  );

  const clearOrdersMessages = useCallback(() => {
    dispatch(ordersActions.clearOrdersMessages());
  }, [dispatch]);

  return {
    ...ordersState,
    orders,
    pagination,
    selectedOrder,
    loading,
    errors,
    successMessage,
    getOrdersList,
    createNewOrder,
    getOrderDetails,
    updateOrderStatusValue,
    deleteOrderValue,
    clearOrdersError,
    clearOrdersMessages,
    isFetchingOrders: loading.fetch,
    isCreatingOrder: loading.create,
    isUpdatingOrderStatus: loading.update,
    isDeletingOrder: loading.delete,
  };
};
