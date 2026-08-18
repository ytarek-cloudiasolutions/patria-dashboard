import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { PERIOD_OPTIONS } from "../data";
import { formatEgp } from "../utils";
import ReportFilters from "./ReportFilters";
import { api } from "@/config/api";

import type { ExportPayload } from "./DailyReportTab";

interface MostSellingTabProps {
  onMenuOpenChange: (open: boolean) => void;
  onExportDataReady?: (data: ExportPayload) => void;
}

const TH = "px-5 py-3 text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px]";
const TD = "px-5 py-4 text-[14px]";

interface TopProduct { rank: number; name: string; count: number; }
interface DailySale { id: string; date: string; orders: number; revenue: number; }

const MostSellingTab = ({ onMenuOpenChange, onExportDataReady }: MostSellingTabProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (date) {
      params.from = date;
      params.to = date;
    }
    api
      .get("/reports/overview", { params })
      .then((res) => {
        const data = res.data;

        const mapped: TopProduct[] = (data.topProducts ?? []).map(
          (p: { name: string; quantity: number }, idx: number) => ({
            rank: idx + 1,
            name: p.name,
            count: p.quantity,
          }),
        );
        setTopProducts(mapped);

        const daily: { key: string; date: string; orders: number; revenue: number }[] = (
          data.dailyRevenue ?? []
        ).map((entry: { _id: string; revenue: number; orders: number }) => ({
          key: entry._id,
          date: entry._id,
          orders: entry.orders,
          revenue: entry.revenue,
        }));

        // dailyRevenue is always bucketed per-day server-side (no week/month
        // grouping backend support) — aggregate it here for Weekly/Monthly.
        let buckets = daily;
        if (period === "weekly" || period === "monthly") {
          const grouped = new Map<string, { orders: number; revenue: number; label: string }>();
          daily.forEach((d) => {
            const dt = new Date(d.date);
            let bucketKey: string;
            let label: string;
            if (period === "weekly") {
              const weekStart = new Date(dt);
              weekStart.setDate(dt.getDate() - dt.getDay());
              bucketKey = weekStart.toISOString().slice(0, 10);
              label = `Week of ${weekStart.toLocaleDateString("en-US")}`;
            } else {
              bucketKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
              label = dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            }
            const existing = grouped.get(bucketKey) ?? { orders: 0, revenue: 0, label };
            existing.orders += d.orders;
            existing.revenue += d.revenue;
            grouped.set(bucketKey, existing);
          });
          buckets = Array.from(grouped.entries()).map(([key, v]) => ({
            key,
            date: v.label,
            orders: v.orders,
            revenue: v.revenue,
          }));
        }

        const sales: DailySale[] = buckets.map((b) => ({
          id: b.key,
          date: period === "daily" ? new Date(b.date).toLocaleDateString("en-US") : b.date,
          orders: b.orders,
          revenue: b.revenue,
        }));
        setDailySales(sales.slice(-14));
      })
      .catch(() => {
        setTopProducts([]);
        setDailySales([]);
      })
      .finally(() => setLoading(false));
  }, [period, date]);

  useEffect(() => {
    if (onExportDataReady) {
      onExportDataReady({
        title: "Most_Selling_Products_Report",
        headers: [t("RANK"), t("PRODUCT"), t("QUANTITY")],
        rows: topProducts.map((p) => [p.rank, p.name, p.count]),
      });
    }
  }, [topProducts, t, onExportDataReady]);

  const maxCount = Math.max(...topProducts.map((p) => p.count), 1);

  return (
    <>
      <ReportFilters
        date={date}
        onDateChange={setDate}
        selectLabel="Period"
        options={PERIOD_OPTIONS}
        selected={period}
        onSelect={setPeriod}
        onMenuOpenChange={onMenuOpenChange}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top sold products */}
        <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
          <div className="flex min-h-14 items-center justify-between bg-[#F5F0EA] px-5 py-4">
            <h2 className="text-[18px] font-bold text-[#333333]">
              {t("Top Sold Products")}
            </h2>
            <BarChart3 className="size-5 text-[#28293D]" />
          </div>

          <div className="flex flex-col gap-6 px-5 py-6">
            {loading ? (
              <p className="py-4 text-center text-[13px] text-[#8B8B8B]">{t("Loading...")}</p>
            ) : topProducts.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-[#8B8B8B]">{t("No data")}</p>
            ) : (
              topProducts.map((product, index) => {
                const width = (product.count / maxCount) * 100;
                const formattedRank = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={product.rank}
                    className="grid grid-cols-[160px_1fr_36px] items-center gap-3 sm:grid-cols-[200px_1fr_36px]"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="shrink-0 text-[12px] font-bold text-black tracking-[0.24px]">
                        {formattedRank}
                      </span>
                      <span className="truncate text-[14px] font-medium text-black tracking-[0.28px]">
                        {product.name}
                      </span>
                    </div>

                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      <div
                        className="h-full rounded-full bg-[#8F6900] transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>

                    <span className="text-end text-[12px] font-bold text-black tracking-[0.24px]">
                      {product.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Daily sales table */}
        <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
          <div className="flex items-center justify-between bg-white px-5 py-4">
            <span className="text-[18px] font-bold text-[#333333]">
              {t("Daily sales")}
            </span>
            <TrendingUp className="size-5 text-black" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F0EA]">
                <tr>
                  <th className={`${TH} text-start`}>{t("DATE")}</th>
                  <th className={`${TH} text-center`}>{t("ORDERS")}</th>
                  <th className={`${TH} text-end`}>{t("REVENUE")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[14px] text-[#8B8B8B]">
                      {t("Loading...")}
                    </td>
                  </tr>
                ) : dailySales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-[14px] text-[#8B8B8B]">
                      {t("No data")}
                    </td>
                  </tr>
                ) : (
                  dailySales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[#FAFAF8]">
                      <td className={`${TD} font-medium text-black tracking-[0.28px]`}>
                        {sale.date}
                      </td>
                      <td className={`${TD} text-center font-semibold text-[#28293D] tracking-[0.28px]`}>
                        {sale.orders}
                      </td>
                      <td className={`${TD} text-end font-semibold text-black tracking-[0.28px]`} dir="ltr">
                        {formatEgp(sale.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MostSellingTab;
