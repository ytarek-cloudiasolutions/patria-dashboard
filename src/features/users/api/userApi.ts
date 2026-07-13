import { api } from "@/config/api";
import { USER_ENDPOINTS } from "../constants/userConstants";
import type {
  GetUsersResponse,
  CreateUserRequest,
} from "../store/userTypes";

export const getUsers = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get<GetUsersResponse>(
    USER_ENDPOINTS.ALL_USERS,
    { params },
  );
  return response.data;
};

export const createUser = async (data: CreateUserRequest) => {
  const response = await api.post<{ user: any }>(
    USER_ENDPOINTS.USERS,
    data,
  );
  return response.data;
};

export const updateUser = async (id: string, data: Partial<CreateUserRequest>) => {
  const response = await api.put<{ user: any }>(
    USER_ENDPOINTS.USER_BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete<{ message: string }>(
    USER_ENDPOINTS.USER_BY_ID(id),
  );
  return response.data;
};

export const userApi = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
export default userApi;
