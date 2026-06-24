export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/admin/register",
  LOGIN: "/auth/admin/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "authUser",
} as const;
