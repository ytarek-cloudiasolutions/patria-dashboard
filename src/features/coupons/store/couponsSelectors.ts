import type { RootState } from "@/app/store";

export const selectCouponsState = (state: RootState) => state.coupons;

export const selectCoupons = (state: RootState) => state.coupons.coupons;
export const selectCouponsPagination = (state: RootState) => state.coupons.pagination;
export const selectCouponsLoading = (state: RootState) => state.coupons.loading;
export const selectCouponsErrors = (state: RootState) => state.coupons.errors;
export const selectCouponsSuccessMessage = (state: RootState) => state.coupons.successMessage;

export const selectIsFetchingCoupons = (state: RootState) => state.coupons.loading.fetch;
export const selectIsCreatingCoupon = (state: RootState) => state.coupons.loading.create;
export const selectIsUpdatingCoupon = (state: RootState) => state.coupons.loading.update;
export const selectIsDeletingCoupon = (state: RootState) => state.coupons.loading.delete;

export const selectFetchCouponsError = (state: RootState) => state.coupons.errors.fetch;
export const selectCreateCouponError = (state: RootState) => state.coupons.errors.create;
export const selectUpdateCouponError = (state: RootState) => state.coupons.errors.update;
export const selectDeleteCouponError = (state: RootState) => state.coupons.errors.delete;
