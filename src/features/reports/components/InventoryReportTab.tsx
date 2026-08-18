import { useEffect, useState } from "react";
import { FileDown, Banknote, Box, TrendingDown, CircleDollarSign } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { api } from "@/config/api";

const TH = "px-4 py-3.5 text-[13px] font-semibold text-[#28293D] uppercase tracking-wide";
const TD = "px-4 py-4 text-[14px] text-[#28293D]";

interface InventoryReportTabProps {
  warehouse?: string;
}

interface InventoryProduct {
  _id: string;
  id?: string;
  name: string;
  code?: string;
  categoryId?: { _id: string; name: string } | null;
  category?: string;
  stockQty?: number;
  currentQuantity?: number;
  lowStockThreshold?: number;
  minimumQuantity?: number;
  price?: number;
  value?: number;
  status: string;
}

interface InventoryStats {
  totalProducts?: number;
  inventoryValue?: number;
  inventoryCost?: number;
  lowStock?: number;
  outOfStock?: number;
}

const InventoryReportTab = ({
  warehouse,
}: InventoryReportTabProps) => {
  const { t } = useTranslation();
  const { items: reduxItems, stats: reduxStats, getInventoryList } = useInventory();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [stats, setStats] = useState<InventoryStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (warehouse && warehouse !== "All") params.warehouseId = warehouse;

    api
      .get("/inventory", { params })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? {};
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        getInventoryList();
      })
      .finally(() => setLoading(false));
  }, [warehouse, getInventoryList]);

  const displayProducts: InventoryProduct[] =
    products.length > 0
      ? products
      : reduxItems.map((item) => ({
          _id: String(item.id),
          id: String(item.id),
          name: item.name,
          category: item.category,
          currentQuantity: item.currentQuantity,
          minimumQuantity: item.minimumQuantity,
          status: item.status,
        }));

  const displayStats = {
    inventoryValue: stats.inventoryValue ?? reduxStats.inventoryValue ?? 0,
    totalProducts: stats.totalProducts ?? reduxStats.totalProducts ?? displayProducts.length,
    lowStock: stats.lowStock ?? reduxStats.lowStock ?? displayProducts.filter((p) => (p.status ?? "").toLowerCase().includes("low")).length,
    inventoryCost: stats.inventoryCost ?? stats.outOfStock ?? reduxStats.outOfStock ?? displayProducts.filter((p) => (p.status ?? "").toLowerCase().includes("out")).length,
  };

  const getStatusBadge = (statusStr: string) => {
    const norm = (statusStr ?? "").toLowerCase().replace(/_/g, " ");
    if (norm === "in stock" || norm === "available") {
      return {
        label: t("Available"),
        className: "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
      };
    }
    if (norm === "low stock") {
      return {
        label: t("Low Stock"),
        className: "bg-[rgba(254,154,0,0.1)] text-[#C7861E] border border-[#C7861E]",
      };
    }
    if (norm === "out of stock") {
      return {
        label: t("Out Of Stock"),
        className: "bg-[#D9D9D9] text-[#28293D] border border-[#595959] font-bold",
      };
    }
    return {
      label: t(statusStr ?? "-"),
      className: "bg-gray-100 text-gray-600",
    };
  };

  const handleExportCSV = () => {
    if (displayProducts.length === 0) return;
    const headers = [
      t("Product"),
      t("Code"),
      t("Category"),
      t("Quantity"),
      t("Min. amount"),
      t("Value"),
      t("Status"),
    ];
    const csvRows = displayProducts.map((p) => {
      const cat = typeof p.categoryId === "object" && p.categoryId ? p.categoryId.name : (p.category ?? "-");
      const qty = p.stockQty ?? p.currentQuantity ?? 0;
      const minQty = p.lowStockThreshold ?? p.minimumQuantity ?? 0;
      const val = p.value != null ? p.value : p.price != null ? p.price * qty : 0;
      const st = getStatusBadge(p.status).label;
      return [p.name, p.code ?? "-", cat, String(qty), String(minQty), `EGP ${val.toFixed(2)}`, st];
    });
    const csv = [headers, ...csvRows].map((r) => r.join(",")).join("\n");
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
            value: `EGP ${displayStats.inventoryValue.toLocaleString()}`,
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-[#8F6900]",
            icon: <Banknote className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Total Units"),
            value: String(displayStats.totalProducts),
            badgeColor: "bg-[#EDF4FB]",
            iconColor: "text-blue-500",
            icon: <Box className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Low Stock"),
            value: String(displayStats.lowStock),
            badgeColor: "bg-[rgba(254,154,0,0.1)]",
            iconColor: "text-[#C7861E]",
            icon: <TrendingDown className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Inventory Cost"),
            value: `EGP ${displayStats.inventoryCost.toLocaleString()}`,
            badgeColor: "bg-[#C90000]",
            iconColor: "text-white",
            icon: <CircleDollarSign className="size-5 text-white" />,
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
          <table className="w-full min-w-[850px]">
            <thead className="bg-[#F5F0EA]">
              <tr>
                <th className={`${TH} text-left`}>{t("Product")}</th>
                <th className={`${TH} text-center`}>{t("Code")}</th>
                <th className={`${TH} text-center`}>{t("Category")}</th>
                <th className={`${TH} text-center`}>{t("Quantity")}</th>
                <th className={`${TH} text-center`}>{t("Min. amount")}</th>
                <th className={`${TH} text-center`}>{t("Value")}</th>
                <th className={`${TH} text-center`}>{t("Status")}</th>
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
              ) : displayProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-[13px] text-[#8B8B8B]"
                  >
                    {t("No inventory items found")}
                  </td>
                </tr>
              ) : (
                displayProducts.map((item) => {
                  const categoryName =
                    typeof item.categoryId === "object" && item.categoryId
                      ? item.categoryId.name
                      : item.category ?? "-";
                  const qty = item.stockQty ?? item.currentQuantity ?? 0;
                  const minAmt = item.lowStockThreshold ?? item.minimumQuantity ?? 0;
                  const val = pVal(item, qty);
                  const statusInfo = getStatusBadge(item.status);

                  return (
                    <tr
                      key={item._id || item.id}
                      className="border-t border-[#E5E5E5] hover:bg-[#FAFAF7] transition-colors"
                    >
                      <td className={`${TD} font-medium text-[#28293D]`}>
                        {item.name}
                      </td>
                      <td className={`${TD} text-center text-[#595959]`}>
                        {item.code ?? "-"}
                      </td>
                      <td className={`${TD} text-center uppercase text-[#28293D]`}>
                        {categoryName}
                      </td>
                      <td className={`${TD} text-center text-[#595959]`}>
                        {qty}
                      </td>
                      <td className={`${TD} text-center text-[#595959]`}>
                        {minAmt}
                      </td>
                      <td className={`${TD} text-center text-[#595959]`} dir="ltr">
                        EGP {val.toFixed(2)}
                      </td>
                      <td className={`${TD} text-center`}>
                        <span
                          className={`inline-flex items-center rounded-[30px] px-3 py-1 text-[13px] font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const pVal = (item: InventoryProduct, qty: number): number => {
  if (item.value != null) return Number(item.value);
  if (item.price != null) return Number(item.price) * qty;
  return 0;
};

export default InventoryReportTab;
