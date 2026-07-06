export interface ApiNotification {
  _id: string;
  title: string;
  message: string;
  body?: string;
  type: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// ---- Request / Response shapes ----

export interface GetNotificationsResponse {
  notifications: ApiNotification[];
}

export interface MarkAsReadResponse {
  notification: ApiNotification;
}

// ---- Store types ----

export type NotificationsOperation = "fetch" | "markAsRead";

export interface NotificationsLoadingState {
  fetch: boolean;
  markAsRead: boolean;
}

export interface NotificationsErrorState {
  fetch: string | null;
  markAsRead: string | null;
}

export interface NotificationsState {
  notifications: ApiNotification[];
  loading: NotificationsLoadingState;
  errors: NotificationsErrorState;
}
