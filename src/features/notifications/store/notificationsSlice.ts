import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  NotificationsState,
  NotificationsLoadingState,
  NotificationsErrorState,
  NotificationsOperation,
  ApiNotification,
  GetNotificationsResponse,
} from "./notificationsTypes";

const initialLoading: NotificationsLoadingState = {
  fetch: false,
  markAsRead: false,
};

const initialErrors: NotificationsErrorState = {
  fetch: null,
  markAsRead: null,
};

const initialState: NotificationsState = {
  notifications: [],
  loading: initialLoading,
  errors: initialErrors,
};

const setOperationLoading = (
  state: NotificationsState,
  operation: NotificationsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
};

const setOperationFailure = (
  state: NotificationsState,
  operation: NotificationsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    getNotificationsRequest: (state) => {
      setOperationLoading(state, "fetch");
    },
    getNotificationsSuccess: (
      state,
      action: PayloadAction<GetNotificationsResponse>,
    ) => {
      state.loading.fetch = false;
      state.notifications = action.payload.notifications || [];
    },
    getNotificationsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    markAsReadRequest: (state, _action: PayloadAction<{ id: string }>) => {
      setOperationLoading(state, "markAsRead");
    },
    markAsReadSuccess: (
      state,
      action: PayloadAction<{ notification: ApiNotification }>,
    ) => {
      state.loading.markAsRead = false;
      const updated = action.payload.notification;
      const idx = state.notifications.findIndex((n) => n._id === updated._id);
      if (idx !== -1) {
        state.notifications[idx] = updated;
      }
    },
    markAsReadFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "markAsRead", action.payload);
    },
  },
});

export const notificationsActions = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
export default notificationsReducer;
