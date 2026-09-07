import { api } from "@/config/api";

export interface CashierDiscountItem {
  _id?: string;
  id?: string;
  name: string;
  value: number;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCashierDiscountsResponse {
  discounts: CashierDiscountItem[];
}

export interface CreateCashierDiscountRequest {
  name: string;
  value: number;
  requiresApproval: boolean;
}

export interface UpdateCashierDiscountRequest {
  isActive?: boolean;
  name?: string;
  value?: number;
  requiresApproval?: boolean;
}

export const cashierDiscountsApi = {
  getCashierDiscounts: async (): Promise<CashierDiscountItem[]> => {
    const response = await api.get<GetCashierDiscountsResponse>("/cashier-discounts");
    return response.data?.discounts || [];
  },

  createCashierDiscount: async (
    data: CreateCashierDiscountRequest
  ): Promise<CashierDiscountItem> => {
    const response = await api.post<{ discount?: CashierDiscountItem } | CashierDiscountItem>(
      "/cashier-discounts",
      data
    );
    const result = (response.data as any)?.discount || response.data;
    return result;
  },

  updateCashierDiscount: async (
    id: string,
    data: UpdateCashierDiscountRequest
  ): Promise<CashierDiscountItem> => {
    const response = await api.patch<{ discount?: CashierDiscountItem } | CashierDiscountItem>(
      `/cashier-discounts/${id}`,
      data
    );
    const result = (response.data as any)?.discount || response.data;
    return result;
  },

  deleteCashierDiscount: async (id: string): Promise<void> => {
    await api.delete(`/cashier-discounts/${id}`);
  },
};

export default cashierDiscountsApi;
