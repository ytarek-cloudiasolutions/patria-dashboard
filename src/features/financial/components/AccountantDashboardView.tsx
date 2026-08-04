import {
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Database,
  AlertTriangle,
  Package,
  Trash2,
  FileSpreadsheet,
  ArrowLeftRight,
  Play,
  CircleDollarSign,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import TransactionsTable from "./TransactionsTable";
import type { FinancialTransaction, FinancialTab } from "../types";

interface AccountantDashboardViewProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: string;
  transactions: FinancialTransaction[];
  onNavigateTab: (tab: FinancialTab) => void;
  onOpenAddModal: () => void;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const AccountantDashboardView = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
  transactions,
  onNavigateTab,
  onOpenAddModal,
}: AccountantDashboardViewProps) => {
  const { t } = useTranslation();

  const total = totalRevenue + totalExpenses;
  const revenuePct = total === 0 ? 50 : (totalRevenue / total) * 100;
  const expensePct = total === 0 ? 50 : (totalExpenses / total) * 100;
  const balancePct =
    totalRevenue === 0 ? 0 : ((totalRevenue - totalExpenses) / Math.max(totalRevenue, 1)) * 100;
  const isNegative = balancePct < 0;

  return (
    <div className="flex flex-col gap-7">
      {/* 8 Summary Cards Matching Figma exact layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 1: Total Revenue */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Revenue")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              {formatEgp(totalRevenue)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
            <TrendingUp size={24} className="text-[#8F6900]" />
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Expenses")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              {formatEgp(totalExpenses)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <TrendingDown size={24} className="text-white" />
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Net Profit")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              {formatEgp(netProfit)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
            <Zap size={24} className="text-[#059B5A]" />
          </div>
        </div>

        {/* Card 4: Profit Margin */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Profit Margin")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              {profitMargin}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#FE9A00]/10">
            <Target size={24} className="text-[#C7861E]" />
          </div>
        </div>

        {/* Card 5: Total inventory value */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total inventory value")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              EGP 4,000
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#DBEAFE]">
            <Database size={24} className="text-[#155DFC]" />
          </div>
        </div>

        {/* Card 6: Low Stock Items */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Low Stock Items")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              2
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#FE9A00]/10">
            <AlertTriangle size={24} className="text-[#C7861E]" />
          </div>
        </div>

        {/* Card 7: Out of Stock */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Out of Stock")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              295
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <Package size={24} className="text-white" />
          </div>
        </div>

        {/* Card 8: Cost of Waste (Monthly) */}
        <div className="flex h-[115px] w-full items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Cost of Waste (Monthly)")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black" dir="ltr">
              EGP 0
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F3E9FA]">
            <Trash2 size={24} className="text-[#9524E4]" />
          </div>
        </div>
      </div>

      {/* Middle Row: Revenues vs Expenses & Quick Actions */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        {/* Revenues versus expenses Card */}
        <div className="flex h-[296px] flex-col rounded-[16px] border border-[#E5E5E5] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between bg-[#F5F0EA] px-[26px] py-3 border-b border-[#E5E5E5]">
            <h3 className="text-[20px] font-bold text-[#333333]">
              {t("Revenues versus expenses")}
            </h3>
            <Badge className="flex h-7 items-center gap-1 rounded-full bg-[#C90000] px-3 text-[12px] font-semibold text-white border-none">
              <TrendingDown size={12} />
              {t("Balance")} = {balancePct.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-6 p-6">
            {/* Progress bar */}
            <div className="flex h-5 w-full overflow-hidden rounded-full">
              <div
                className="bg-[#06C270] transition-all"
                style={{ width: `${revenuePct}%` }}
              />
              <div
                className="bg-[#C90000] transition-all"
                style={{ width: `${expensePct}%` }}
              />
            </div>

            {/* Sub cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1 rounded-[16px] border border-[#E5E5E5] bg-[#E2F4ED] p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2px] text-[#059B5A]">
                  {t("Revenue")}
                </span>
                <span className="text-[16px] font-semibold tracking-[0.32px] text-[#059B5A]" dir="ltr">
                  EGP 4,377
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-[16px] border border-[#E5E5E5] bg-[#C90000] p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2px] text-white">
                  {t("Revenue")}
                </span>
                <span className="text-[16px] font-semibold tracking-[0.32px] text-white" dir="ltr">
                  EGP 4,377
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="flex h-[296px] flex-col rounded-[16px] border border-[#E5E5E5] bg-white shadow-sm overflow-hidden">
          <div className="bg-[#F5F0EA] px-[26px] py-3 border-b border-[#E5E5E5]">
            <h3 className="text-[20px] font-bold text-[#333333]">
              {t("Quick Actions")}
            </h3>
          </div>
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                type="button"
                onClick={() => onNavigateTab("inventory-count")}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("New Inventory Session")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("adjustments-wastage")}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <Trash2 className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("Waste Entry")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("adjustments-wastage")}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("Quantity Adjustment")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("opening-balance")}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <Package className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("Opening Balance")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("production-orders")}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <Play className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("Production Order")}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenAddModal}
                className="flex h-[56px] items-center gap-3 rounded-[5px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 text-start hover:bg-[#F5F0EA] transition-colors cursor-pointer"
              >
                <CircleDollarSign className="size-4.5 text-black shrink-0" />
                <span className="text-[16px] font-semibold text-black truncate">
                  {t("Expense / Income")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default AccountantDashboardView;
