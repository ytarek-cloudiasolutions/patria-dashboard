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

export interface ApplyDiscountResponseData {
  status: "applied" | "pending";
  order?: {
    orderId?: string;
    discountValue?: number;
    discountAmount?: number;
    total?: number;
    [key: string]: any;
  };
  request?: {
    _id?: string;
    id?: string;
    status?: string;
    [key: string]: any;
  };
}

export interface ApplyCashierDiscountResponse {
  data: ApplyDiscountResponseData;
  message?: string;
}

export interface DiscountApprovalRequestItem {
  _id?: string;
  id?: string;
  status: "pending" | "approved" | "rejected";
  discountId?: string;
  discountName?: string;
  discountValue?: number;
  discount?: {
    _id?: string;
    id?: string;
    name?: string;
    value?: number;
  };
  requestedBy?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  orderId?:
    | {
        _id?: string;
        id?: string;
        orderId?: string;
        total?: number;
      }
    | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetDiscountRequestsResponse {
  requests: DiscountApprovalRequestItem[];
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

  /**
   * GET /cashier-discounts/requests
   * Lists pending, approved, or rejected discount requests (Requires ADMIN, MANAGER, or SUPER_ADMIN).
   */
  getDiscountRequests: async (
    status: "pending" | "approved" | "rejected" = "pending"
  ): Promise<DiscountApprovalRequestItem[]> => {
    const response = await api.get<GetDiscountRequestsResponse | DiscountApprovalRequestItem[]>(
      "/cashier-discounts/requests",
      { params: { status } }
    );
    const data: any = response.data;
    return data?.requests || (Array.isArray(data) ? data : []);
  },

  /**
   * POST /cashier-discounts/{id}/apply
   * Applies preset or creates pending approval request depending on user role and requiresApproval flag.
   */
  applyCashierDiscount: async (
    presetId: string,
    orderId?: string
  ): Promise<ApplyDiscountResponseData> => {
    const response = await api.post<ApplyCashierDiscountResponse>(
      `/cashier-discounts/${presetId}/apply`,
      orderId ? { orderId } : {}
    );
    return response.data?.data || (response.data as any);
  },

  /**
   * POST /cashier-discounts/requests/{id}/approve
   * Approves a pending discount request (Requires ADMIN, MANAGER, or SUPER_ADMIN).
   */
  approveDiscountRequest: async (requestId: string): Promise<any> => {
    const response = await api.post(`/cashier-discounts/requests/${requestId}/approve`);
    return response.data;
  },

  /**
   * POST /cashier-discounts/requests/{id}/reject
   * Rejects a pending discount request (Requires ADMIN, MANAGER, or SUPER_ADMIN).
   */
  rejectDiscountRequest: async (
    requestId: string,
    reason: string = "Discount not authorized for this order"
  ): Promise<any> => {
    const response = await api.post(`/cashier-discounts/requests/${requestId}/reject`, {
      reason,
    });
    return response.data;
  },

  /**
   * POST /cashier-discounts/requests/{id}/cancel
   * Cancels a pending discount request (withdrawn by the requester or manager).
   */
  cancelDiscountRequest: async (requestId: string): Promise<any> => {
    const response = await api.post(`/cashier-discounts/requests/${requestId}/cancel`);
    return response.data;
  },

  /**
   * GET /cashier-discounts/requests/mine
   * List the current cashier's own discount requests still needing attention (pending, or resolved-but-unseen).
   */
  getMyDiscountRequests: async (): Promise<DiscountApprovalRequestItem[]> => {
    const response = await api.get<GetDiscountRequestsResponse | DiscountApprovalRequestItem[]>(
      "/cashier-discounts/requests/mine"
    );
    const data: any = response.data;
    return data?.requests || (Array.isArray(data) ? data : []);
  },

  /**
   * POST /cashier-discounts/requests/{id}/acknowledge
   * Acknowledges a resolved discount request so it no longer appears in the cashier's pending panel.
   */
  acknowledgeDiscountRequest: async (requestId: string): Promise<any> => {
    const response = await api.post(`/cashier-discounts/requests/${requestId}/acknowledge`);
    return response.data;
  },
};

export default cashierDiscountsApi;
