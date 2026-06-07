import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Box,
  Coffee,
  MoveUp,
  Package,
  PackageX,
  RefreshCw,
  Save,
  TrendingUp,
} from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import SearchInputField from "@/shared/components/SearchInputField";
import TabItem from "@/shared/components/TabItem";
import DefaultButton from "@/shared/components/DefaultButton";
import { INVENTORY_VALUE, MOCK_INVENTORY } from "./data";
import type { InventoryItem } from "./types";
import StockStatusTable from "./components/StockStatusTable";
import ExpectedShortagesTable from "./components/ExpectedShortagesTable";
import { useTranslation } from "@/shared/i18n/useTranslation";

type InventoryTab = "stock" | "shortages";

const InventoryPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [activeTab, setActiveTab] = useState<InventoryTab>("stock");
  const [search, setSearch] = useState("");
  const [adjustments, setAdjustments] = useState<Record<number, number>>({});

  const hasAdjustments = Object.keys(adjustments).length > 0;

  const stats = useMemo(
    () => ({
      total: items.length,
      lowStock: items.filter((i) => i.status === "Low Stock").length,
      outOfStock: items.filter((i) => i.status === "Out Of Stock").length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  const handleAdjust = (id: number, value: number) => {
    setAdjustments((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveEdits = () => {
    if (!hasAdjustments) return;
    setItems((prev) =>
      prev.map((item) =>
        adjustments[item.id] !== undefined
          ? { ...item, currentQuantity: adjustments[item.id] }
          : item,
      ),
    );
    setAdjustments({});
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#28293D] sm:text-[32px]">
            {t("Inventory")}
          </h1>
          <p className="text-[14px] text-[#8B8B8B]">
            {t(
              "Manage stock levels across all kitchen stations and the main warehouse.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DefaultButton
            data={{
              icon: <RefreshCw className="size-4" />,
              buttonText: t("synchronization"),
              className:
                activeTab === "shortages"
                  ? ""
                  : "bg-[#f5f0ea] text-[#8f6900]",
            }}
          />

          {activeTab === "stock" && (
            <DefaultButton
              data={{
                onClick: handleSaveEdits,
                icon: <Save className="size-4" />,
                buttonText: t("Save Edits"),
                className: hasAdjustments
                  ? ""
                  : "bg-[#dcdcdc] text-[#8b8b8b] hover:bg-[#dcdcdc] pointer-events-none",
              }}
            />
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <OverviewCard
          data={{
            title: t("Total Products"),
            value: stats.total,
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-primary",
            icon: <Box className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Low Stock"),
            value: stats.lowStock,
            badgeColor: "bg-[#FFF8E6]",
            iconColor: "text-[#C7861E]",
            icon: <AlertTriangle className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Out Of Stock"),
            value: stats.outOfStock,
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
            icon: <Coffee className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Inventory Value"),
            value: `EGP ${INVENTORY_VALUE.toLocaleString()}`,
            badgeColor: "bg-[#E2F4ED]",
            iconColor: "text-[#059B5A]",
            icon: <MoveUp className="size-5" />,
          }}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-1.5">
        <TabItem
          value="stock"
          label={t("Stock status")}
          isActive={activeTab === "stock"}
          onClick={(v) => setActiveTab(v as InventoryTab)}
        />
        <TabItem
          value="shortages"
          label={t("Expected shortages")}
          isActive={activeTab === "shortages"}
          onClick={(v) => setActiveTab(v as InventoryTab)}
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchInputField
          value={search}
          onChange={setSearch}
          placeholder={t("Search products...")}
        />
      </div>

      {/* Table */}
      {activeTab === "stock" ? (
        <StockStatusTable
          items={filteredItems}
          adjustments={adjustments}
          onAdjust={handleAdjust}
        />
      ) : (
        <ExpectedShortagesTable items={filteredItems} />
      )}
    </>
  );
};

export default InventoryPage;
