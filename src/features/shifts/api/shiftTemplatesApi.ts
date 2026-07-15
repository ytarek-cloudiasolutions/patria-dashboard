import { api } from "@/config/api";

export interface ApiShiftTemplate {
  _id: string;
  name: string;
  /** 24-hour "HH:MM", as stored by the backend. */
  startTime: string;
  /** 24-hour "HH:MM", as stored by the backend. */
  endTime: string;
  color: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface ShiftTemplatePayload {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  description?: string;
}

const BASE = "/shift-templates";

export const getShiftTemplates = async (): Promise<ApiShiftTemplate[]> => {
  const response = await api.get<{ templates: ApiShiftTemplate[] }>(BASE);
  return response.data.templates;
};

export const createShiftTemplate = async (
  data: ShiftTemplatePayload,
): Promise<ApiShiftTemplate> => {
  const response = await api.post<{ template: ApiShiftTemplate }>(BASE, data);
  return response.data.template;
};

export const updateShiftTemplate = async (
  id: string,
  data: ShiftTemplatePayload,
): Promise<ApiShiftTemplate> => {
  const response = await api.put<{ template: ApiShiftTemplate }>(
    `${BASE}/${id}`,
    data,
  );
  return response.data.template;
};

export const deleteShiftTemplate = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

export const shiftTemplatesApi = {
  getShiftTemplates,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
};

export default shiftTemplatesApi;
