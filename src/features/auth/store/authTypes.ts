export interface ApiResponse<TData> {
  statusCode: number;
  data: TData;
  message: string;
  success: boolean;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSessionData extends AuthTokens {
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email?: string;
}

export type RegisterResponse = ApiResponse<AuthSessionData>;
export type LoginResponse = ApiResponse<AuthSessionData>;
export type RefreshTokenResponse = ApiResponse<AuthTokens>;
export type LogoutResponse = ApiResponse<null>;
export type GetMeResponse = ApiResponse<AuthUser>;
export type ForgotPasswordResponse = ApiResponse<null>;

export type AuthOperation =
  | "register"
  | "login"
  | "refresh"
  | "logout"
  | "me"
  | "forgotPassword";

export type AuthLoadingState = Record<AuthOperation, boolean>;
export type AuthErrorState = Record<AuthOperation, string | null>;

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: AuthLoadingState;
  errors: AuthErrorState;
  successMessage: string | null;
}
