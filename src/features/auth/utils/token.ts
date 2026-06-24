import { AUTH_STORAGE_KEYS } from "../constants/authConstants";
import type { AuthTokens, AuthUser } from "../store/authTypes";

type AuthStorageType = "local" | "session";

const canUseStorage = () =>
  typeof window !== "undefined" && !!window.localStorage && !!window.sessionStorage;

const getAuthStorage = (storageType: AuthStorageType) => {
  return storageType === "local" ? localStorage : sessionStorage;
};

const getActiveAuthStorageType = (): AuthStorageType => {
  if (!canUseStorage()) return "local";

  return sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    ? "session"
    : "local";
};

const getActiveAuthStorage = () => getAuthStorage(getActiveAuthStorageType());

export const getStoredAccessToken = () => {
  if (!canUseStorage()) return null;
  return (
    localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ??
    sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
  );
};

export const getStoredRefreshToken = () => {
  if (!canUseStorage()) return null;
  return (
    localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ??
    sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  );
};

export const getStoredUser = (): AuthUser | null => {
  if (!canUseStorage()) return null;

  const storage = getActiveAuthStorage();
  const rawUser = storage.getItem(AUTH_STORAGE_KEYS.USER);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEYS.USER);
    return null;
  }
};

export const setAuthTokens = (
  { accessToken, refreshToken }: AuthTokens,
  rememberMe = getActiveAuthStorageType() === "local",
) => {
  if (!canUseStorage()) return;
  const storage = rememberMe ? localStorage : sessionStorage;

  const tokenToStore = refreshToken || getStoredRefreshToken();

  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  storage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (tokenToStore) {
    storage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokenToStore);
  }
};

export const setStoredUser = (
  user: AuthUser,
  rememberMe = getActiveAuthStorageType() === "local",
) => {
  if (!canUseStorage()) return;
  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuthStorage = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};
