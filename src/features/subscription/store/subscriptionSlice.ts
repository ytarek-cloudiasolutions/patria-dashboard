import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SubscriptionState,
  SubscriptionLoadingState,
  SubscriptionErrorState,
  SubscriptionOperation,
  GetSubscriptionsRequest,
  GetSubscriptionsResponse,
  SubscriptionStats,
  CreateSubscriptionRequest,
} from "./subscriptionTypes";
import {
  mapSubscriptions,
  mapUserOption,
  mapProductOption,
} from "../utils/subscriptionMappers";

const initialLoading: SubscriptionLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
  stats: false,
  users: false,
  products: false,
  renewals: false,
};

const initialErrors: SubscriptionErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
  stats: null,
  users: null,
  products: null,
  renewals: null,
};

const initialState: SubscriptionState = {
  subscriptions: [],
  stats: {
    active: 0,
  },
  pagination: null,
  users: [],
  products: [],
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: SubscriptionState,
  operation: SubscriptionOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: SubscriptionState,
  operation: SubscriptionOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    getSubscriptionsRequest: (
      state,
      _action: PayloadAction<GetSubscriptionsRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getSubscriptionsSuccess: (
      state,
      action: PayloadAction<GetSubscriptionsResponse>,
    ) => {
      state.loading.fetch = false;
      state.subscriptions = mapSubscriptions(action.payload.data || []);
      state.pagination = action.payload.pagination || null;
    },
    getSubscriptionsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    getSubscriptionStatsRequest: (state) => {
      setOperationLoading(state, "stats");
    },
    getSubscriptionStatsSuccess: (
      state,
      action: PayloadAction<{ stats: SubscriptionStats }>,
    ) => {
      state.loading.stats = false;
      state.stats = action.payload.stats || { active: 0 };
    },
    getSubscriptionStatsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "stats", action.payload);
    },

    createSubscriptionRequest: (
      state,
      _action: PayloadAction<CreateSubscriptionRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createSubscriptionSuccess: (
      state,
      _action: PayloadAction<{ subscription: any; message?: string }>,
    ) => {
      state.loading.create = false;
      state.successMessage = "Subscription created successfully";
    },
    createSubscriptionFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateSubscriptionRequest: (
      state,
      _action: PayloadAction<{ id: string; data: any }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateSubscriptionSuccess: (
      state,
      _action: PayloadAction<{ subscription: any; message?: string }>,
    ) => {
      state.loading.update = false;
      state.successMessage = "Subscription updated successfully";
    },
    updateSubscriptionFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteSubscriptionRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteSubscriptionSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.subscriptions = state.subscriptions.filter(
        (sub) => String(sub.id) !== action.payload.id,
      );
      state.successMessage =
        action.payload.message || "Subscription deleted successfully";
    },
    deleteSubscriptionFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    getUsersRequest: (state) => {
      setOperationLoading(state, "users");
    },
    getUsersSuccess: (state, action: PayloadAction<any>) => {
      state.loading.users = false;
      const userList = action.payload.data || action.payload || [];
      state.users = (userList as any[]).map(mapUserOption);
    },
    getUsersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "users", action.payload);
    },

    getProductsRequest: (state) => {
      setOperationLoading(state, "products");
    },
    getProductsSuccess: (state, action: PayloadAction<any>) => {
      state.loading.products = false;
      const prodList =
        action.payload.products || action.payload.data || action.payload || [];
      state.products = (prodList as any[]).map(mapProductOption);
    },
    getProductsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "products", action.payload);
    },

    runRenewalsRequest: (state) => {
      setOperationLoading(state, "renewals");
    },
    runRenewalsSuccess: (state, _action: PayloadAction<any>) => {
      state.loading.renewals = false;
      state.successMessage = "Renewals executed successfully";
    },
    runRenewalsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "renewals", action.payload);
    },

    clearSubscriptionMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const subscriptionActions = subscriptionSlice.actions;
export const subscriptionReducer = subscriptionSlice.reducer;
export default subscriptionReducer;
