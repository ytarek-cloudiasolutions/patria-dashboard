import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { NotificationsState } from "../store/notificationsTypes";
import { notificationsActions } from "../store/notificationsSlice";

type AppState = RootState & { notifications: NotificationsState };

export const useNotifications = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: AppState) => state.notifications.notifications,
  );
  const unreadCount = useSelector(
    (state: AppState) =>
      state.notifications.notifications.filter((n) => !n.isRead).length,
  );
  const loading = useSelector(
    (state: AppState) => state.notifications.loading,
  );
  const errors = useSelector((state: AppState) => state.notifications.errors);

  const getNotifications = useCallback(() => {
    dispatch(notificationsActions.getNotificationsRequest());
  }, [dispatch]);

  const markAsRead = useCallback(
    (id: string) => {
      dispatch(notificationsActions.markAsReadRequest({ id }));
    },
    [dispatch],
  );

  return {
    notifications,
    unreadCount,
    loading,
    errors,
    getNotifications,
    markAsRead,
  };
};
export default useNotifications;
