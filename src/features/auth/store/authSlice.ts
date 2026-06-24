import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
} from "../utils/token";
import type {
  AuthErrorState,
  AuthLoadingState,
  AuthOperation,
  AuthSessionData,
  AuthState,
  AuthTokens,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "./authTypes";

const initialLoading: AuthLoadingState = {
  register: false,
  login: false,
  refresh: false,
  logout: false,
  me: false,
  forgotPassword: false,
};

const initialErrors: AuthErrorState = {
  register: null,
  login: null,
  refresh: null,
  logout: null,
  me: null,
  forgotPassword: null,
};

const setOperationLoading = (state: AuthState, operation: AuthOperation) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: AuthState,
  operation: AuthOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const initialAccessToken = getStoredAccessToken();

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: initialAccessToken,
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: Boolean(initialAccessToken),
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerRequest: (state, _action: PayloadAction<RegisterRequest>) => {
      setOperationLoading(state, "register");
    },
    registerSuccess: (
      state,
      action: PayloadAction<AuthSessionData & { message: string }>,
    ) => {
      state.loading.register = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "register", action.payload);
    },

    loginRequest: (state, _action: PayloadAction<LoginRequest>) => {
      setOperationLoading(state, "login");
    },
    loginSuccess: (
      state,
      action: PayloadAction<AuthSessionData & { message: string }>,
    ) => {
      state.loading.login = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "login", action.payload);
    },

    refreshRequest: (
      state,
      _action: PayloadAction<RefreshTokenRequest | undefined>,
    ) => {
      setOperationLoading(state, "refresh");
    },
    refreshSuccess: (
      state,
      action: PayloadAction<AuthTokens & { message: string }>,
    ) => {
      state.loading.refresh = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || state.refreshToken;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    },
    refreshFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "refresh", action.payload);
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },

    logoutRequest: (state) => {
      setOperationLoading(state, "logout");
    },
    logoutSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.loading.logout = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.successMessage = action.payload.message;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "logout", action.payload);
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    getMeRequest: (state) => {
      setOperationLoading(state, "me");
    },
    getMeSuccess: (
      state,
      action: PayloadAction<{ user: AuthUser; message: string }>,
    ) => {
      state.loading.me = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    },
    getMeFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "me", action.payload);
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },

    forgotPasswordRequest: (
      state,
      _action: PayloadAction<ForgotPasswordRequest | undefined>,
    ) => {
      setOperationLoading(state, "forgotPassword");
    },
    forgotPasswordSuccess: (
      state,
      action: PayloadAction<{ message: string }>,
    ) => {
      state.loading.forgotPassword = false;
      state.successMessage = action.payload.message;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "forgotPassword", action.payload);
    },

    clearAuthError: (
      state,
      action: PayloadAction<AuthOperation | undefined>,
    ) => {
      if (action.payload) {
        state.errors[action.payload] = null;
        return;
      }

      state.errors = { ...initialErrors };
    },
    clearAuthMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
