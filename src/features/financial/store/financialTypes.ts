export type TransactionType = "income" | "expense" | "salary";

export interface FinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalInventoryValue?: number;
  lowStockItems?: number;
  outOfStock?: number;
  costOfWasteMonthly?: number;
}

export interface Transaction {
  _id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category?: string;
  reference?: string;
  createdAt?: string;
}

export interface FinancialOverviewResponse extends FinancialOverview {}

export interface GetTransactionsResponse {
  transactions: Transaction[];
}

export interface CreateTransactionRequest {
  type: "income" | "expense";
  amount: number;
  statement?: string;
  description?: string;
  category?: string;
  date?: string;
}

export interface CreateTransactionResponse {
  transaction: Transaction;
}

export type FinancialOperation = "fetchOverview" | "fetchTransactions" | "createTransaction";

export interface FinancialLoadingState {
  fetchOverview: boolean;
  fetchTransactions: boolean;
  createTransaction: boolean;
}

export interface FinancialErrorState {
  fetchOverview: string | null;
  fetchTransactions: string | null;
  createTransaction: string | null;
}

export interface FinancialState {
  overview: FinancialOverview | null;
  transactions: Transaction[];
  loading: FinancialLoadingState;
  errors: FinancialErrorState;
  successMessage: string | null;
}
