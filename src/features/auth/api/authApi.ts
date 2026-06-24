import { api } from "@/config/api";
import { AUTH_ENDPOINTS } from "../constants/authConstants";
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
} from "../store/authTypes";

export const register = async (payload: RegisterRequest) => {
  const requestPayload = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
  };
  const response = await api.post<RegisterResponse>(
    AUTH_ENDPOINTS.REGISTER,
    requestPayload,
  );
  return response.data;
};

export const login = async (payload: LoginRequest) => {
  const requestPayload = {
    email: payload.email,
    password: payload.password,
  };
  const response = await api.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    requestPayload,
  );
  return response.data;
};

export const refreshAuthToken = async (payload: RefreshTokenRequest) => {
  const response = await api.post<RefreshTokenResponse>(
    AUTH_ENDPOINTS.REFRESH,
    payload,
  );
  return response.data;
};

export const logout = async () => {
  const response = await api.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<GetMeResponse>(AUTH_ENDPOINTS.ME);
  return response.data;
};

export const forgotPassword = async (payload?: ForgotPasswordRequest) => {
  const response = await api.post<ForgotPasswordResponse>(
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload ?? {},
  );
  return response.data;
};

export const authApi = {
  register,
  login,
  refreshAuthToken,
  logout,
  getMe,
  forgotPassword,
};
