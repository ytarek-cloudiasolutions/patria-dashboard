import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CouponsState,
  CouponsOperation,
  CouponsLoadingState,
  CouponsErrorState,
  Coupon,
  GetCouponsRequest,
  GetCouponsResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
  Pagination,
} from "./couponTypes";

const initialLoading: CouponsLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: CouponsErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialState: CouponsState = {
  coupons: [],
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: CouponsState,
  operation: CouponsOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: CouponsState,
  operation: CouponsOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    getCouponsRequest: (
      state,
      _action: PayloadAction<GetCouponsRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getCouponsSuccess: (
      state,
      action: PayloadAction<GetCouponsResponse>,
    ) => {
      state.loading.fetch = false;
      state.coupons = action.payload.data ?? [];
      state.pagination = action.payload.pagination ?? null;
    },
    getCouponsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createCouponRequest: (
      state,
      _action: PayloadAction<CreateCouponRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createCouponSuccess: (
      state,
      action: PayloadAction<{ coupon: Coupon; message?: string }>,
    ) => {
      state.loading.create = false;
      state.coupons.unshift(action.payload.coupon);
      state.successMessage = action.payload.message ?? "Coupon created successfully";
    },
    createCouponFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateCouponRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateCouponRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateCouponSuccess: (
      state,
      action: PayloadAction<{ coupon: Coupon; message?: string }>,
    ) => {
      state.loading.update = false;
      const idx = state.coupons.findIndex((c) => c._id === action.payload.coupon._id);
      if (idx !== -1) {
        state.coupons[idx] = action.payload.coupon;
      }
      state.successMessage = action.payload.message ?? "Coupon updated successfully";
    },
    updateCouponFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteCouponRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteCouponSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.coupons = state.coupons.filter((c) => c._id !== action.payload.id);
      state.successMessage = action.payload.message ?? "Coupon deleted successfully";
    },
    deleteCouponFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearCouponsMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const couponsActions = couponsSlice.actions;
export const couponsReducer = couponsSlice.reducer;
export default couponsReducer;
