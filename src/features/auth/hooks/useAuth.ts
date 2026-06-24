import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectAuthErrors,
  selectAuthLoading,
  selectAuthState,
  selectAuthSuccessMessage,
  selectAuthUser,
  selectIsAuthenticated,
} from "../store/authSelectors";
import { authActions } from "../store/authSlice";
import type {
  AuthOperation,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../store/authTypes";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuthState);
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const errors = useSelector(selectAuthErrors);
  const successMessage = useSelector(selectAuthSuccessMessage);

  const register = useCallback(
    (payload: RegisterRequest) => {
      dispatch(authActions.registerRequest(payload));
    },
    [dispatch],
  );

  const login = useCallback(
    (payload: LoginRequest) => {
      dispatch(authActions.loginRequest(payload));
    },
    [dispatch],
  );

  const refresh = useCallback(
    (payload?: RefreshTokenRequest) => {
      dispatch(authActions.refreshRequest(payload));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(authActions.logoutRequest());
  }, [dispatch]);

  const getMe = useCallback(() => {
    dispatch(authActions.getMeRequest());
  }, [dispatch]);

  const forgotPassword = useCallback(
    (payload?: ForgotPasswordRequest) => {
      dispatch(authActions.forgotPasswordRequest(payload));
    },
    [dispatch],
  );

  const clearAuthError = useCallback(
    (operation?: AuthOperation) => {
      dispatch(authActions.clearAuthError(operation));
    },
    [dispatch],
  );

  const clearAuthMessages = useCallback(() => {
    dispatch(authActions.clearAuthMessages());
  }, [dispatch]);

  return {
    ...auth,
    user,
    isAuthenticated,
    loading,
    errors,
    successMessage,
    register,
    login,
    refresh,
    logout,
    getMe,
    forgotPassword,
    clearAuthError,
    clearAuthMessages,
    isRegisterLoading: loading.register,
    isLoginLoading: loading.login,
    isRefreshLoading: loading.refresh,
    isLogoutLoading: loading.logout,
    isGetMeLoading: loading.me,
    isForgotPasswordLoading: loading.forgotPassword,
  };
};
