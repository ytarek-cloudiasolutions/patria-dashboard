import { api } from "@/config/api";
import type {
  GetPurchaseOrdersResponse,
  GetPurchaseOrdersRequest,
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderResponse,
  PurchaseOrderActionResponse,
} from "../store/purchasingTypes";

const ENDPOINTS = {
  PURCHASE_ORDERS: "/purchasing",
  PURCHASE_ORDER_SUBMIT: (id: string) => `/purchasing/${id}/submit`,
  PURCHASE_ORDER_CANCEL: (id: string) => `/purchasing/${id}/cancel`,
  PURCHASE_ORDER_PAYMENT: (id: string) => `/purchasing/${id}/payment`,
  PURCHASE_ORDER_RECEIVE: (id: string) => `/purchasing/${id}/receive`,
};

export const getPurchaseOrders = async (params?: GetPurchaseOrdersRequest) => {
  const response = await api.get<GetPurchaseOrdersResponse>(
    ENDPOINTS.PURCHASE_ORDERS,
    { params },
  );
  return response.data;
};

export const createPurchaseOrder = async (data: CreatePurchaseOrderRequest) => {
  const response = await api.post<CreatePurchaseOrderResponse>(
    ENDPOINTS.PURCHASE_ORDERS,
    data,
  );
  return response.data;
};

export const submitPurchaseOrder = async (id: string) => {
  const response = await api.post<PurchaseOrderActionResponse>(
    ENDPOINTS.PURCHASE_ORDER_SUBMIT(id),
  );
  return response.data;
};

export const cancelPurchaseOrder = async (id: string) => {
  const response = await api.post<PurchaseOrderActionResponse>(
    ENDPOINTS.PURCHASE_ORDER_CANCEL(id),
  );
  return response.data;
};

export const makePurchaseOrderPayment = async (id: string, amount: number) => {
  const response = await api.post<PurchaseOrderActionResponse>(
    ENDPOINTS.PURCHASE_ORDER_PAYMENT(id),
    { amount },
  );
  return response.data;
};

export const receivePurchaseOrder = async (id: string) => {
  const response = await api.post<PurchaseOrderActionResponse>(
    ENDPOINTS.PURCHASE_ORDER_RECEIVE(id),
  );
  return response.data;
};

export const purchasingApi = {
  getPurchaseOrders,
  createPurchaseOrder,
  submitPurchaseOrder,
  cancelPurchaseOrder,
  makePurchaseOrderPayment,
  receivePurchaseOrder,
};
export default purchasingApi;
