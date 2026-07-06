import { api } from "@/config/api";
import type {
  GetKitchenOrdersResponse,
  UpdateKitchenOrderStatusRequest,
  UpdateKitchenOrderStatusResponse,
} from "../store/kitchenTypes";

export const getKitchenOrders = async () => {
  const response = await api.get<GetKitchenOrdersResponse>("/kitchen/orders");
  return response.data;
};

export const updateKitchenOrderStatus = async (
  id: string,
  body: UpdateKitchenOrderStatusRequest,
) => {
  const response = await api.put<UpdateKitchenOrderStatusResponse>(
    `/kitchen/orders/${id}`,
    body,
  );
  return response.data;
};

export const kitchenApi = {
  getKitchenOrders,
  updateKitchenOrderStatus,
};

export default kitchenApi;
