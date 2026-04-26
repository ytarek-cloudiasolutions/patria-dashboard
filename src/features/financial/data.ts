import type { Transaction } from "./types";

export const transactionsData: Transaction[] = [
  {
    id: "txn-001",
    statement: "Employee Salary",
    category: "Salary",
    amount: -20000,
    date: "2026-04-14",
    type: "expense",
    isSalary: true,
    status: "Registered",
  },
  {
    id: "txn-002",
    statement: "Rent",
    category: "Rent",
    amount: -5000,
    date: "2026-04-14",
    type: "expense",
    isSalary: false,
    status: "Registered",
  },
  {
    id: "txn-003",
    statement: "Sales",
    category: "Other",
    amount: 10000,
    date: "2026-04-14",
    type: "income",
    isSalary: false,
    status: "Registered",
  },
];

export const categoryOptions = [
  { value: "Salary", label: "Salary" },
  { value: "Rent", label: "Rent" },
  { value: "Sales", label: "Sales" },
  { value: "Food", label: "Food" },
  { value: "Utilities", label: "Utilities" },
  { value: "Marketing", label: "Marketing" },
  { value: "Other", label: "Other" },
];

export const categoryColorMap: Record<string, string> = {
  Salary: "bg-[#EDE9FE] text-[#6D28D9] border-[#C4B5FD]",
  Rent: "bg-[#FFF0F5] text-[#BE185D] border-[#FBCFE8]",
  Sales: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
  Food: "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]",
  Utilities: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  Marketing: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
  Other: "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB]",
};
