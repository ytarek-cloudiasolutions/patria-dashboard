import { useEffect, useState } from "react";
import { ShoppingBag, Tag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SHIFT_OPTIONS } from "../data";
import { formatEgp } from "../utils";
import StatCard from "./StatCard";
import ReportFilters from "./ReportFilters";
import { api } from "@/config/api";

export interface ExportPayload {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

interface DailyReportTabProps {
  onMenuOpenChange: (open: boolean) => void;
  onInitialLoadComplete?: () => void;
  onExportDataReady?: (data: ExportPayload) => void;
}

const TH = "px-4 py-3 text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]";
const TD = "px-4 py-4 text-[14px]";

interface ProductRow {
  id: string;
  label: string;
  product: string;
  quantity: number;
  cost: number;
  margin: number;
  revenue: number;
  profit: number;
}

interface Summary {
  totalOrders: number;
  totalItemsOrdered: number;
  totalRevenue: number;
  totalDiscounts: number;
}

const DailyReportTab = ({
  onMenuOpenChange,
  onInitialLoadComplete,
  onExportDataReady,
}: DailyReportTabProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("Morning");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (date) {
      // Morning/Evening/Night map to hour-of-day windows within the
      // selected date — there's no separate "shift period" field on
      // Order, so the date filter's from/to range is narrowed instead.
      const hourRanges: Record<string, [number, number]> = {
        Morning: [6, 14],
        Evening: [14, 22],
        Night: [22, 30], // 30 = 6am next day
      };
      const [startHour, endHour] = hourRanges[shift] ?? [0, 24];
      const from = new Date(`${date}T00:00:00`);
      from.setHours(startHour, 0, 0, 0);
      const to = new Date(`${date}T00:00:00`);
      to.setHours(endHour, 0, 0, 0);
      params.from = from.toISOString();
      params.to = to.toISOString();
    }
    api
      .get("/reports/overview", { params })
      .then((res) => {
        const data = res.data;
        setSummary(data.summary ?? null);
        const mapped: ProductRow[] = (data.topProducts ?? []).map(
          (p: { name: string; quantity: number; revenue: number }, idx: number) => {
            const rev = p.revenue ?? 0;
            const cost = rev * 0.45; // Estimated cost factor if not directly provided
            const profit = rev - cost;
            const margin = rev > 0 ? Math.round((profit / rev) * 100) : 0;
            return {
              id: String(idx),
              label: String(idx + 1).padStart(2, "0"),
              product: p.name,
              quantity: p.quantity,
              cost,
              margin,
              revenue: rev,
              profit,
            };
          },
        );
        setProducts(mapped);
      })
      .catch(() => {
        setSummary(null);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
        onInitialLoadComplete?.();
      });
  }, [date, shift]);

  useEffect(() => {
    if (onExportDataReady) {
      onExportDataReady({
        title: "Daily_Report",
        headers: [
          "#",
          t("PRODUCT"),
          t("QUANTITY"),
          t("REVENUE"),
          t("COST"),
          t("PROFIT"),
          t("MARGIN"),
        ],
        rows: products.map((p) => [
          p.label,
          p.product,
          p.quantity,
          `EGP ${p.revenue.toFixed(2)}`,
          `EGP ${p.cost.toFixed(2)}`,
          `EGP ${p.profit.toFixed(2)}`,
          `${p.margin}%`,
        ]),
      });
    }
  }, [products, t, onExportDataReady]);

  const totalRevenue = summary?.totalRevenue ?? 0;
  const totalCost = totalRevenue * 0.45;
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  const totalProductQty = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalProductCost = products.reduce((acc, p) => acc + p.cost, 0);
  const totalProductRevenue = products.reduce((acc, p) => acc + p.revenue, 0);
  const totalProductProfit = products.reduce((acc, p) => acc + p.profit, 0);

  return (
    <>
      <ReportFilters
        date={date}
        onDateChange={setDate}
        selectLabel="Shift"
        options={SHIFT_OPTIONS}
        selected={shift}
        onSelect={setShift}
        onMenuOpenChange={onMenuOpenChange}
      />

      {/* Row of 7 KPI Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
        <StatCard label={t("Orders")} value={String(summary?.totalOrders ?? 0)} tone="neutral" />
        <StatCard label={t("Quantity")} value={String(summary?.totalItemsOrdered ?? 0)} tone="neutral" />
        <StatCard label={t("Revenue")} value={formatEgp(totalRevenue)} tone="green" />
        <StatCard label={t("Cost")} value={formatEgp(totalCost)} tone="neutral" />
        <StatCard label={t("Profit")} value={formatEgp(totalProfit)} tone="primary" />
        <StatCard label={t("Profit margin")} value={`${profitMargin}%`} tone="green" />
        <StatCard label={t("Orders at a discount")} value={String(summary?.totalDiscounts ?? 0)} tone="warning" />
      </div>

      {/* Products sold table */}
      <div className="mb-6 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 bg-white px-4 py-3">
          <ShoppingBag className="size-6 text-black" />
          <span className="text-[18px] font-bold text-[#333333] leading-[19.26px]">
            {t("Products sold")}
          </span>
          <span className="text-[12px] font-semibold text-[#8B8B8B]">
            ({products.length} {t("Products")})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-start`}>#</th>
                <th className={`${TH} text-start`}>{t("PRODUCT")}</th>
                <th className={`${TH} text-center`}>{t("QUANTITY")}</th>
                <th className={`${TH} text-center`}>{t("REVENUE")}</th>
                <th className={`${TH} text-center`}>{t("COST")}</th>
                <th className={`${TH} text-center`}>{t("PROFIT")}</th>
                <th className={`${TH} text-center`}>{t("MARGIN")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[14px] text-[#8B8B8B]">
                    {t("Loading...")}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[14px] text-[#8B8B8B]">
                    {t("No products sold")}
                  </td>
                </tr>
              ) : (
                <>
                  {products.map((row) => (
                    <tr key={row.id} className="border-t border-[#F0EEEA] hover:bg-[#FAFAF8]">
                      <td className={`${TD} font-semibold text-[#28293D]`}>{row.label}</td>
                      <td className={`${TD} font-medium text-[#28293D]`}>{row.product}</td>
                      <td className={`${TD} text-center font-medium text-[#28293D]`}>{row.quantity}</td>
                      <td
                        className={`${TD} text-center font-medium tracking-[0.28px]`}
                        style={{ color: "#8F6900" }}
                        dir="ltr"
                      >
                        {formatEgp(row.revenue)}
                      </td>
                      <td className={`${TD} text-center font-medium text-[#28293D]`} dir="ltr">
                        {formatEgp(row.cost)}
                      </td>
                      <td
                        className={`${TD} text-center font-medium tracking-[0.28px]`}
                        style={{ color: "#059B5A" }}
                        dir="ltr"
                      >
                        {formatEgp(row.profit)}
                      </td>
                      <td className={`${TD} text-center font-medium text-[#28293D]`}>{row.margin} %</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#E5E5E5] bg-white font-semibold">
                    <td className={`${TD} font-semibold text-[#28293D]`}>{t("Total")}</td>
                    <td className={`${TD} font-semibold text-[#28293D]`}>-</td>
                    <td className={`${TD} text-center font-semibold text-[#28293D]`}>{totalProductQty}</td>
                    <td
                      className={`${TD} text-center font-semibold tracking-[0.28px]`}
                      style={{ color: "#8F6900" }}
                      dir="ltr"
                    >
                      {formatEgp(totalProductRevenue)}
                    </td>
                    <td className={`${TD} text-center font-semibold text-[#28293D]`} dir="ltr">
                      {formatEgp(totalProductCost)}
                    </td>
                    <td
                      className={`${TD} text-center font-semibold tracking-[0.28px]`}
                      style={{ color: "#059B5A" }}
                      dir="ltr"
                    >
                      {formatEgp(totalProductProfit)}
                    </td>
                    <td className={`${TD} text-center font-semibold text-[#28293D]`}>
                      {totalProductRevenue > 0
                        ? Math.round((totalProductProfit / totalProductRevenue) * 100)
                        : 0}{" "}
                      %
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parts Request table */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 bg-white px-4 py-3">
          <Tag className="size-6 text-black" />
          <span className="text-[18px] font-bold text-[#333333] leading-[19.26px]">
            {t("Parts Request")}
          </span>
          <span className="text-[12px] font-semibold text-[#8B8B8B]">
            (0 {t("Orders")})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-start`}>{t("ORDER NUMBER")}</th>
                <th className={`${TH} text-center`}>{t("PAYMENT TIME")}</th>
                <th className={`${TH} text-center`}>{t("TOTAL")}</th>
                <th className={`${TH} text-center`}>{t("DISCOUNT")}</th>
                <th className={`${TH} text-center`}>{t("NET TOTAL")}</th>
                <th className={`${TH} text-center`}>{t("ASSIGNED TO")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-8 text-center text-[14px] font-semibold text-[#595959]">
                  {t("There are no orders this shift.")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DailyReportTab;
