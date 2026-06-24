import type { RootState } from "@/app/store";
import type { AuthOperation } from "./authTypes";

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state: RootState) => state.auth.loading;

export const selectAuthErrors = (state: RootState) => state.auth.errors;

export const selectAuthSuccessMessage = (state: RootState) =>
  state.auth.successMessage;

export const selectIsAuthOperationLoading =
  (operation: AuthOperation) => (state: RootState) =>
    state.auth.loading[operation];

export const selectAuthOperationError =
  (operation: AuthOperation) => (state: RootState) =>
    state.auth.errors[operation];

export const selectUserRole = (state: RootState) => state.auth.user?.role;
