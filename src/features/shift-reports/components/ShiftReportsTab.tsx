import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { PERIOD_OPTIONS } from "../data";
import type { ShiftRow, ShiftStatus } from "../types";
import { formatEgp } from "../utils";
import ReportFilters from "./ReportFilters";
import { api } from "@/config/api";

import type { ExportPayload } from "./DailyReportTab";

interface ShiftReportsTabProps {
  onMenuOpenChange: (open: boolean) => void;
  onExportDataReady?: (data: ExportPayload) => void;
}

const TH = "px-4 py-3 text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px] whitespace-nowrap";
const TD = "px-4 py-3.5 text-[14px] font-medium text-[#333333] whitespace-nowrap";

const STATUS_STYLES: Record<ShiftStatus, string> = {
  "On Going": "bg-[#8F6900] border border-[#725400] text-white",
  Completed: "bg-[#DCDCDC] border border-[#595959] text-[#23252A]",
};

const formatDuration = (openedAt: string, closedAt?: string) => {
  const start = new Date(openedAt).getTime();
  const end = closedAt ? new Date(closedAt).getTime() : Date.now();
  const mins = Math.floor((end - start) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const formatDateFigma = (d: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return d;
  }
};

const renderFormattedDate = (dateStr: string) => {
  if (!dateStr || dateStr === "—") return "—";
  const parts = dateStr.split(", ");
  if (parts.length === 2) {
    return (
      <div className="text-center leading-snug">
        <div>{parts[0]},</div>
        <div>{parts[1]}</div>
      </div>
    );
  }
  return dateStr;
};

const renderEgpFormatted = (amount?: number) => {
  if (amount === undefined || amount === null) return "-";
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <span>
      <span className="font-normal text-[#333333]">EGP </span>
      <span className="font-bold text-[#333333]">{formatted}</span>
    </span>
  );
};

const ShiftReportsTab = ({ onMenuOpenChange, onExportDataReady }: ShiftReportsTabProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [rows, setRows] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/pos/shifts", { params: { limit: 50 } })
      .then((res) => {
        const raw: any[] = res.data?.shifts ?? res.data?.data ?? [];
        const mapped: ShiftRow[] = raw.map((s, idx) => {
          const cashier = s.cashierId;
          const name = typeof cashier === "object" ? (cashier?.name ?? "Super Admin") : "Super Admin";
          const role = typeof cashier === "object" ? (cashier?.role ?? "Admin") : "Admin";
          const openedAt = s.openedAt ?? s.createdAt ?? "";
          const closedAt = s.closedAt ?? "";

          return {
            id: idx + 1,
            employee: name,
            role,
            shift: s.shiftType || "-",
            start: formatDateFigma(openedAt),
            end: formatDateFigma(closedAt),
            duration: openedAt ? formatDuration(openedAt, closedAt || undefined) : "—",
            orders: s.orderIds?.length ?? s.totalOrders ?? 0,
            revenue: s.totalRevenue ?? s.closingBalance ?? 0,
            discount: s.totalDiscount ?? undefined,
            status: s.status === "open" ? "On Going" : "Completed",
          };
        });
        setRows(mapped);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [period, date]);

  useEffect(() => {
    if (onExportDataReady) {
      onExportDataReady({
        title: "Shift_Performance_Report",
        headers: [
          t("Employee"),
          t("Role"),
          t("Shift"),
          t("Start"),
          t("End"),
          t("Duration"),
          t("Orders"),
          t("Revenue"),
          t("Discounts"),
          t("Status"),
        ],
        rows: rows.map((r) => [
          r.employee,
          t(r.role),
          r.shift === "-" ? "-" : t(r.shift),
          r.start,
          r.end,
          r.duration,
          r.orders,
          `EGP ${r.revenue.toFixed(2)}`,
          r.discount ? `EGP ${r.discount.toFixed(2)}` : "-",
          t(r.status),
        ]),
      });
    }
  }, [rows, t, onExportDataReady]);

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

      <div className="overflow-x-auto rounded-[16px] border border-[#E5E5E5] bg-white">
        <table className="w-full min-w-[1050px]">
          <thead className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
            <tr className="h-[48px]">
              <th className={`${TH} text-start ps-8`}>{t("Employee")}</th>
              <th className={`${TH} text-center`}>{t("Role")}</th>
              <th className={`${TH} text-center`}>{t("Shift")}</th>
              <th className={`${TH} text-center`}>{t("Start")}</th>
              <th className={`${TH} text-center`}>{t("End")}</th>
              <th className={`${TH} text-center`}>{t("Duration")}</th>
              <th className={`${TH} text-center`}>{t("Orders")}</th>
              <th className={`${TH} text-center`}>{t("Revenue")}</th>
              <th className={`${TH} text-center`}>{t("Discounts")}</th>
              <th className={`${TH} text-center pe-8`}>{t("Status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {loading ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-[13px] text-[#8B8B8B]">
                  {t("Loading...")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-[13px] text-[#8B8B8B]">
                  {t("No shifts found")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-[#FAF9F6]">
                  <td className={`${TD} text-start ps-8 font-bold text-[#333333]`}>
                    {row.employee}
                  </td>
                  <td className={`${TD} text-center text-[#595959]`}>{t(row.role)}</td>
                  <td className={`${TD} text-center text-[#595959]`}>
                    {row.shift === "-" ? "-" : t(row.shift)}
                  </td>
                  <td className={`${TD} text-center text-[#595959]`}>
                    {renderFormattedDate(row.start)}
                  </td>
                  <td className={`${TD} text-center text-[#595959]`}>
                    {renderFormattedDate(row.end)}
                  </td>
                  <td className={`${TD} text-center text-[#333333]`}>{row.duration}</td>
                  <td className={`${TD} text-center text-[#333333]`}>{row.orders}</td>
                  <td className={`${TD} text-center`} dir="ltr">
                    {renderEgpFormatted(row.revenue)}
                  </td>
                  <td className={`${TD} text-center`} dir="ltr">
                    {row.discount ? (
                      <span className="font-semibold text-[#C90000]">
                        {formatEgp(row.discount)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className={`${TD} text-center pe-8`}>
                    <span
                      className={cn(
                        "inline-flex h-6 items-center justify-center rounded-[30px] px-3.5 text-[11px] font-semibold tracking-[0.22px]",
                        STATUS_STYLES[row.status],
                      )}
                    >
                      {t(row.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ShiftReportsTab;
