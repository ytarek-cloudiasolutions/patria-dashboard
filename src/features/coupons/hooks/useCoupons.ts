import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { couponsActions } from "../store/couponsSlice";
import {
  selectCoupons,
  selectCouponsPagination,
  selectCouponsLoading,
  selectCouponsErrors,
  selectCouponsSuccessMessage,
} from "../store/couponsSelectors";
import type {
  GetCouponsRequest,
  CreateCouponRequest,
  UpdateCouponRequest,
} from "../store/couponTypes";

export const useCoupons = () => {
  const dispatch = useDispatch();

  const coupons = useSelector(selectCoupons);
  const pagination = useSelector(selectCouponsPagination);
  const loading = useSelector(selectCouponsLoading);
  const errors = useSelector(selectCouponsErrors);
  const successMessage = useSelector(selectCouponsSuccessMessage);

  const getCouponsList = useCallback(
    (params?: GetCouponsRequest) => {
      dispatch(couponsActions.getCouponsRequest(params));
    },
    [dispatch],
  );

  const createCoupon = useCallback(
    (data: CreateCouponRequest) => {
      dispatch(couponsActions.createCouponRequest(data));
    },
    [dispatch],
  );

  const updateCoupon = useCallback(
    (id: string, data: UpdateCouponRequest) => {
      dispatch(couponsActions.updateCouponRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteCoupon = useCallback(
    (id: string) => {
      dispatch(couponsActions.deleteCouponRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(couponsActions.clearCouponsMessages());
  }, [dispatch]);

  return {
    coupons,
    pagination,
    loading,
    errors,
    successMessage,
    getCouponsList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    clearMessages,
  };
};

export default useCoupons;
