import { api } from "@/config/api";
import type {
  GetDriversResponse,
  CreateDriverRequest,
  UpdateDriverRequest,
} from "../store/logisticsTypes";

const BASE = "/logistics/drivers";

export const getDrivers = async (): Promise<GetDriversResponse> => {
  const response = await api.get<GetDriversResponse>(BASE);
  return response.data;
};

export const createDriver = async (
  data: CreateDriverRequest,
): Promise<{ driver: import("../store/logisticsTypes").Driver }> => {
  const response =
    await api.post<{ driver: import("../store/logisticsTypes").Driver }>(
      BASE,
      data,
    );
  return response.data;
};

export const updateDriver = async (
  id: string,
  data: UpdateDriverRequest,
): Promise<{ driver: import("../store/logisticsTypes").Driver }> => {
  const response = await api.put<{
    driver: import("../store/logisticsTypes").Driver;
  }>(`${BASE}/${id}`, data);
  return response.data;
};

export const deleteDriver = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`${BASE}/${id}`);
  return response.data;
};

export const logisticsApi = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
};

export default logisticsApi;
