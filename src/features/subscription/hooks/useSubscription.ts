import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { subscriptionActions } from "../store/subscriptionSlice";
import type {
  GetSubscriptionsRequest,
  CreateSubscriptionRequest,
} from "../store/subscriptionTypes";

export const useSubscription = () => {
  const dispatch = useDispatch();

  const subscriptions = useSelector(
    (state: RootState) => state.subscription.subscriptions,
  );
  const stats = useSelector((state: RootState) => state.subscription.stats);
  const pagination = useSelector(
    (state: RootState) => state.subscription.pagination,
  );
  const users = useSelector((state: RootState) => state.subscription.users);
  const products = useSelector(
    (state: RootState) => state.subscription.products,
  );
  const loading = useSelector((state: RootState) => state.subscription.loading);
  const errors = useSelector((state: RootState) => state.subscription.errors);
  const successMessage = useSelector(
    (state: RootState) => state.subscription.successMessage,
  );

  const getSubscriptionsList = useCallback(
    (params?: GetSubscriptionsRequest) => {
      dispatch(subscriptionActions.getSubscriptionsRequest(params));
    },
    [dispatch],
  );

  const getSubscriptionStats = useCallback(() => {
    dispatch(subscriptionActions.getSubscriptionStatsRequest());
  }, [dispatch]);

  const createNewSubscription = useCallback(
    (data: CreateSubscriptionRequest) => {
      dispatch(subscriptionActions.createSubscriptionRequest(data));
    },
    [dispatch],
  );

  const updateSubscriptionInfo = useCallback(
    (id: string, data: any) => {
      dispatch(subscriptionActions.updateSubscriptionRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteSubscriptionInfo = useCallback(
    (id: string) => {
      dispatch(subscriptionActions.deleteSubscriptionRequest({ id }));
    },
    [dispatch],
  );

  const getUsersList = useCallback(() => {
    dispatch(subscriptionActions.getUsersRequest());
  }, [dispatch]);

  const getProductsList = useCallback(() => {
    dispatch(subscriptionActions.getProductsRequest());
  }, [dispatch]);

  const clearMessages = useCallback(() => {
    dispatch(subscriptionActions.clearSubscriptionMessages());
  }, [dispatch]);

  return {
    subscriptions,
    stats,
    pagination,
    users,
    products,
    loading,
    errors,
    successMessage,
    getSubscriptionsList,
    getSubscriptionStats,
    createNewSubscription,
    updateSubscriptionInfo,
    deleteSubscriptionInfo,
    getUsersList,
    getProductsList,
    clearMessages,
  };
};
export default useSubscription;
