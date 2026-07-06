import { api } from "@/config/api";
import type {
  GetCouponsResponse,
  GetCouponsRequest,
  CreateCouponRequest,
  UpdateCouponRequest,
} from "../store/couponTypes";

export const getCoupons = async (params?: GetCouponsRequest) => {
  const response = await api.get<GetCouponsResponse>("/coupons", { params });
  return response.data;
};

export const createCoupon = async (data: CreateCouponRequest) => {
  const response = await api.post<{ coupon: Record<string, unknown> }>("/coupons", data);
  return response.data;
};

export const updateCoupon = async (id: string, data: UpdateCouponRequest) => {
  const response = await api.put<{ coupon: Record<string, unknown> }>(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/coupons/${id}`);
  return response.data;
};

export const couponsApi = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};

export default couponsApi;
