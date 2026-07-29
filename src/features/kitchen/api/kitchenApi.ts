import { api } from "@/config/api";
import type {
  GetKitchenOrdersResponse,
  UpdateKitchenOrderStatusRequest,
  UpdateKitchenOrderStatusResponse,
} from "../store/kitchenTypes";

export const getKitchenOrders = async (kitchenType?: string) => {
  const response = await api.get<GetKitchenOrdersResponse>("/kitchen/orders", {
    params: kitchenType ? { kitchenType } : undefined,
  });
  return response.data;
};

export interface KitchenStation {
  kitchenType: string;
  name: string;
  description: string;
  status: "Active" | "Busy";
  activeOrders: number;
  requests: number;
}

export const getKitchenStations = async () => {
  const response = await api.get<{ stations: KitchenStation[] }>("/kitchen/stations");
  return response.data.stations;
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
  getKitchenStations,
  updateKitchenOrderStatus,
};

export default kitchenApi;
