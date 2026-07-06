import { api } from "@/config/api";
import { ORDER_ENDPOINTS } from "../constants/orderConstants";
import type {
  GetOrdersRequest,
  GetOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderByIdResponse,
  UpdateOrderResponse,
  DeleteOrderResponse,
} from "../store/orderTypes";

export const getOrders = async (params?: GetOrdersRequest) => {
  const response = await api.get<GetOrdersResponse>(
    ORDER_ENDPOINTS.ORDERS,
    { params },
  );
  return response.data;
};

export const createOrder = async (data: CreateOrderRequest) => {
  const response = await api.post<CreateOrderResponse>(
    ORDER_ENDPOINTS.ORDERS,
    data,
  );
  return response.data;
};

export const getOrderById = async (orderId: string) => {
  const response = await api.get<GetOrderByIdResponse>(
    ORDER_ENDPOINTS.ORDER_BY_ID(orderId),
  );
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.put<UpdateOrderResponse>(
    ORDER_ENDPOINTS.ORDER_BY_ID(orderId),
    { status },
  );
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await api.delete<DeleteOrderResponse>(
    ORDER_ENDPOINTS.ORDER_BY_ID(orderId),
  );
  return response.data;
};

export const ordersApi = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
