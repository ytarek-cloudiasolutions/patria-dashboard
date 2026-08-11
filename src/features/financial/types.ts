export type FinancialTab =
  | "accountant-dashboard"
  | "expenses"
  | "inventory-count"
  | "adjustments-wastage"
  | "opening-balance"
  | "item-balance"
  | "item-stock-record"
  | "reorder"
  | "cost-analysis"
  | "consumption";

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

export interface InventoryCountSession {
  id: string;
  number: string;
  warehouse: string;
  date: string;
  status: "In Progress" | "Completed";
  noOfItems: number;
}

export interface AdjustmentWastageRecord {
  id: string;
  number: string;
  type: string;
  warehouse: string;
  date: string;
  value: string | number;
  noOfItems: number;
  status: string;
}

export interface OpeningBalanceRecord {
  id: string;
  number: string;
  warehouse: string;
  periodStart: string;
  totalValue: number;
  noOfItems: number;
  status: "Draft" | "Confirmed";
}

export interface ReorderItem {
  id: string;
  name: string;
  currentInventory: number;
  orderLimit: number;
  shortage: number;
  supplier: string;
  status: "Out of Stock" | "Sufficient stock" | "Low";
}

export interface CategoryCostBreakdown {
  id: string;
  category: string;
  totalValue: number;
  itemCount: number;
}

export interface CostAnalysisRow {
  id: string;
  item: string;
  cost: number;
  sellingPrice: number;
  balance: number;
  inventoryValue: number;
  profitMargin: string;
}

export interface ConsumptionRow {
  id: string;
  item: string;
  sales: number;
  waste: number;
  production: number;
  total: number;
  cost: number;
  income: number;
  profit: number;
}
