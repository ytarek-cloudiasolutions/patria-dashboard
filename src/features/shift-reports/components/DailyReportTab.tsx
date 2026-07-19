import { useEffect, useState } from "react";
import { Lock, Tag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SHIFT_OPTIONS } from "../data";
import { formatEgp } from "../utils";
import StatCard from "./StatCard";
import ReportFilters from "./ReportFilters";
import { api } from "@/config/api";

interface DailyReportTabProps {
  onMenuOpenChange: (open: boolean) => void;
  onInitialLoadComplete?: () => void;
}

const TH = "px-5 py-3 text-[13px] font-semibold text-[#28293D]";
const TD = "px-5 py-4 text-[14px] text-[#28293D]";

interface ProductRow {
  id: string;
  label: string;
  product: string;
  quantity: number;
  revenue: number;
}

interface Summary {
  totalOrders: number;
  totalItemsOrdered: number;
  totalRevenue: number;
  totalDiscounts: number;
}

const DailyReportTab = ({ onMenuOpenChange, onInitialLoadComplete }: DailyReportTabProps) => {
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
      params.from = date;
      params.to = date;
    }
    api
      .get("/reports/overview", { params })
      .then((res) => {
        const data = res.data;
        setSummary(data.summary ?? null);
        const mapped: ProductRow[] = (data.topProducts ?? []).map(
          (p: { name: string; quantity: number; revenue: number }, idx: number) => ({
            id: String(idx),
            label: String(idx + 1).padStart(2, "0"),
            product: p.name,
            quantity: p.quantity,
            revenue: p.revenue,
          }),
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
  }, [date]);

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

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <StatCard label={t("Orders")} value={String(summary?.totalOrders ?? 0)} />
        <StatCard label={t("Quantity")} value={String(summary?.totalItemsOrdered ?? 0)} />
        <StatCard label={t("Revenue")} value={formatEgp(summary?.totalRevenue ?? 0)} tone="green" />
        <StatCard label={t("Orders at a discount")} value={String(summary?.totalDiscounts ?? 0)} tone="gold" />
      </div>

      {/* Products sold (by product) */}
      <div className="mb-5 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 px-5 py-4">
          <Lock className="size-4.5 text-[#28293D]" />
          <span className="text-[15px] font-bold text-[#28293D]">
            {t("Products sold")}
          </span>
          <span className="text-[13px] text-[#8B8B8B]">
            ({products.length} {t("Products")})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-start`}>#</th>
                <th className={`${TH} text-start`}>{t("PRODUCT")}</th>
                <th className={`${TH} text-start`}>{t("QUANTITY")}</th>
                <th className={`${TH} text-start`}>{t("REVENUE")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                    {t("Loading...")}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                    {t("No products sold")}
                  </td>
                </tr>
              ) : (
                products.map((row) => (
                  <tr key={row.id} className="border-t border-[#F0EEEA]">
                    <td className={`${TD} font-semibold`}>{row.label}</td>
                    <td className={TD}>{row.product}</td>
                    <td className={TD}>{row.quantity}</td>
                    <td className={`${TD} font-semibold text-[#B56C00]`} dir="ltr">
                      {formatEgp(row.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products sold (by order) */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 px-5 py-4">
          <Tag className="size-4.5 text-[#28293D]" />
          <span className="text-[15px] font-bold text-[#28293D]">
            {t("Products sold")}
          </span>
          <span className="text-[13px] text-[#8B8B8B]">({summary?.totalOrders ?? 0} {t("Orders")})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-start`}>#</th>
                <th className={`${TH} text-start`}>{t("PRODUCT")}</th>
                <th className={`${TH} text-start`}>{t("QUANTITY")}</th>
                <th className={`${TH} text-end`}>{t("REVENUE")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                    {t("Loading...")}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                    {t("There are no orders this shift.")}
                  </td>
                </tr>
              ) : (
                products.map((row) => (
                  <tr key={row.id} className="border-t border-[#F0EEEA]">
                    <td className={`${TD} font-semibold`}>{row.label}</td>
                    <td className={TD}>{row.product}</td>
                    <td className={TD}>{row.quantity}</td>
                    <td className={`${TD} text-end font-semibold text-[#B56C00]`} dir="ltr">
                      {formatEgp(row.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DailyReportTab;
