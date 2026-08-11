import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

import FinancialTabs from "./components/FinancialTabs";
import FinancialOverview from "./components/FinancialOverview";
import AccountantDashboardView from "./components/AccountantDashboardView";
import InventoryCountView from "./components/InventoryCountView";
import InventoryDetailView from "./components/InventoryDetailView";
import AdjustmentsWastageView from "./components/AdjustmentsWastageView";
import OpeningBalanceView from "./components/OpeningBalanceView";
import ItemBalanceView from "./components/ItemBalanceView";
import ItemStockRecordView from "./components/ItemStockRecordView";
import ReorderView from "./components/ReorderView";
import CostAnalysisView from "./components/CostAnalysisView";
import ConsumptionView from "./components/ConsumptionView";
import TransactionsTable from "./components/TransactionsTable";
import AddTransactionDialog from "./components/AddTransactiondialog";
import NewInventorySessionDialog from "./components/NewInventorySessionDialog";
import InventoryAdjustmentDialog from "./components/InventoryAdjustmentDialog";
import QuantityAdjustmentDialog from "./components/QuantityAdjustmentDialog";
import WasteVoucherDialog from "./components/WasteVoucherDialog";
import NewPeriodBalanceDialog from "./components/NewPeriodBalanceDialog";

import { INITIAL_TRANSACTIONS } from "./data";
import type {
  FinancialTab,
  FinancialTransaction,
  InventoryCountSession,
  TransactionCategory,
  TransactionFormData,
} from "./types";

import { financialApi } from "./api/financialApi";
import type { CreateTransactionRequest } from "./store/financialTypes";

const mapTransaction = (t: any, idx: number): FinancialTransaction => ({
  id: t._id ?? idx,
  statement: t.description ?? t.statement ?? "—",
  category: (t.category ?? "Other") as TransactionCategory,
  amount:
    t.type === "expense" || t.type === "salary"
      ? -Math.abs(t.amount ?? 0)
      : Math.abs(t.amount ?? 0),
  type: (t.type === "income" ? "Income" : "Expense") as FinancialTransaction["type"],
  date: t.date ? new Date(t.date).toLocaleDateString("en-US") : "—",
  status: t.status === "pending" ? "Pending" : "Registered",
  classifiedAsSalary: t.isSalary ?? false,
});

const FinancialHubPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<FinancialTab>("accountant-dashboard");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [apiOverview, setApiOverview] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInventorySessionOpen, setIsInventorySessionOpen] = useState(false);
  const [isInventoryAdjustmentOpen, setIsInventoryAdjustmentOpen] = useState(false);
  const [isQuantityAdjustmentOpen, setIsQuantityAdjustmentOpen] = useState(false);
  const [isWasteVoucherOpen, setIsWasteVoucherOpen] = useState(false);
  const [adjustmentsRefreshKey, setAdjustmentsRefreshKey] = useState(0);
  const [openingBalanceRefreshKey, setOpeningBalanceRefreshKey] = useState(0);
  const [isNewPeriodBalanceOpen, setIsNewPeriodBalanceOpen] = useState(false);
  const [selectedInventorySession, setSelectedInventorySession] = useState<InventoryCountSession | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (newTab: FinancialTab) => {
    setTab(newTab);
    setSelectedInventorySession(null);
  };

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
          profitMargin:
            typeof ov.profitMargin === "string"
              ? ov.profitMargin
              : `${(ov.profitMargin ?? 0).toFixed(1)}%`,
        });
        const raw: any[] = txRes.data?.transactions ?? [];
        if (raw.length > 0) {
          setTransactions(raw.map(mapTransaction));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const localOverview = useMemo(() => {
    const revenue = transactions
      .filter((tx) => tx.type === "Income")
      .reduce((s, tx) => s + tx.amount, 0);
    const expenses = transactions
      .filter((tx) => tx.type === "Expense")
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const net = revenue - expenses;
    const margin = revenue === 0 ? 0 : (net / revenue) * 100;
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: net,
      profitMargin: `${margin.toFixed(1)}%`,
    };
  }, [transactions]);

  const overview = apiOverview ?? localOverview;

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const amount = Number(data.amount) || 0;
      const statementText = data.statement.trim();
      const payload: CreateTransactionRequest = {
        type: data.type.toLowerCase() === "income" ? "income" : "expense",
        amount: Math.abs(amount),
        statement: statementText,
        description: statementText,
        category: data.category || undefined,
        date: data.date ? new Date(data.date).toISOString() : undefined,
      };
      await financialApi.createTransaction(payload);
      showSuccessToast(t("Transaction added"));
      loadData();
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message ?? t("Failed to add transaction")
      );
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Financial Hub")}
          description={t("Revenue, expense, and profitability management")}
        />
        <div className="flex flex-wrap items-center gap-3">
          {tab !== "adjustments-wastage" && (
            <button
              type="button"
              aria-label="Refresh"
              onClick={loadData}
              className="flex size-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#FBF6EC] text-[#8F6900] hover:bg-[#F5F0EA] sm:size-14"
            >
              <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}

          {tab === "expenses" && (
            <DefaultButton
              data={{
                buttonText: t("New Transaction"),
                icon: <Plus className="size-4.5" />,
                onClick: () => setIsAddOpen(true),
              }}
            />
          )}

          {tab === "inventory-count" && (
            <DefaultButton
              data={{
                buttonText: t("New inventory session"),
                icon: <Plus className="size-4.5" />,
                onClick: () => setIsInventorySessionOpen(true),
              }}
            />
          )}

          {tab === "adjustments-wastage" && (
            <DefaultButton
              data={{
                buttonText: t("Stock Adjustments"),
                icon: <Plus className="size-4.5" />,
                onClick: () => setIsInventoryAdjustmentOpen(true),
              }}
            />
          )}

          {tab === "opening-balance" && (
            <DefaultButton
              data={{
                buttonText: t("New period Balance"),
                icon: <Plus className="size-4.5" />,
                onClick: () => setIsNewPeriodBalanceOpen(true),
              }}
            />
          )}
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <FinancialTabs active={tab} onChange={handleTabChange} />

      {/* Tab Views */}
      {tab === "accountant-dashboard" ? (
        <AccountantDashboardView
          totalRevenue={overview.totalRevenue}
          totalExpenses={overview.totalExpenses}
          netProfit={overview.netProfit}
          profitMargin={overview.profitMargin}
          transactions={transactions}
          onNavigateTab={handleTabChange}
          onOpenAddModal={() => setIsAddOpen(true)}
        />
      ) : tab === "expenses" ? (
        <div className="flex flex-col gap-6">
          <FinancialOverview
            totalRevenue={overview.totalRevenue}
            totalExpenses={overview.totalExpenses}
            netProfit={overview.netProfit}
            profitMargin={overview.profitMargin}
          />
          <TransactionsTable transactions={transactions} />
        </div>
      ) : tab === "inventory-count" ? (
        selectedInventorySession ? (
          <InventoryDetailView
            session={selectedInventorySession}
            onBack={() => setSelectedInventorySession(null)}
          />
        ) : (
          <InventoryCountView
            onSelectSession={(session) => setSelectedInventorySession(session)}
          />
        )
      ) : tab === "adjustments-wastage" ? (
        <AdjustmentsWastageView refreshKey={adjustmentsRefreshKey} />
      ) : tab === "opening-balance" ? (
        <OpeningBalanceView refreshKey={openingBalanceRefreshKey} />
      ) : tab === "item-balance" ? (
        <ItemBalanceView />
      ) : tab === "item-stock-record" ? (
        <ItemStockRecordView />
      ) : tab === "reorder" ? (
        <ReorderView />
      ) : tab === "cost-analysis" ? (
        <CostAnalysisView />
      ) : tab === "consumption" ? (
        <ConsumptionView />
      ) : (
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-12 text-center text-[#8B8B8B]">
          {t("No Data Found")}
        </div>
      )}

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddTransaction}
      />

      {/* New Inventory Session Dialog */}
      <NewInventorySessionDialog
        open={isInventorySessionOpen}
        onOpenChange={setIsInventorySessionOpen}
        onCreateSession={(warehouse) => {
          showSuccessToast(`${t("Created new inventory session for")} ${warehouse}`);
        }}
      />

      {/* Inventory Adjustment Dialog */}
      <InventoryAdjustmentDialog
        open={isInventoryAdjustmentOpen}
        onOpenChange={setIsInventoryAdjustmentOpen}
        onConfirm={async (data) => {
          try {
            await api.post("/inventory/adjustments", data);
            showSuccessToast(t("Inventory adjustment confirmed"));
            setAdjustmentsRefreshKey((k) => k + 1);
          } catch (error: any) {
            showErrorToast(
              error.response?.data?.message || t("Failed to record adjustment"),
            );
          }
        }}
      />

      {/* Quantity Adjustment Dialog */}
      <QuantityAdjustmentDialog
        open={isQuantityAdjustmentOpen}
        onOpenChange={setIsQuantityAdjustmentOpen}
        onConfirm={async (data) => {
          try {
            await api.post("/inventory/adjustments", { ...data, type: "Quantity Adjustment" });
            showSuccessToast(t("Quantity adjustment confirmed"));
            setAdjustmentsRefreshKey((k) => k + 1);
          } catch (error: any) {
            showErrorToast(
              error.response?.data?.message || t("Failed to record adjustment"),
            );
          }
        }}
      />

      {/* Waste Voucher Dialog */}
      <WasteVoucherDialog
        open={isWasteVoucherOpen}
        onOpenChange={setIsWasteVoucherOpen}
        onConfirm={async (data) => {
          try {
            await api.post("/inventory/adjustments", { ...data, type: "Waste Voucher" });
            showSuccessToast(t("Waste voucher confirmed"));
            setAdjustmentsRefreshKey((k) => k + 1);
          } catch (error: any) {
            showErrorToast(
              error.response?.data?.message || t("Failed to record adjustment"),
            );
          }
        }}
      />

      {/* New Period Balance Dialog */}
      <NewPeriodBalanceDialog
        open={isNewPeriodBalanceOpen}
        onOpenChange={setIsNewPeriodBalanceOpen}
        onConfirm={async (data) => {
          try {
            await api.post("/inventory/opening-balances", data);
            showSuccessToast(t("New period balance created successfully"));
            setOpeningBalanceRefreshKey((k) => k + 1);
          } catch (error: any) {
            showErrorToast(
              error.response?.data?.message || t("Failed to create opening balance"),
            );
          }
        }}
      />
    </>
  );
};

export default FinancialHubPage;
