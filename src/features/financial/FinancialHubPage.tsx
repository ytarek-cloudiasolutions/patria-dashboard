import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

import FinancialOverview from "./components/FinancialOverview";
import FinancialTabs from "./components/FinancialTabs";
import RevenueExpenseBar from "./components/RevenueExpenseBar";
import RevenueBreakdownCard from "./components/RevenueBreakdownCard";
import PerformanceIndicatorsCard from "./components/PerformanceIndicatorsCard";
import TransactionsTable from "./components/TransactionsTable";
import AddTransactionDialog from "./components/AddTransactiondialog";

import { REVENUES_VS_EXPENSES_BREAKDOWN, PERFORMANCE_INDICATORS } from "./data";
import type {
  FinancialTab,
  FinancialTransaction,
  TransactionCategory,
  TransactionFormData,
} from "./types";

const mapTransaction = (t: any, idx: number): FinancialTransaction => ({
  id: t._id ?? idx,
  statement: t.statement ?? "—",
  category: (t.category ?? "Other") as TransactionCategory,
  amount: t.type === "expense" || t.type === "salary"
    ? -Math.abs(t.amount ?? 0)
    : Math.abs(t.amount ?? 0),
  type: (t.type === "income" ? "Income" : "Expense") as FinancialTransaction["type"],
  date: t.date
    ? new Date(t.date).toLocaleDateString("en-US")
    : "—",
  status: t.status === "pending" ? "Pending" : "Registered",
  classifiedAsSalary: t.isSalary ?? false,
});

const FinancialHubPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<FinancialTab>("overview");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [apiOverview, setApiOverview] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get("/financial/overview"),
      api.get("/financial/transactions"),
    ])
      .then(([ovRes, txRes]) => {
        const ov = ovRes.data;
        setApiOverview({
          totalRevenue: ov.totalRevenue ?? 0,
          totalExpenses: ov.totalExpenses ?? 0,
          netProfit: ov.netProfit ?? 0,
          profitMargin: typeof ov.profitMargin === "string" ? ov.profitMargin : `${(ov.profitMargin ?? 0).toFixed(1)}%`,
        });
        const raw: any[] = txRes.data?.transactions ?? [];
        setTransactions(raw.map(mapTransaction));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const localOverview = useMemo(() => {
    const revenue = transactions.filter((tx) => tx.type === "Income").reduce((s, tx) => s + tx.amount, 0);
    const expenses = transactions.filter((tx) => tx.type === "Expense").reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const net = revenue - expenses;
    const margin = revenue === 0 ? 0 : (net / revenue) * 100;
    return { totalRevenue: revenue, totalExpenses: expenses, netProfit: net, profitMargin: `${margin.toFixed(1)}%` };
  }, [transactions]);

  const overview = apiOverview ?? localOverview;

  const expenseTransactions = useMemo(
    () => transactions.filter((tx) => tx.type === "Expense" || tx.category === "Sales"),
    [transactions],
  );
  const salaryTransactions = useMemo(
    () => transactions.filter((tx) => tx.classifiedAsSalary),
    [transactions],
  );

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const amount = Number(data.amount) || 0;
      await api.post("/financial/transactions", {
        type: data.type.toLowerCase(),
        statement: data.statement.trim(),
        category: data.category || "Other",
        amount: Math.abs(amount),
        date: data.date || undefined,
        isSalary: data.classifyAsSalary,
      });
      showSuccessToast(t("Transaction added"));
      loadData();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message ?? t("Failed to add transaction"));
    }
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
            onClick={loadData}
            className="flex size-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#FBF6EC] text-primary hover:bg-[#F5F0EA] sm:size-14"
          >
            <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
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
        profitMargin={overview.profitMargin}
      />

      <FinancialTabs active={tab} onChange={setTab} />

      {tab === "overview" ? (
        <>
          <RevenueExpenseBar
            revenue={overview.totalRevenue}
            expenses={overview.totalExpenses}
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
