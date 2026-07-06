import { api } from "@/config/api";
import type {
  GetBatchesResponse,
  CreateBatchRequest,
  CreateBatchResponse,
  UpdateBatchStatusRequest,
  UpdateBatchStatusResponse,
  GetEquipmentResponse,
  CreateEquipmentRequest,
  CreateEquipmentResponse,
  UpdateEquipmentRequest,
  UpdateEquipmentResponse,
} from "../store/productionTypes";

const ENDPOINTS = {
  BATCHES: "/production/batches",
  BATCH_STATUS: (id: string) => `/production/batches/${id}/status`,
  EQUIPMENT: "/production/equipment",
  EQUIPMENT_BY_ID: (id: string) => `/production/equipment/${id}`,
};

export const getBatches = async () => {
  const response = await api.get<GetBatchesResponse>(ENDPOINTS.BATCHES);
  return response.data;
};

export const createBatch = async (data: CreateBatchRequest) => {
  const response = await api.post<CreateBatchResponse>(ENDPOINTS.BATCHES, data);
  return response.data;
};

export const updateBatchStatus = async (
  id: string,
  data: UpdateBatchStatusRequest,
) => {
  const response = await api.patch<UpdateBatchStatusResponse>(
    ENDPOINTS.BATCH_STATUS(id),
    data,
  );
  return response.data;
};

export const getEquipment = async () => {
  const response = await api.get<GetEquipmentResponse>(ENDPOINTS.EQUIPMENT);
  return response.data;
};

export const createEquipment = async (data: CreateEquipmentRequest) => {
  const response = await api.post<CreateEquipmentResponse>(
    ENDPOINTS.EQUIPMENT,
    data,
  );
  return response.data;
};

export const updateEquipment = async (
  id: string,
  data: UpdateEquipmentRequest,
) => {
  const response = await api.put<UpdateEquipmentResponse>(
    ENDPOINTS.EQUIPMENT_BY_ID(id),
    data,
  );
  return response.data;
};

export const productionApi = {
  getBatches,
  createBatch,
  updateBatchStatus,
  getEquipment,
  createEquipment,
  updateEquipment,
};
export default productionApi;
