import { api } from "@/config/api";
import type {
  ApiNotification,
  GetNotificationsResponse,
  MarkAsReadResponse,
} from "../store/notificationsTypes";

const ENDPOINTS = {
  NOTIFICATIONS: "/notifications",
  MARK_READ: (id: string) => `/notifications/${id}/read`,
};

// Backend uses flat sendSuccess — response body IS the data directly (no wrapper)
export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  const response = await api.get<GetNotificationsResponse>(ENDPOINTS.NOTIFICATIONS);
  return response.data ?? { notifications: [] };
};

export const markNotificationAsRead = async (id: string): Promise<MarkAsReadResponse> => {
  const response = await api.put<MarkAsReadResponse>(ENDPOINTS.MARK_READ(id));
  return response.data ?? { notification: null as unknown as ApiNotification };
};

export const notificationsApi = {
  getNotifications,
  markNotificationAsRead,
};
export default notificationsApi;
