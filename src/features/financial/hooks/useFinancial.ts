import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { financialActions } from "../store/financialSlice";
import {
  selectFinancialOverview,
  selectTransactions,
  selectFinancialLoading,
  selectFinancialErrors,
  selectFinancialSuccessMessage,
} from "../store/financialSelectors";
import type { CreateTransactionRequest } from "../store/financialTypes";

export const useFinancial = () => {
  const dispatch = useDispatch();

  const overview = useSelector(selectFinancialOverview);
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectFinancialLoading);
  const errors = useSelector(selectFinancialErrors);
  const successMessage = useSelector(selectFinancialSuccessMessage);

  const getOverview = useCallback(() => {
    dispatch(financialActions.getFinancialOverviewRequest());
  }, [dispatch]);

  const getTransactions = useCallback(() => {
    dispatch(financialActions.getTransactionsRequest());
  }, [dispatch]);

  const createTransaction = useCallback(
    (data: CreateTransactionRequest) => {
      dispatch(financialActions.createTransactionRequest(data));
    },
    [dispatch],
  );

  const clearMessages = useCallback(() => {
    dispatch(financialActions.clearFinancialMessages());
  }, [dispatch]);

  return {
    overview,
    transactions,
    loading,
    errors,
    successMessage,
    getOverview,
    getTransactions,
    createTransaction,
    clearMessages,
  };
};

export default useFinancial;
