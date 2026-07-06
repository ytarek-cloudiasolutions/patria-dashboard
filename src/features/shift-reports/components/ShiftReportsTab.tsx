import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { PERIOD_OPTIONS } from "../data";
import type { ShiftRow, ShiftStatus } from "../types";
import { formatEgp } from "../utils";
import ReportFilters from "./ReportFilters";
import { api } from "@/config/api";

interface ShiftReportsTabProps {
  onMenuOpenChange: (open: boolean) => void;
}

const TH = "px-4 py-3 text-[13px] font-semibold text-[#28293D] whitespace-nowrap";
const TD = "px-4 py-4 text-[13px] text-[#28293D] whitespace-nowrap";

const STATUS_STYLES: Record<ShiftStatus, string> = {
  "On Going": "bg-primary text-white",
  Completed: "bg-[#E5E5E5] text-[#28293D]",
};

const formatDuration = (openedAt: string, closedAt?: string) => {
  const start = new Date(openedAt).getTime();
  const end = closedAt ? new Date(closedAt).getTime() : Date.now();
  const mins = Math.floor((end - start) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const ShiftReportsTab = ({ onMenuOpenChange }: ShiftReportsTabProps) => {
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
        const raw: any[] = res.data?.shifts ?? [];
        const mapped: ShiftRow[] = raw.map((s, idx) => {
          const cashier = s.cashierId;
          const name = typeof cashier === "object" ? cashier?.name : "—";
          const role = typeof cashier === "object" ? (cashier?.role ?? "Cashier") : "Cashier";
          const openedAt = s.openedAt ?? s.createdAt ?? "";
          const closedAt = s.closedAt ?? "";
          const fmt = (d: string) =>
            d
              ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : "—";

          return {
            id: idx + 1,
            employee: name,
            role,
            shift: "—",
            start: fmt(openedAt),
            end: fmt(closedAt),
            duration: openedAt ? formatDuration(openedAt, closedAt || undefined) : "—",
            orders: s.orderIds?.length ?? 0,
            revenue: s.totalRevenue ?? 0,
            discount: undefined,
            status: s.status === "open" ? "On Going" : "Completed",
          };
        });
        setRows(mapped);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [period, date]);

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
        <table className="w-full min-w-[920px]">
          <thead className="bg-[#F5F0EA]">
            <tr>
              <th className={`${TH} text-start`}>{t("Employee")}</th>
              <th className={`${TH} text-start`}>{t("Role")}</th>
              <th className={`${TH} text-start`}>{t("Shift")}</th>
              <th className={`${TH} text-start`}>{t("Start")}</th>
              <th className={`${TH} text-start`}>{t("End")}</th>
              <th className={`${TH} text-start`}>{t("Duration")}</th>
              <th className={`${TH} text-start`}>{t("Orders")}</th>
              <th className={`${TH} text-start`}>{t("Revenue")}</th>
              <th className={`${TH} text-start`}>{t("Discounts")}</th>
              <th className={`${TH} text-center`}>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                  {t("Loading...")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[13px] text-[#8B8B8B]">
                  {t("No shifts found")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[#F0EEEA]">
                  <td className={`${TD} font-bold`}>{row.employee}</td>
                  <td className={TD}>{t(row.role)}</td>
                  <td className={TD}>{row.shift === "-" || row.shift === "—" ? "-" : t(row.shift)}</td>
                  <td className={`${TD} text-[#595959]`}>{row.start}</td>
                  <td className={`${TD} text-[#595959]`}>{row.end}</td>
                  <td className={TD}>{row.duration}</td>
                  <td className={TD}>{row.orders}</td>
                  <td className={`${TD} font-semibold`} dir="ltr">
                    {formatEgp(row.revenue)}
                  </td>
                  <td className={TD} dir="ltr">
                    {row.discount ? (
                      <span className="font-semibold text-[#C90000]">
                        {formatEgp(row.discount)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className={`${TD} text-center`}>
                    <span
                      className={cn(
                        "inline-flex h-7 items-center justify-center rounded-full px-3 text-[11px] font-semibold",
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
