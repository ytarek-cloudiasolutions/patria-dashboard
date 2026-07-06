import { all, call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshAuthToken,
  register,
} from "../api/authApi";
import { getAuthErrorMessage } from "../utils/authHelpers";
import { clearAuthStorage, setAuthTokens, setStoredUser } from "../utils/token";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { selectRefreshToken } from "./authSelectors";
import { authActions } from "./authSlice";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "./authTypes";

function* handleRegister(action: PayloadAction<RegisterRequest>) {
  try {
    const response: RegisterResponse = yield call(register, action.payload);
    const rememberMe = action.payload.rememberMe ?? true;

    const data = response.data || response;
    yield call(setAuthTokens, data, rememberMe);
    yield call(setStoredUser, data.user, rememberMe);
    yield call(showSuccessToast, response.message || "Registration successful");
    yield put(
      authActions.registerSuccess({
        ...data,
        message: response.message || "Registration successful",
      }),
    );
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.registerFailure(errorMessage));
  }
}

function* handleLogin(action: PayloadAction<LoginRequest>) {
  try {
    const response: LoginResponse = yield call(login, action.payload);
    const rememberMe = action.payload.rememberMe ?? false;

    const data = response.data || response;
    yield call(setAuthTokens, data, rememberMe);
    yield call(setStoredUser, data.user, rememberMe);
    yield call(showSuccessToast, response.message || "Login successful");
    yield put(
      authActions.loginSuccess({
        ...data,
        message: response.message || "Login successful",
      }),
    );
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.loginFailure(errorMessage));
  }
}

function* handleRefresh(action: PayloadAction<RefreshTokenRequest | undefined>) {
  try {
    const storedRefreshToken: string | null = yield select(selectRefreshToken);
    const token = action.payload?.refreshToken ?? storedRefreshToken;

    if (!token) {
      throw new Error("Refresh token is missing");
    }

    const response: RefreshTokenResponse = yield call(refreshAuthToken, {
      refreshToken: token,
    });

    const data = response.data || response;
    yield call(setAuthTokens, data);
    yield call(showSuccessToast, response.message || "Token refreshed");
    yield put(
      authActions.refreshSuccess({
        ...data,
        message: response.message || "Token refreshed",
      }),
    );
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(clearAuthStorage);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.refreshFailure(errorMessage));
  }
}

function* handleLogout() {
  try {
    const response: LogoutResponse = yield call(logout);

    yield call(clearAuthStorage);
    yield call(showSuccessToast, response.message);
    yield put(authActions.logoutSuccess({ message: response.message }));
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(clearAuthStorage);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.logoutFailure(errorMessage));
  }
}

function* handleGetMe() {
  try {
    const response: GetMeResponse = yield call(getMe);

    const user = response.data || response;
    yield call(setStoredUser, user);
    yield call(showSuccessToast, response.message || "User details loaded");
    yield put(
      authActions.getMeSuccess({
        user,
        message: response.message || "User details loaded",
      }),
    );
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(clearAuthStorage);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.getMeFailure(errorMessage));
  }
}

function* handleForgotPassword(
  action: PayloadAction<ForgotPasswordRequest | undefined>,
) {
  try {
    const response: ForgotPasswordResponse = yield call(
      forgotPassword,
      action.payload,
    );

    yield call(showSuccessToast, response.message);
    yield put(
      authActions.forgotPasswordSuccess({
        message: response.message,
      }),
    );
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(authActions.forgotPasswordFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(authActions.registerRequest.type, handleRegister),
    takeLatest(authActions.loginRequest.type, handleLogin),
    takeLatest(authActions.refreshRequest.type, handleRefresh),
    takeLatest(authActions.logoutRequest.type, handleLogout),
    takeLatest(authActions.getMeRequest.type, handleGetMe),
    takeLatest(authActions.forgotPasswordRequest.type, handleForgotPassword),
  ]);
}
