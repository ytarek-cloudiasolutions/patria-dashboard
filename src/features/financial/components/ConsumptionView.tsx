import { useState } from "react";
import { Package, Wallet, TrendingUp, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { formatEgp } from "@/features/pos/utils";

interface ConsumptionItem {
  productId: string;
  name: string;
  sales: number;
  waste: number;
  production: number;
  total: number;
  cost: number;
  income: number;
  profit: number;
}

const ConsumptionView = () => {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [summary, setSummary] = useState({
    totalConsumed: 0,
    consumptionCost: 0,
    salesRevenue: 0,
    totalLoss: 0,
  });
  const [items, setItems] = useState<ConsumptionItem[]>([]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setHasRun(true);
    try {
      const response = await api.get("/inventory/consumption", {
        params: { from: fromDate || undefined, to: toDate || undefined },
      });
      setSummary(
        response.data?.summary ?? {
          totalConsumed: 0,
          consumptionCost: 0,
          salesRevenue: 0,
          totalLoss: 0,
        },
      );
      setItems(response.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Pickers & Action Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full lg:w-auto flex-1">
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder={t("From")}
            popoverPlacement="bottom-right"
            withBackdrop
            className="flex-1"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />

          <DatePicker
            value={toDate}
            onChange={setToDate}
            placeholder={t("To")}
            popoverPlacement="bottom-right"
            minDate={fromDate || undefined}
            withBackdrop
            className="flex-1"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={loading}
          className="h-14 w-full lg:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="mx-auto size-5 animate-spin" /> : t("Generate Report")}
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Consumed")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {summary.totalConsumed}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
            <Package size={24} className="text-[#8F6900]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Consumption cost")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {formatEgp(summary.consumptionCost)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#FE9A00]/10">
            <Wallet size={24} className="text-[#C7861E]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Sales revenue")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {formatEgp(summary.salesRevenue)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
            <TrendingUp size={24} className="text-[#059B5A]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total loss")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {formatEgp(summary.totalLoss)}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <Trash2 size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Consumption Breakdown Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
              <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("ITEM")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("SALES")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("WASTE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PRODUCTION")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("TOTAL")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("COST")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("INCOME")}
              </TableHead>
              <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                {t("PROFIT")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasRun ? (
              <TableRow className="border-none">
                <TableCell colSpan={8} className="py-10 text-center text-[14px] text-[#8B8B8B]">
                  {t("Pick a date range and click Generate Report")}
                </TableCell>
              </TableRow>
            ) : !loading && items.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={8} className="py-10 text-center text-[14px] text-[#8B8B8B]">
                  {t("No consumption in this range")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.productId} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                  <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                    {row.name}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                    {row.sales}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                    {row.waste}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                    {row.production}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-bold tracking-[0.28px] text-black">
                    {row.total}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]" dir="ltr">
                    {formatEgp(row.cost)}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#059B5A]" dir="ltr">
                    {formatEgp(row.income)}
                  </TableCell>
                  <TableCell className="pe-8 py-5 whitespace-nowrap text-center text-[14px] font-bold tracking-[0.28px] text-[#059B5A]" dir="ltr">
                    {formatEgp(row.profit)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConsumptionView;
