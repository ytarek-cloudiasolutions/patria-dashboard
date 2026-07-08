import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import { api } from "@/config/api";
import { BarChart3, Box, DollarSign, TrendingUp } from "lucide-react";

const TH = "px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#28293D] text-left";
const TD = "px-4 py-4 text-[14px] text-[#28293D]";

interface SalesSummary {
  totalSales: number;
  totalPieces: number;
  totalCost: number;
  profit: number;
}

interface SalesRow {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  totalSales: number;
  profit: number;
  margin: number;
}

interface SalesReportTabProps {
  fromDate: string;
  toDate: string;
}

const SalesReportTab = ({ fromDate, toDate }: SalesReportTabProps) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [rows, setRows] = useState<SalesRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;

    api
      .get("/reports/sales", { params })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? {};
        setSummary(data.summary ?? null);
        setRows(data.products ?? []);
      })
      .catch(() => {
        setSummary(null);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  const handleExportCSV = () => {
    if (rows.length === 0) return;
    const headers = [
      t("Product Name"),
      t("Quantity"),
      t("Unit Price"),
      t("Cost Price"),
      t("Total Sales"),
      t("Profit"),
      t("Margin"),
    ];
    const csvRows = rows.map((r) => [
      r.productName,
      String(r.quantity),
      `EGP ${r.unitPrice.toFixed(2)}`,
      `EGP ${r.costPrice.toFixed(2)}`,
      `EGP ${r.totalSales.toFixed(2)}`,
      `EGP ${r.profit.toFixed(2)}`,
      `${r.margin.toFixed(2)}%`,
    ]);
    const csv = [headers, ...csvRows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Total Sales"),
            value: summary
              ? `EGP ${summary.totalSales.toLocaleString()}`
              : "—",
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-primary",
            icon: <BarChart3 className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total pieces"),
            value: summary ? String(summary.totalPieces) : "—",
            badgeColor: "bg-[#EDF4FB]",
            iconColor: "text-blue-500",
            icon: <Box className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total cost"),
            value: summary
              ? `EGP ${summary.totalCost.toLocaleString()}`
              : "—",
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
            icon: <DollarSign className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Profit"),
            value: summary
              ? `EGP ${summary.profit.toLocaleString()}`
              : "—",
            badgeColor: "bg-[#F3E9FA]",
            iconColor: "text-[#9524E4]",
            icon: <TrendingUp className="size-5" />,
          }}
        />
      </div>

      {/* Product Sales Table */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between px-4 py-5 sm:px-5">
          <span className="text-[18px] font-bold text-[#333333]">
            {t("Product Sales")}
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
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={TH}>{t("Product Name")}</th>
                <th className={`${TH} text-center`}>{t("Quantity")}</th>
                <th className={`${TH} text-center`}>{t("Unit Price")}</th>
                <th className={`${TH} text-center`}>{t("Cost Price")}</th>
                <th className={`${TH} text-center`}>{t("Total Sales")}</th>
                <th className={`${TH} text-center`}>{t("Profit")}</th>
                <th className={`${TH} text-center`}>{t("Margin")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("Loading...")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("No sales data found")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[#E5E5E5] hover:bg-[#FAFAF7] transition-colors"
                  >
                    <td className={`${TD} font-medium text-[#333333]`}>
                      {row.productName}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {row.quantity}
                    </td>
                    <td className={`${TD} text-center`} dir="ltr">
                      EGP {row.unitPrice.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center`} dir="ltr">
                      EGP {row.costPrice.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center font-bold`} dir="ltr">
                      EGP {row.totalSales.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center`} dir="ltr">
                      EGP {row.profit.toFixed(2)}
                    </td>
                    <td className={`${TD} text-center`}>{row.margin.toFixed(2)}%</td>
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

export default SalesReportTab;
