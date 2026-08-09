import { api } from "@/config/api";
import type {
  OpenShiftRequest,
  OpenShiftResponse,
  CloseShiftRequest,
  CloseShiftResponse,
  GetCurrentShiftResponse,
} from "../store/shiftsTypes";

const ENDPOINTS = {
  OPEN_SHIFT: "/pos/shifts/open",
  CLOSE_SHIFT: "/pos/shifts/close",
  CURRENT_SHIFT: "/pos/shifts/current",
  SHIFT_BY_ID: (shiftId: string) => `/pos/shifts/${shiftId}`,
  SHIFT_REPORT: (shiftId: string) => `/pos/shifts/${shiftId}/report`,
};

export const openShift = async (data: OpenShiftRequest) => {
  const response = await api.post<OpenShiftResponse>(
    ENDPOINTS.OPEN_SHIFT,
    data,
  );
  return response.data;
};

export const closeShift = async (data: CloseShiftRequest) => {
  const response = await api.put<CloseShiftResponse>(
    ENDPOINTS.CLOSE_SHIFT,
    data,
  );
  return response.data;
};

export const getCurrentShift = async (cashierId?: string) => {
  const response = await api.get<GetCurrentShiftResponse>(
    ENDPOINTS.CURRENT_SHIFT,
    cashierId ? { params: { cashierId } } : undefined,
  );
  return response.data;
};

export const getShiftById = async (shiftId: string) => {
  const response = await api.get<GetCurrentShiftResponse>(
    ENDPOINTS.SHIFT_BY_ID(shiftId),
  );
  return response.data;
};

export const getShiftReport = async (shiftId: string) => {
  const response = await api.get(ENDPOINTS.SHIFT_REPORT(shiftId));
  return response.data;
};

export const shiftsApi = {
  openShift,
  closeShift,
  getCurrentShift,
  getShiftById,
  getShiftReport,
};
export default shiftsApi;
