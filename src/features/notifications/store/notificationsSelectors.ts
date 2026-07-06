import type { RootState } from "@/app/store";
import type { NotificationsState, NotificationsOperation } from "./notificationsTypes";

// Extended to include the notifications slice (added to rootReducer separately)
type AppState = RootState & { notifications: NotificationsState };

export const selectNotificationsState = (state: AppState) =>
  state.notifications;

export const selectNotifications = (state: AppState) =>
  state.notifications.notifications;

export const selectUnreadCount = (state: AppState) =>
  state.notifications.notifications.filter((n) => !n.isRead).length;

export const selectNotificationsLoading = (state: AppState) =>
  state.notifications.loading;

export const selectNotificationsErrors = (state: AppState) =>
  state.notifications.errors;

export const selectIsNotificationsOperationLoading =
  (operation: NotificationsOperation) => (state: AppState) =>
    state.notifications.loading[operation];

export const selectNotificationsOperationError =
  (operation: NotificationsOperation) => (state: AppState) =>
    state.notifications.errors[operation];
