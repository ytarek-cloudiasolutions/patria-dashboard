import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  UserState,
  UserLoadingState,
  UserErrorState,
  UserOperation,
  GetUsersResponse,
  CreateUserRequest,
} from "./userTypes";
import { mapUserAccounts } from "../utils/userMappers";

const initialLoading: UserLoadingState = {
  fetch: false,
  create: false,
  update: false,
  delete: false,
};

const initialErrors: UserErrorState = {
  fetch: null,
  create: null,
  update: null,
  delete: null,
};

const initialState: UserState = {
  users: [],
  pagination: null,
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: UserState,
  operation: UserOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: UserState,
  operation: UserOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersRequest: (
      state,
      _action: PayloadAction<{ page?: number; limit?: number } | undefined>,
    ) => {
      setOperationLoading(state, "fetch");
    },
    getUsersSuccess: (
      state,
      action: PayloadAction<GetUsersResponse>,
    ) => {
      state.loading.fetch = false;
      state.users = mapUserAccounts(action.payload.data || []);
      state.pagination = action.payload.pagination || null;
    },
    getUsersFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetch", action.payload);
    },

    createUserRequest: (
      state,
      _action: PayloadAction<CreateUserRequest>,
    ) => {
      setOperationLoading(state, "create");
    },
    createUserSuccess: (
      state,
      _action: PayloadAction<{ user: any; message?: string }>,
    ) => {
      state.loading.create = false;
      state.successMessage = "User account created successfully";
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "create", action.payload);
    },

    updateUserRequest: (
      state,
      _action: PayloadAction<{ id: string; data: Partial<CreateUserRequest> }>,
    ) => {
      setOperationLoading(state, "update");
    },
    updateUserSuccess: (
      state,
      _action: PayloadAction<{ user: any; message?: string }>,
    ) => {
      state.loading.update = false;
      state.successMessage = "User permissions updated successfully";
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "update", action.payload);
    },

    deleteUserRequest: (
      state,
      _action: PayloadAction<{ id: string }>,
    ) => {
      setOperationLoading(state, "delete");
    },
    deleteUserSuccess: (
      state,
      action: PayloadAction<{ id: string; message?: string }>,
    ) => {
      state.loading.delete = false;
      state.users = state.users.filter(
        (u) => String(u.id) !== action.payload.id,
      );
      state.successMessage =
        action.payload.message || "User account deleted successfully";
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "delete", action.payload);
    },

    clearUserMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
export default userReducer;
