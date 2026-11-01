import { api } from "@/config/api";
import type {
  GetKitchenOrdersResponse,
  UpdateKitchenOrderStatusRequest,
  UpdateKitchenOrderStatusResponse,
} from "../store/kitchenTypes";
import type { Kitchen } from "../types";

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

export interface KitchenCreateUpdateRequest {
  name: string;
  printer?: string;
  icon?: string;
  color?: string;
}

// Kitchen station CRUD — the Kitchen page used to manage these as local
// component state only (nothing persisted past a page refresh); this is the
// real, backend-persisted list.
export const getKitchens = async () => {
  const response = await api.get<{ kitchens: Kitchen[] }>("/kitchens");
  return response.data.kitchens;
};

export const createKitchen = async (body: KitchenCreateUpdateRequest) => {
  const response = await api.post<{ kitchen: Kitchen }>("/kitchens", body);
  return response.data.kitchen;
};

export const updateKitchen = async (
  id: string,
  body: Partial<KitchenCreateUpdateRequest>,
) => {
  const response = await api.put<{ kitchen: Kitchen }>(`/kitchens/${id}`, body);
  return response.data.kitchen;
};

export const deleteKitchen = async (id: string) => {
  await api.delete(`/kitchens/${id}`);
};

export const kitchenApi = {
  getKitchenOrders,
  getKitchenStations,
  updateKitchenOrderStatus,
  getKitchens,
  createKitchen,
  updateKitchen,
  deleteKitchen,
};

export default kitchenApi;
