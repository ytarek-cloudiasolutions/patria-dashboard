import { api } from "@/config/api";
import { CUSTOMER_ENDPOINTS } from "../constants/customerConstants";
import type {
  GetCustomersRequest,
  GetCustomersResponse,
  CustomerStats,
  UpdateCustomerRequest,
} from "../store/customerTypes";

export const getCustomers = async (params?: GetCustomersRequest) => {
  const response = await api.get<GetCustomersResponse>(
    CUSTOMER_ENDPOINTS.CUSTOMERS,
    { params },
  );
  return response.data;
};

export const getCustomerStats = async () => {
  const response = await api.get<{ stats: CustomerStats }>(
    CUSTOMER_ENDPOINTS.STATS,
  );
  return response.data;
};

export const updateCustomer = async (id: string, data: UpdateCustomerRequest): Promise<unknown> => {
  const response = await api.put<unknown>(
    CUSTOMER_ENDPOINTS.CUSTOMER_BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await api.delete<{ message: string }>(
    CUSTOMER_ENDPOINTS.CUSTOMER_BY_ID(id),
  );
  return response.data;
};

// Invalidates every token already issued to this customer — their app gets
// logged out on its next request instead of staying signed in for up to 30
// more days. Distinct from block/deactivate: this doesn't restrict the
// account, it just ends the current session(s).
export const forceLogoutCustomer = async (id: string) => {
  const response = await api.post<{ message: string }>(
    CUSTOMER_ENDPOINTS.FORCE_LOGOUT(id),
  );
  return response.data;
};

export const customersApi = {
  getCustomers,
  getCustomerStats,
  updateCustomer,
  deleteCustomer,
  forceLogoutCustomer,
};
export default customersApi;
