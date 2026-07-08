import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import { api } from "@/config/api";
import { DollarSign, Tag } from "lucide-react";

const TH = "px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#28293D] text-left";
const TD = "px-4 py-4 text-[14px] text-[#28293D]";

interface DiscountSummary {
  totalDeductions: number;
  totalDeductionsEgp: number;
}

interface DiscountRow {
  id: string;
  orderNo: string;
  customer: string;
  responsible: string;
  type: string;
  originCost: number;
  discountValue: number;
  afterDiscount: number;
  date: string;
}

interface ResponsibleGroup {
  name: string;
  totalEgp: number;
  count: number;
}

interface DiscountsReportTabProps {
  fromDate: string;
  toDate: string;
  warehouse: string;
}

const DiscountsReportTab = ({ fromDate, toDate, warehouse }: DiscountsReportTabProps) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<DiscountSummary | null>(null);
  const [rows, setRows] = useState<DiscountRow[]>([]);
  const [responsibleGroups, setResponsibleGroups] = useState<ResponsibleGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (warehouse !== "All") params.warehouse = warehouse;

    api
      .get("/reports/discounts", { params })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? {};
        setSummary(data.summary ?? null);
        setRows(data.discounts ?? []);
        setResponsibleGroups(data.responsibleGroups ?? []);
      })
      .catch(() => {
        setSummary(null);
        setRows([]);
        setResponsibleGroups([]);
      })
      .finally(() => setLoading(false));
  }, [fromDate, toDate, warehouse]);

  const handleExportCSV = () => {
    if (rows.length === 0) return;
    const headers = [
      t("Order No."),
      t("Customer"),
      t("Responsible"),
      t("Type"),
      t("Origin Cost"),
      t("Discount Value"),
      t("After Discount"),
      t("Date"),
    ];
    const csvRows = rows.map((r) => [
      r.orderNo,
      r.customer,
      r.responsible,
      r.type,
      `EGP ${r.originCost.toFixed(2)}`,
      `-EGP ${r.discountValue.toFixed(2)}`,
      `EGP ${r.afterDiscount.toFixed(2)}`,
      r.date,
    ]);
    const csv = [headers, ...csvRows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discounts-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Total Deductions"),
            value: summary ? String(summary.totalDeductions) : "—",
            badgeColor: "bg-[rgba(254,154,0,0.1)]",
            iconColor: "text-[#C7861E]",
            icon: <Tag className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total Deductions (EGP)"),
            value: summary
              ? `EGP ${summary.totalDeductionsEgp.toFixed(2)}`
              : "—",
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
            icon: <DollarSign className="size-5" />,
          }}
        />
      </div>

      {/* Deductions by Responsible Party */}
      {responsibleGroups.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-5">
          <p className="mb-4 text-[16px] font-bold text-[#333333]">
            {t("Deductions by responsible party")}
          </p>
          <div className="flex flex-wrap gap-4">
            {responsibleGroups.map((group) => (
              <div
                key={group.name}
                className="flex flex-col gap-1 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-4"
              >
                <p className="text-[16px] font-semibold text-[#000000]">
                  {group.name}
                </p>
                <p className="text-[32px] font-semibold text-[#000000]" dir="ltr">
                  EGP {group.totalEgp.toFixed(2)}
                </p>
                <p className="text-[13px] font-semibold text-[#595959]">
                  {group.count} {t("Discount")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discount Details Table */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between px-4 py-5 sm:px-5">
          <span className="text-[18px] font-bold text-[#333333]">
            {t("Discount Details")}
          </span>
          <DefaultButton
            data={{
              buttonText: t("Export CSV"),
              onClick: handleExportCSV,
              icon: <FileDown className="size-4.5" />,
              className: "bg-primary text-white hover:bg-primary/90",
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={TH}>{t("Order No.")}</th>
                <th className={`${TH} text-center`}>{t("Customer")}</th>
                <th className={`${TH} text-center`}>{t("Responsible")}</th>
                <th className={`${TH} text-center`}>{t("Type")}</th>
                <th className={`${TH} text-center`}>{t("Origin Cost")}</th>
                <th className={`${TH} text-center`}>{t("Discount Value")}</th>
                <th className={`${TH} text-center`}>{t("After Discount")}</th>
                <th className={`${TH} text-center`}>{t("Date")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("Loading...")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("No discount records found")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[#E5E5E5] hover:bg-[#FAFAF7] transition-colors"
                  >
                    <td className={`${TD} font-medium text-[#333333]`}>
                      {row.orderNo}
                    </td>
                    <td className={`${TD} text-center`}>{row.customer}</td>
                    <td className={`${TD} text-center`}>{row.responsible}</td>
                    <td className={`${TD} text-center`}>{row.type}</td>
                    <td className={`${TD} text-center`} dir="ltr">
                      EGP {row.originCost.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center text-[#C90000]`} dir="ltr">
                      -EGP {row.discountValue.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center font-bold`} dir="ltr">
                      EGP {row.afterDiscount.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {row.date}
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

export default DiscountsReportTab;
