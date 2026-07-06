export type FinancialTab = "overview" | "expenses" | "salaries";

export type TransactionType = "Income" | "Expense";

export type TransactionCategory =
  | "Salary"
  | "Rent"
  | "Other"
  | "Sales"
  | "Utilities"
  | "Marketing";

export type TransactionStatus = "Registered" | "Pending";

export interface FinancialTransaction {
  id: number;
  statement: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  date: string;
  status: TransactionStatus;
  classifiedAsSalary?: boolean;
}

export interface RevenueBreakdownRow {
  id: string;
  label: string;
  amount: number;
}

export interface PerformanceIndicator {
  id: string;
  label: string;
  amount: number;
  tone: "neutral" | "positive" | "negative";
}

export interface TransactionFormData {
  type: TransactionType;
  statement: string;
  category: TransactionCategory | "";
  amount: string;
  date: string;
  classifyAsSalary: boolean;
}
