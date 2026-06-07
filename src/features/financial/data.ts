import type { FinancialTransaction } from "./types";

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 1,
    statement: "Employee Salary",
    category: "Salary",
    amount: -20000,
    type: "Expense",
    date: "4/14/2026",
    status: "Registered",
    classifiedAsSalary: true,
  },
  {
    id: 2,
    statement: "Rent",
    category: "Rent",
    amount: -5000,
    type: "Expense",
    date: "4/14/2026",
    status: "Registered",
  },
  {
    id: 3,
    statement: "Sales",
    category: "Other",
    amount: 10000,
    type: "Income",
    date: "4/14/2026",
    status: "Registered",
  },
];

export const REVENUES_VS_EXPENSES_BREAKDOWN = [
  { id: "rent", label: "Rent", amount: 5000 },
  { id: "salary", label: "Salary", amount: 20000 },
];

export const PERFORMANCE_INDICATORS = [
  { id: "orders", label: "Total orders", amount: 20, tone: "neutral" as const },
  {
    id: "net-profit",
    label: "Net Profit",
    amount: -2623,
    tone: "negative" as const,
  },
  {
    id: "salaries",
    label: "Salaries",
    amount: 4000,
    tone: "neutral" as const,
  },
  {
    id: "operating-expenses",
    label: "Operating Expenses",
    amount: 5000,
    tone: "neutral" as const,
  },
  {
    id: "avg-order-value",
    label: "Avg. Order Value",
    amount: 219,
    tone: "neutral" as const,
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: "Salary", label: "Salary" },
  { value: "Rent", label: "Rent" },
  { value: "Other", label: "Other" },
  { value: "Sales", label: "Sales" },
  { value: "Utilities", label: "Utilities" },
  { value: "Marketing", label: "Marketing" },
];
