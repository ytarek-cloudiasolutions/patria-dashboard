import { api } from "@/config/api";
import { SUBSCRIPTION_ENDPOINTS } from "../constants/subscriptionConstants";
import type {
  GetSubscriptionsRequest,
  GetSubscriptionsResponse,
  CreateSubscriptionRequest,
  SubscriptionStats,
} from "../store/subscriptionTypes";

export const getSubscriptions = async (params?: GetSubscriptionsRequest) => {
  const response = await api.get<GetSubscriptionsResponse>(
    SUBSCRIPTION_ENDPOINTS.SUBSCRIPTIONS,
    { params },
  );
  return response.data;
};

export const createSubscription = async (data: CreateSubscriptionRequest) => {
  const response = await api.post<{ subscription: any }>(
    SUBSCRIPTION_ENDPOINTS.SUBSCRIPTIONS,
    data,
  );
  return response.data;
};

export const getSubscriptionStats = async () => {
  const response = await api.get<{ stats: SubscriptionStats }>(
    SUBSCRIPTION_ENDPOINTS.STATS,
  );
  return response.data;
};

export const updateSubscription = async (id: string, data: any) => {
  const response = await api.put<{ subscription: any }>(
    SUBSCRIPTION_ENDPOINTS.SUBSCRIPTION_BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteSubscription = async (id: string) => {
  const response = await api.delete<{ message: string }>(
    SUBSCRIPTION_ENDPOINTS.SUBSCRIPTION_BY_ID(id),
  );
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get<{ data: any[] } | any[]>(
    SUBSCRIPTION_ENDPOINTS.USERS,
  );
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get<{ products: any[] } | { data: any[] } | any[]>(
    SUBSCRIPTION_ENDPOINTS.PRODUCTS,
    { params: { limit: 100 } }, // Load up to 100 products to populate dropdown
  );
  return response.data;
};

export const subscriptionApi = {
  getSubscriptions,
  createSubscription,
  getSubscriptionStats,
  updateSubscription: (id: string, data: any) =>
    api.put(SUBSCRIPTION_ENDPOINTS.SUBSCRIPTION_BY_ID(id), data).then((res) => res.data),
  deleteSubscription,
  getUsers,
  getProducts,
};
export default subscriptionApi;
