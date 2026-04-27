export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "Salary"
  | "Rent"
  | "Sales"
  | "Other"
  | "Food"
  | "Utilities"
  | "Marketing";

export type FinancialTab = "overview" | "expenses" | "salaries";

export interface Transaction {
  id: string;
  statement: string;
  category: TransactionCategory;
  amount: number; // positive = income, negative = expense
  date: string; // ISO date string
  type: TransactionType;
  isSalary?: boolean;
  status: "Registered" | "Pending";
}

export interface FinancialStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface PerformanceIndicator {
  label: string;
  value: number | string;
  prefix?: string;
  isNegative?: boolean;
  icon: string; // lucide icon name
}

export interface NewTransactionForm {
  type: TransactionType;
  statement: string;
  category: TransactionCategory | "";
  amount: number;
  date: string;
  isSalary: boolean;
}