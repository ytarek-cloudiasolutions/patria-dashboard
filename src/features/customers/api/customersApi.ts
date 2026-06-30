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

export const customersApi = {
  getCustomers,
  getCustomerStats,
  updateCustomer,
  deleteCustomer,
};
export default customersApi;
