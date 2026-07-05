import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  OffersState,
  OffersLoadingState,
  OffersErrorState,
  OffersOperation,
  GetOffersRequest,
  GetOffersResponse,
  CreateOfferRequest,
} from "./offerTypes";
import { mapOffers } from "../utils/offerMappers";

const initialLoading: OffersLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
  toggle: false,
};

const initialErrors: OffersErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
  toggle: null,
};

const initialState: OffersState = {
  offers: [],
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: OffersState,
  operation: OffersOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: OffersState,
  operation: OffersOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    getOffersRequest: (
      state,
      _action: PayloadAction<GetOffersRequest | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getOffersSuccess: (
      state,
      action: PayloadAction<GetOffersResponse>,
    ) => {
      state.loading.fetch = false;
      state.offers = mapOffers(action.payload.data || []);
      state.pagination = action.payload.pagination || null;
    },
    getOffersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createOfferRequest: (
      state,
      _action: PayloadAction<CreateOfferRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createOfferSuccess: (
      state,
      _action: PayloadAction<{ offer: any; message?: string }>,
    ) => {
      state.loading.create = false;
      state.successMessage = "Offer created successfully";
    },
    createOfferFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateOfferRequest: (
      state,
      _action: PayloadAction<{ id: string; data: CreateOfferRequest }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateOfferSuccess: (
      state,
      _action: PayloadAction<{ offer: any; message?: string }>,
    ) => {
      state.loading.update = false;
      state.successMessage = "Offer updated successfully";
    },
    updateOfferFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteOfferRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteOfferSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.offers = state.offers.filter((o) => o.id !== action.payload.id);
      state.successMessage = action.payload.message || "Offer deleted successfully";
    },
    deleteOfferFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    toggleOfferRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "toggle");
    },
    toggleOfferSuccess: (
      state,
      action: PayloadAction<{ id: string; offer: any }>,
    ) => {
      state.loading.toggle = false;
      const mapped = mapOffers([action.payload.offer])[0];
      state.offers = state.offers.map((o) =>
        o.id === action.payload.id ? { ...o, offerStatus: mapped.offerStatus } : o,
      );
      state.successMessage = "Offer status updated";
    },
    toggleOfferFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "toggle", action.payload);
    },

    clearOffersMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const offersActions = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
export default offersReducer;
