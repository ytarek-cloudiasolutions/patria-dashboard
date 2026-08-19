import { all, call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../api/ordersApi";
import { ordersActions } from "./ordersSlice";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import type {
  GetOrdersRequest,
  GetOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderResponse,
} from "./orderTypes";
import { mapOrderStatusToBackend } from "../utils/orderMappers";
import type { OrderStatus } from "../types";

function getOrderErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

function* handleGetOrders(
  action: PayloadAction<GetOrdersRequest | undefined>,
): Generator<any, void, any> {
  try {
    const response: GetOrdersResponse = (yield call(getOrders, action.payload)) as GetOrdersResponse;
    yield put(
      ordersActions.getOrdersSuccess({
        orders: response.data || response.orders || [],
        pagination: response.pagination,
      }),
    );
  } catch (error) {
    const errorMessage = getOrderErrorMessage(error);
    yield put(ordersActions.getOrdersFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

function* handleCreateOrder(
  action: PayloadAction<CreateOrderRequest>,
): Generator<any, void, any> {
  try {
    const response: CreateOrderResponse = (yield call(createOrder, action.payload)) as CreateOrderResponse;
    yield put(
      ordersActions.createOrderSuccess({
        order: response.order,
        message: response.message,
      }),
    );
    showSuccessToast(response.message || "Order created successfully");
  } catch (error) {
    const errorMessage = getOrderErrorMessage(error);
    yield put(ordersActions.createOrderFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

function* handleGetOrderById(
  action: PayloadAction<string>,
): Generator<any, void, any> {
  try {
    const response: { order: any } = (yield call(getOrderById, action.payload)) as { order: any };
    yield put(ordersActions.getOrderByIdSuccess(response.order));
  } catch (error) {
    const errorMessage = getOrderErrorMessage(error);
    yield put(ordersActions.getOrderByIdFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

function* handleUpdateOrderStatus(
  action: PayloadAction<{ orderId: string; status: string }>,
): Generator<any, void, any> {
  try {
    const { orderId, status } = action.payload;
    const backendStatus = mapOrderStatusToBackend(status as OrderStatus);
    const response: UpdateOrderResponse = (yield call(
      updateOrderStatus,
      orderId,
      backendStatus,
    )) as UpdateOrderResponse;
    yield put(
      ordersActions.updateOrderStatusSuccess({
        order: response.order,
        message: response.message,
      }),
    );
    showSuccessToast(response.message || "Order status updated successfully");
  } catch (error) {
    const errorMessage = getOrderErrorMessage(error);
    yield put(ordersActions.updateOrderStatusFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

function* handleDeleteOrder(
  action: PayloadAction<string>,
): Generator<any, void, any> {
  try {
    const orderId = action.payload;
    const response: { message: string } = (yield call(deleteOrder, orderId)) as { message: string };
    yield put(
      ordersActions.deleteOrderSuccess({
        orderId,
        message: response.message,
      }),
    );
    showSuccessToast(response.message || "Order deleted successfully");
  } catch (error) {
    const errorMessage = getOrderErrorMessage(error);
    yield put(ordersActions.deleteOrderFailure(errorMessage));
    showErrorToast(errorMessage);
  }
}

export default function* ordersSaga(): Generator<any, void, any> {
  yield all([
    takeLatest(ordersActions.getOrdersRequest.type, handleGetOrders),
    takeLatest(ordersActions.createOrderRequest.type, handleCreateOrder),
    takeLatest(ordersActions.getOrderByIdRequest.type, handleGetOrderById),
    takeLatest(
      ordersActions.updateOrderStatusRequest.type,
      handleUpdateOrderStatus,
    ),
    takeLatest(ordersActions.deleteOrderRequest.type, handleDeleteOrder),
  ]);
}
