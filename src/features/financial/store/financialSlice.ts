import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  FinancialState,
  FinancialOperation,
  FinancialLoadingState,
  FinancialErrorState,
  FinancialOverview,
  FinancialOverviewResponse,
  Transaction,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
} from "./financialTypes";

const initialLoading: FinancialLoadingState = {
  fetchOverview: false,
  fetchTransactions: false,
  createTransaction: false,
};

const initialErrors: FinancialErrorState = {
  fetchOverview: null,
  fetchTransactions: null,
  createTransaction: null,
};

const initialState: FinancialState = {
  overview: null,
  transactions: [],
  loading: initialLoading,
  errors: initialErrors,
  successMessage: null,
};

const setOperationLoading = (
  state: FinancialState,
  operation: FinancialOperation,
) => {
  state.loading[operation] = true;
  state.errors[operation] = null;
  state.successMessage = null;
};

const setOperationFailure = (
  state: FinancialState,
  operation: FinancialOperation,
  error: string,
) => {
  state.loading[operation] = false;
  state.errors[operation] = error;
};

const financialSlice = createSlice({
  name: "financial",
  initialState,
  reducers: {
    getFinancialOverviewRequest: (state) => {
      setOperationLoading(state, "fetchOverview");
    },
    getFinancialOverviewSuccess: (
      state,
      action: PayloadAction<FinancialOverviewResponse>,
    ) => {
      state.loading.fetchOverview = false;
      state.overview = {
        totalRevenue: action.payload.totalRevenue ?? 0,
        totalExpenses: action.payload.totalExpenses ?? 0,
        netProfit: action.payload.netProfit ?? 0,
        // Backend sends profitMargin as a string like "5.23%" — parseFloat handles both string and number
        profitMargin: parseFloat(String(action.payload.profitMargin)) || 0,
        totalInventoryValue: action.payload.totalInventoryValue ?? 0,
        lowStockItems: action.payload.lowStockItems ?? 0,
        outOfStock: action.payload.outOfStock ?? 0,
        costOfWasteMonthly: action.payload.costOfWasteMonthly ?? 0,
      };
    },
    getFinancialOverviewFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchOverview", action.payload);
    },

    getTransactionsRequest: (state) => {
      setOperationLoading(state, "fetchTransactions");
    },
    getTransactionsSuccess: (
      state,
      action: PayloadAction<GetTransactionsResponse>,
    ) => {
      state.loading.fetchTransactions = false;
      state.transactions = action.payload.transactions ?? [];
    },
    getTransactionsFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "fetchTransactions", action.payload);
    },

    createTransactionRequest: (
      state,
      _action: PayloadAction<CreateTransactionRequest>,
    ) => {
      setOperationLoading(state, "createTransaction");
    },
    createTransactionSuccess: (
      state,
      action: PayloadAction<{ transaction: Transaction; message?: string }>,
    ) => {
      state.loading.createTransaction = false;
      state.transactions.unshift(action.payload.transaction);
      state.successMessage = action.payload.message ?? "Transaction added successfully";
    },
    createTransactionFailure: (state, action: PayloadAction<string>) => {
      setOperationFailure(state, "createTransaction", action.payload);
    },

    clearFinancialMessages: (state) => {
      state.successMessage = null;
      state.errors = { ...initialErrors };
    },
  },
});

export const financialActions = financialSlice.actions;
export const financialReducer = financialSlice.reducer;
export default financialReducer;
