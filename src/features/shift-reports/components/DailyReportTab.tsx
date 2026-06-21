import { useState } from "react";
import { Lock, Tag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { DAILY_REPORT, SHIFT_OPTIONS } from "../data";
import { formatEgp } from "../utils";
import StatCard from "./StatCard";
import ReportFilters from "./ReportFilters";

interface DailyReportTabProps {
  onMenuOpenChange: (open: boolean) => void;
}

const TH = "px-5 py-3 text-[13px] font-semibold text-[#28293D]";
const TD = "px-5 py-4 text-[14px] text-[#28293D]";

const DailyReportTab = ({ onMenuOpenChange }: DailyReportTabProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("Morning");
  const report = DAILY_REPORT;

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

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label={t("Orders")} value={String(report.orders)} />
        <StatCard label={t("Quantity")} value={String(report.quantity)} />
        <StatCard label={t("Revenue")} value={formatEgp(report.revenue)} tone="green" />
        <StatCard label={t("Cost")} value={formatEgp(report.cost)} tone="red" />
        <StatCard label={t("Profit")} value={String(report.profit)} tone="gold" />
        <StatCard
          label={t("Profit margin")}
          value={`${report.profitMargin}%`}
          tone="green"
        />
        <StatCard
          label={t("Orders at a discount")}
          value={String(report.ordersAtDiscount)}
          tone="gold"
        />
      </div>

      {/* Products sold (by product) */}
      <div className="mb-5 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center gap-2 px-5 py-4">
          <Lock className="size-4.5 text-[#28293D]" />
          <span className="text-[15px] font-bold text-[#28293D]">
            {t("Products sold")}
          </span>
          <span className="text-[13px] text-[#8B8B8B]">
            ({report.products.length} {t("Products")})
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
                <th className={`${TH} text-start`}>{t("COST")}</th>
                <th className={`${TH} text-start`}>{t("PROFIT")}</th>
                <th className={`${TH} text-start`}>{t("MARGIN")}</th>
              </tr>
            </thead>
            <tbody>
              {report.products.map((row) => (
                <tr key={row.id} className="border-t border-[#F0EEEA]">
                  <td className={`${TD} font-semibold`}>{t(row.label)}</td>
                  <td className={TD}>{row.product}</td>
                  <td className={TD}>{row.quantity}</td>
                  <td className={`${TD} font-semibold text-[#B56C00]`} dir="ltr">
                    {formatEgp(row.revenue)}
                  </td>
                  <td className={`${TD} font-semibold text-[#C90000]`} dir="ltr">
                    {formatEgp(row.cost)}
                  </td>
                  <td className={`${TD} font-semibold text-[#059B5A]`} dir="ltr">
                    {formatEgp(row.profit)}
                  </td>
                  <td className={TD}>{row.margin} %</td>
                </tr>
              ))}
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
          <span className="text-[13px] text-[#8B8B8B]">(0 {t("Orders")})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-start`}>#</th>
                <th className={`${TH} text-start`}>{t("ACTIONS")}</th>
                <th className={`${TH} text-start`}>{t("QUANTITY")}</th>
                <th className={`${TH} text-start`}>{t("REVENUE")}</th>
                <th className={`${TH} text-start`}>{t("COST")}</th>
                <th className={`${TH} text-start`}>{t("PROFIT")}</th>
                <th className={`${TH} text-start`}>{t("MARGIN")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
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
