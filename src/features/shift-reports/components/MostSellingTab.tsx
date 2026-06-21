import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { DAILY_SALES, PERIOD_OPTIONS, TOP_PRODUCTS } from "../data";
import { formatEgp } from "../utils";
import ReportFilters from "./ReportFilters";

interface MostSellingTabProps {
  onMenuOpenChange: (open: boolean) => void;
}

const TH = "px-5 py-3 text-[13px] font-semibold text-[#28293D]";
const TD = "px-5 py-4 text-[14px] text-[#28293D]";

const MostSellingTab = ({ onMenuOpenChange }: MostSellingTabProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("weekly");

  const maxCount = Math.max(...TOP_PRODUCTS.map((p) => p.count), 1);

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top sold products */}
        <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
          <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4">
            <span className="text-[15px] font-bold text-[#28293D]">
              {t("Top Sold Products")}
            </span>
            <BarChart3 className="size-4.5 text-[#28293D]" />
          </div>
          <div className="flex flex-col gap-5 px-5 py-5">
            {TOP_PRODUCTS.map((product) => (
              <div key={product.rank} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-[13px] font-bold text-[#28293D]">
                  {String(product.rank).padStart(2, "0")}
                </span>
                <span className="w-40 shrink-0 truncate text-[13px] font-semibold text-[#28293D]">
                  {product.name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EDEAE3]">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(product.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-end text-[13px] font-bold text-[#28293D]">
                  {product.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily sales */}
        <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[15px] font-bold text-[#28293D]">
              {t("Daily sales")}
            </span>
            <TrendingUp className="size-4.5 text-[#28293D]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F0EA]">
                <tr>
                  <th className={`${TH} text-start`}>{t("DATE")}</th>
                  <th className={`${TH} text-start`}>{t("ORDERS")}</th>
                  <th className={`${TH} text-end`}>{t("REVENUE")}</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_SALES.map((sale) => (
                  <tr key={sale.id} className="border-t border-[#F0EEEA]">
                    <td className={TD}>{sale.date}</td>
                    <td className={TD}>{sale.orders}</td>
                    <td className={`${TD} text-end font-semibold`} dir="ltr">
                      {formatEgp(sale.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MostSellingTab;
