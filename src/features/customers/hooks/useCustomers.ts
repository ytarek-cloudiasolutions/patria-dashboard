import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { customersActions } from "../store/customersSlice";
import type { GetCustomersRequest, UpdateCustomerRequest } from "../store/customerTypes";

export const useCustomers = () => {
  const dispatch = useDispatch();

  const customers = useSelector((state: RootState) => state.customers.customers);
  const stats = useSelector((state: RootState) => state.customers.stats);
  const pagination = useSelector((state: RootState) => state.customers.pagination);
  const loading = useSelector((state: RootState) => state.customers.loading);
  const errors = useSelector((state: RootState) => state.customers.errors);
  const successMessage = useSelector((state: RootState) => state.customers.successMessage);

  const getCustomersList = useCallback(
    (params?: GetCustomersRequest) => {
      dispatch(customersActions.getCustomersRequest(params));
    },
    [dispatch],
  );

  const getCustomerStats = useCallback(() => {
    dispatch(customersActions.getCustomerStatsRequest());
  }, [dispatch]);

  const updateCustomerInfo = useCallback(
    (id: string, data: UpdateCustomerRequest) => {
      dispatch(customersActions.updateCustomerRequest({ id, data }));
    },
    [dispatch],
  );

  const deleteCustomerInfo = useCallback(
    (id: string) => {
      dispatch(customersActions.deleteCustomerRequest({ id }));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(customersActions.clearCustomersMessages());
  }, [dispatch]);

  return {
    customers,
    stats,
    pagination,
    loading,
    errors,
    successMessage,
    getCustomersList,
    getCustomerStats,
    updateCustomerInfo,
    deleteCustomerInfo,
    clearMessages,
  };
};
export default useCustomers;
