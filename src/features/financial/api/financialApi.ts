import { api } from "@/config/api";
import type {
  FinancialOverviewResponse,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
} from "../store/financialTypes";

export const getFinancialOverview = async () => {
  const response = await api.get<FinancialOverviewResponse>("/financial/overview");
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get<GetTransactionsResponse>("/financial/transactions");
  return response.data;
};

export const createTransaction = async (data: CreateTransactionRequest) => {
  const response = await api.post<CreateTransactionResponse>(
    "/financial/transactions",
    data,
  );
  return response.data;
};

export const financialApi = {
  getFinancialOverview,
  getTransactions,
  createTransaction,
};

export default financialApi;
