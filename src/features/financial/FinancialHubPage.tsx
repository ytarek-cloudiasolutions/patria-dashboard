import { useMemo, useState } from "react";
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
  INITIAL_TRANSACTIONS,
  PERFORMANCE_INDICATORS,
  REVENUES_VS_EXPENSES_BREAKDOWN,
} from "./data";
import type {
  FinancialTab,
  FinancialTransaction,
  TransactionCategory,
  TransactionFormData,
} from "./types";

const formatPercent = (value: number) =>
  `${value.toFixed(1)}%`;

const FinancialHubPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<FinancialTab>("overview");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(
    INITIAL_TRANSACTIONS,
  );
  const [isAddOpen, setIsAddOpen] = useState(false);

  const overview = useMemo(() => {
    const revenue = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netProfit = revenue - expenses;
    const profitMargin = revenue === 0 ? 0 : (netProfit / revenue) * 100;

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      profitMargin,
    };
  }, [transactions]);

  const expenseTransactions = useMemo(
    () =>
      transactions.filter(
        (t) => t.type === "Expense" || t.category === "Sales",
      ),
    [transactions],
  );

  const salaryTransactions = useMemo(
    () => transactions.filter((t) => t.classifiedAsSalary),
    [transactions],
  );

  const handleAddTransaction = (data: TransactionFormData) => {
    const amount = Number(data.amount) || 0;
    const newTransaction: FinancialTransaction = {
      id: Date.now(),
      statement: data.statement.trim(),
      category: data.category as TransactionCategory,
      amount: data.type === "Expense" ? -Math.abs(amount) : Math.abs(amount),
      type: data.type,
      date: data.date
        ? new Date(data.date).toLocaleDateString("en-US")
        : new Date().toLocaleDateString("en-US"),
      status: "Registered",
      classifiedAsSalary: data.classifyAsSalary,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
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
        totalRevenue={overview.totalRevenue}
        totalExpenses={overview.totalExpenses}
        netProfit={overview.netProfit}
        profitMargin={formatPercent(overview.profitMargin)}
      />

      <FinancialTabs active={tab} onChange={setTab} />

      {tab === "overview" ? (
        <>
          <RevenueExpenseBar
            revenue={overview.totalRevenue + overview.totalExpenses}
            expenses={overview.totalRevenue + overview.totalExpenses}
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
