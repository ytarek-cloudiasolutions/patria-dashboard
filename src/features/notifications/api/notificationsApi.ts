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

// Safely unwrap backend notifications response
export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  const response = await api.get(ENDPOINTS.NOTIFICATIONS);
  const body = response.data;
  const list: ApiNotification[] =
    (Array.isArray(body) ? body : null) ??
    (Array.isArray(body?.data?.notifications) ? body.data.notifications : null) ??
    (Array.isArray(body?.notifications) ? body.notifications : null) ??
    (Array.isArray(body?.data) ? body.data : null) ??
    [];
  return { notifications: list };
};

// [DASHBOARD] Mark a system notification as read: PUT /notifications/{id}/read
export const markNotificationAsRead = async (id: string): Promise<MarkAsReadResponse> => {
  const response = await api.put(ENDPOINTS.MARK_READ(id));
  const body = response.data;
  const notification: ApiNotification =
    body?.data?.notification ??
    body?.notification ??
    body?.data ??
    ({ _id: id, isRead: true } as ApiNotification);
  return { notification };
};

export const notificationsApi = {
  getNotifications,
  markNotificationAsRead,
};
export default notificationsApi;
