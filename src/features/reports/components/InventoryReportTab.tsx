import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import type { StockStatus } from "@/features/inventory/types";
import { Box, DollarSign, TrendingDown, AlertTriangle } from "lucide-react";

const TH = "px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#28293D] text-left";
const TD = "px-4 py-4 text-[14px] text-[#28293D]";

const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  Available: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
  "Low Stock": "bg-[rgba(254,154,0,0.1)] text-[#C7861E] border border-[#C7861E]",
  "Out Of Stock": "bg-[#C90000] text-white border border-[#C90000]",
};

interface InventoryReportTabProps {
  categoryFilter: string;
  statusFilter: "All" | StockStatus;
}

const InventoryReportTab = ({ categoryFilter, statusFilter }: InventoryReportTabProps) => {
  const { t } = useTranslation();
  const { items, stats, getInventoryList } = useInventory();

  useEffect(() => {
    getInventoryList();
  }, [getInventoryList]);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))),
  ];

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      categoryFilter === "All" || item.category === categoryFilter;
    const statusMatch = statusFilter === "All" || item.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const handleExportCSV = () => {
    if (filteredItems.length === 0) return;
    const headers = [
      t("Product"),
      t("Category"),
      t("Quantity"),
      t("Min. amount"),
      t("Status"),
    ];
    const rows = filteredItems.map((i) => [
      i.name,
      i.category ?? "-",
      String(i.currentQuantity),
      String(i.minimumQuantity ?? 0),
      i.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Total Value"),
            value: `EGP ${(stats.inventoryValue ?? 0).toLocaleString()}`,
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-primary",
            icon: <DollarSign className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total Units"),
            value: String(stats.totalProducts ?? items.length),
            badgeColor: "bg-[#EDF4FB]",
            iconColor: "text-blue-500",
            icon: <Box className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Low Stock"),
            value: String(
              stats.lowStock ??
                items.filter((i) => i.status === "Low Stock").length
            ),
            badgeColor: "bg-[rgba(254,154,0,0.1)]",
            iconColor: "text-[#C7861E]",
            icon: <TrendingDown className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Inventory Cost"),
            value: String(
              stats.outOfStock ??
                items.filter((i) => i.status === "Out Of Stock").length
            ),
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
            icon: <AlertTriangle className="size-5" />,
          }}
        />
      </div>

      {/* Inventory Details Table */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between px-4 py-5 sm:px-5">
          <span className="text-[18px] font-bold text-[#333333]">
            {t("Inventory Details")}
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
          <table className="w-full min-w-[820px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={TH}>{t("Product")}</th>
                <th className={`${TH} text-center`}>{t("Category")}</th>
                <th className={`${TH} text-center`}>{t("Quantity")}</th>
                <th className={`${TH} text-center`}>{t("Min. amount")}</th>
                <th className={`${TH} text-center`}>{t("Days Remaining")}</th>
                <th className={`${TH} text-center`}>{t("Urgency")}</th>
                <th className={`${TH} text-center`}>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("No inventory items found")}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#E5E5E5] hover:bg-[#FAFAF7] transition-colors"
                  >
                    <td className={`${TD} font-medium text-[#333333]`}>
                      {item.name}
                    </td>
                    <td className={`${TD} text-center uppercase text-[#28293D]`}>
                      {item.category ?? "-"}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {item.currentQuantity}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {item.minimumQuantity ?? 0}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {item.daysRemaining != null ? item.daysRemaining : "-"}
                    </td>
                    <td className={`${TD} text-center text-[#595959]`}>
                      {item.urgencyLevel ?? "-"}
                    </td>
                    <td className={`${TD} text-center`}>
                      <span
                        className={`inline-flex items-center rounded-[30px] px-3 py-1 text-[13px] font-medium ${
                          STOCK_STATUS_STYLES[item.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {t(item.status)}
                      </span>
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

export default InventoryReportTab;
