import type { RootState } from "@/app/store";

export const selectFinancialState = (state: RootState) => state.financial;

export const selectFinancialOverview = (state: RootState) => state.financial.overview;
export const selectTransactions = (state: RootState) => state.financial.transactions;
export const selectFinancialLoading = (state: RootState) => state.financial.loading;
export const selectFinancialErrors = (state: RootState) => state.financial.errors;
export const selectFinancialSuccessMessage = (state: RootState) => state.financial.successMessage;

export const selectIsFetchingOverview = (state: RootState) => state.financial.loading.fetchOverview;
export const selectIsFetchingTransactions = (state: RootState) => state.financial.loading.fetchTransactions;
export const selectIsCreatingTransaction = (state: RootState) => state.financial.loading.createTransaction;

export const selectFetchOverviewError = (state: RootState) => state.financial.errors.fetchOverview;
export const selectFetchTransactionsError = (state: RootState) => state.financial.errors.fetchTransactions;
export const selectCreateTransactionError = (state: RootState) => state.financial.errors.createTransaction;
