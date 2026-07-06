import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";

import FinancialOverview from "./components/FinancialOverview";
import FinancialTabs from "./components/FinancialTabs";
import RevenueExpenseBar from "./components/RevenueExpenseBar";
import RevenueBreakdownCard from "./components/RevenueBreakdownCard";
import PerformanceIndicatorsCard from "./components/PerformanceIndicatorsCard";
import TransactionsTable from "./components/TransactionsTable";
import AddTransactionDialog from "./components/AddTransactionDialog";

import {
  PERFORMANCE_INDICATORS,
  REVENUES_VS_EXPENSES_BREAKDOWN,
} from "./data";
import type {
  FinancialTab,
  FinancialTransaction,
  TransactionCategory,
  TransactionFormData,
} from "./types";
import type { Transaction as BackendTransaction } from "./store/financialTypes";
import { useFinancial } from "./hooks/useFinancial";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/** Map a backend transaction category string to a local TransactionCategory */
const mapCategory = (raw?: string): TransactionCategory => {
  if (!raw) return "Other";
  const CATEGORY_MAP: Record<string, TransactionCategory> = {
    salary: "Salary",
    rent: "Rent",
    sales: "Sales",
    utilities: "Utilities",
    marketing: "Marketing",
  };
  return CATEGORY_MAP[raw.toLowerCase()] ?? "Other";
};

/** Map a backend Transaction to the local FinancialTransaction shape */
const mapTransaction = (tx: BackendTransaction): FinancialTransaction => {
  const isSalary = tx.type === "salary";
  const isExpense = tx.type === "expense" || isSalary;

  return {
    id: tx._id,
    statement: tx.description,
    category: mapCategory(tx.category),
    amount: isExpense ? -Math.abs(tx.amount) : Math.abs(tx.amount),
    type: isExpense ? "Expense" : "Income",
    date: new Date(tx.date).toLocaleDateString("en-US"),
    status: "Registered",
    classifiedAsSalary: isSalary,
  };
};

const FinancialHubPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<FinancialTab>("overview");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    overview,
    transactions: backendTransactions,
    getOverview,
    getTransactions,
    createTransaction,
  } = useFinancial();

  useEffect(() => {
    getOverview();
    getTransactions();
  }, [getOverview, getTransactions]);

  // Map backend transactions to local shape for UI components
  const transactions = useMemo(
    () => backendTransactions.map(mapTransaction),
    [backendTransactions],
  );

  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalExpenses = overview?.totalExpenses ?? 0;
  const netProfit = overview?.netProfit ?? 0;
  const profitMargin = overview?.profitMargin ?? 0;

  const expenseTransactions = useMemo(
    () =>
      transactions.filter(
        (tx) => tx.type === "Expense" || tx.category === "Sales",
      ),
    [transactions],
  );

  const salaryTransactions = useMemo(
    () => transactions.filter((tx) => tx.classifiedAsSalary),
    [transactions],
  );

  const handleAddTransaction = (data: TransactionFormData) => {
    const amount = Math.abs(Number(data.amount) || 0);
    const isSalaryExpense = data.type === "Expense" && data.classifyAsSalary;

    createTransaction({
      type: isSalaryExpense ? "salary" : data.type === "Expense" ? "expense" : "income",
      description: data.statement.trim(),
      amount,
      date: data.date || undefined,
      category: data.category || undefined,
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Financial Hub")}
          description={t("Revenue, expense, and profitability management")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-label="Refresh"
            onClick={() => { getOverview(); getTransactions(); }}
            className="flex size-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#FBF6EC] text-primary hover:bg-[#F5F0EA] sm:size-14"
          >
            <RefreshCw className="size-5" />
          </button>
          <DefaultButton
            data={{
              buttonText: t("New Transaction"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddOpen(true),
            }}
          />
        </div>
      </div>

      <FinancialOverview
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={formatPercent(profitMargin)}
      />

      <FinancialTabs active={tab} onChange={setTab} />

      {tab === "overview" ? (
        <>
          <RevenueExpenseBar
            revenue={totalRevenue + totalExpenses}
            expenses={totalRevenue + totalExpenses}
          />

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RevenueBreakdownCard rows={REVENUES_VS_EXPENSES_BREAKDOWN} />
            <PerformanceIndicatorsCard rows={PERFORMANCE_INDICATORS} />
          </div>

          <TransactionsTable transactions={transactions} />
        </>
      ) : tab === "expenses" ? (
        <TransactionsTable transactions={expenseTransactions} showStatus />
      ) : (
        <TransactionsTable transactions={salaryTransactions} showStatus />
      )}

      <AddTransactionDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddTransaction}
      />
    </>
  );
};

export default FinancialHubPage;
