export type NotificationCategory = "orders" | "stock" | "system";

export interface AppNotification {
  id: number | string;
  category: NotificationCategory;
  /** Notification heading — comes from the backend, not translated. */
  title: string;
  /** Notification body — comes from the backend, not translated. */
  description: string;
  /** Relative time label from the backend (e.g. "3h ago"). */
  time: string;
  read: boolean;
  resolved: boolean;
  orderId?: string;
}

export type NotificationTab = "all" | NotificationCategory;
