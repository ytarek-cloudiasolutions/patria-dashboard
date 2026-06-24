import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ENV } from "./env";
import {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  setAuthTokens,
} from "@/features/auth/utils/token";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/authConstants";
import type { RefreshTokenResponse } from "@/features/auth/store/authTypes";

// Lazy imports to break the circular dependency:
// store.ts → rootSaga → authSaga → authApi → api.ts → store.ts
// These modules are only needed at runtime when a 401 is intercepted,
// at which point all modules have finished initializing.
const getStore = () => import("@/app/store").then((m) => m.store);
const getAuthActions = () =>
  import("@/features/auth/store/authSlice").then((m) => m.authActions);

// Extend Axios config to support the _retry flag for the interceptor
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: ENV.API_URL,
});

// ── Request interceptor: attach access token ──────────────────────────
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: automatic token refresh on 401 ──────────────
// Endpoints that should never trigger a token refresh (to avoid loops)
const AUTH_SKIP_URLS = [
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.REGISTER,
  AUTH_ENDPOINTS.REFRESH,
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((pending) => {
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // If there's no config (e.g. network error) or it's not a 401, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for auth endpoints (prevents infinite loops)
    if (AUTH_SKIP_URLS.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // Don't retry a request that has already been retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    // Mark this request so it won't be retried again
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      // No refresh token available — log out immediately
      isRefreshing = false;
      processQueue(error);
      clearAuthStorage();
      const [appStore, actions] = await Promise.all([
        getStore(),
        getAuthActions(),
      ]);
      appStore.dispatch(
        actions.refreshFailure("Session expired. Please sign in again."),
      );
      window.location.href = "/sign-in";
      return Promise.reject(error);
    }

    try {
      // Use a raw axios call (not the `api` instance) to avoid retriggering
      // this interceptor on the refresh request itself
      const response = await axios.post<RefreshTokenResponse>(
        `${ENV.API_URL}${AUTH_ENDPOINTS.REFRESH}`,
        { refreshToken },
      );

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = response.data.data;

      // Persist the new tokens to storage
      setAuthTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || refreshToken,
      });

      // Sync the Redux store
      const [appStore, actions] = await Promise.all([
        getStore(),
        getAuthActions(),
      ]);
      appStore.dispatch(
        actions.refreshSuccess({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
          message: response.data.message,
        }),
      );

      // Resolve all queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — the refresh token is invalid/expired
      processQueue(refreshError);
      clearAuthStorage();
      const [appStore, actions] = await Promise.all([
        getStore(),
        getAuthActions(),
      ]);
      appStore.dispatch(
        actions.refreshFailure("Session expired. Please sign in again."),
      );
      window.location.href = "/sign-in";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
