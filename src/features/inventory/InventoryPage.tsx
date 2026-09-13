import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Box,
  Coffee,
  MoveUp,
  RefreshCw,
  Save,
} from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import SearchInputField from "@/shared/components/SearchInputField";
import TabItem from "@/shared/components/TabItem";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useInventory } from "./hooks/useInventory";
import StockStatusTable from "./components/StockStatusTable";
import ExpectedShortagesTable from "./components/ExpectedShortagesTable";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useWarehouses } from "@/features/warehouses/hooks/useWarehouses";
import { useCategories } from "@/features/categories";
import InventoryBulkActionBar, {
  type BulkQuantityMode,
  type WarehouseOption,
} from "./components/InventoryBulkActionBar";

type InventoryTab = "stock" | "shortages";

const InventoryPage = () => {
  const { t } = useTranslation();
  const {
    items,
    shortages,
    stats: backendStats,
    loading,
    getInventoryList,
    getShortagesList,
    syncInventory,
    bulkUpdateItemsStock,
    executeBulkStockAction,
  } = useInventory();

  const { warehouses, getWarehouses } = useWarehouses();
  const { categories, getCategories } = useCategories();
  const [activeTab, setActiveTab] = useState<InventoryTab>("stock");
  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adjustments, setAdjustments] = useState<Record<string | number, number>>({});
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string | number>>(new Set());
  const [infiniteItemIds, setInfiniteItemIds] = useState<Set<string | number>>(new Set());

  const hasAdjustments =
    Object.keys(adjustments).length > 0 || infiniteItemIds.size > 0;

  const [inventoryLoaded, setInventoryLoaded] = useState(false);
  const [shortagesLoaded, setShortagesLoaded] = useState(false);

  const inventoryStarted = useRef(loading.fetch);
  const shortagesStarted = useRef(loading.fetchShortages);

  useEffect(() => {
    if (loading.fetch) {
      inventoryStarted.current = true;
    } else if (inventoryStarted.current) {
      setInventoryLoaded(true);
    }
  }, [loading.fetch]);

  useEffect(() => {
    if (loading.fetchShortages) {
      shortagesStarted.current = true;
    } else if (shortagesStarted.current) {
      setShortagesLoaded(true);
    }
  }, [loading.fetchShortages]);

  // Fetch lists on mount
  useEffect(() => {
    getShortagesList();
    getWarehouses();
    getCategories();
  }, [getShortagesList, getWarehouses, getCategories]);

  // Re-fetch stock whenever the selected warehouse or category changes — sends
  // warehouseId and categoryId as query parameters to GET /inventory
  useEffect(() => {
    getInventoryList({
      warehouseId: warehouseId || undefined,
      categoryId: selectedCategory || undefined,
    });
  }, [getInventoryList, warehouseId, selectedCategory]);

  // Determine current active source items
  const activeItems = activeTab === "stock" ? items : shortages;

  const stats = useMemo(() => {
    const total = backendStats.totalProducts || items.length;
    const lowStock = backendStats.lowStock ?? items.filter((i) => i.status === "Low Stock").length;
    const outOfStock = backendStats.outOfStock ?? items.filter((i) => i.status === "Out Of Stock").length;
    const inventoryValue = backendStats.inventoryValue || 12000;
    return {
      total,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  }, [backendStats, items]);

  const categoryOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [
      { value: "", label: t("All Categories") },
    ];
    const seen = new Set<string>();

    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        const id = c.id || (c as any)._id;
        if (c.name && id && !seen.has(id)) {
          seen.add(id);
          options.push({ value: id, label: c.name });
        }
      });
    }

    activeItems.forEach((i) => {
      if (i.category) {
        const matchingCat = categories.find(
          (c) => c.name?.toLowerCase() === i.category?.toLowerCase()
        );
        const val = matchingCat?.id || (matchingCat as any)?._id || i.category;
        if (!seen.has(val)) {
          seen.add(val);
          options.push({ value: val, label: i.category });
        }
      }
    });

    return options;
  }, [categories, activeItems, t]);

  const filteredItems = useMemo(() => {
    let result = activeItems;

    if (selectedCategory) {
      const catObj = categories.find(
        (c) => c.id === selectedCategory || c.name === selectedCategory
      );
      const catName = (catObj?.name || selectedCategory).toLowerCase();
      const catId = (catObj?.id || selectedCategory).toLowerCase();

      result = result.filter((i) => {
        const itemCat = (i.category || "").toLowerCase();
        return itemCat === catName || itemCat === catId;
      });
    }

    if (search.trim()) {
      result = result.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [activeItems, search, selectedCategory, categories]);

  const warehouseOptions: WarehouseOption[] = useMemo(
    () => [
      { value: "", label: t("All Warehouses") },
      ...warehouses.map((w: any) => ({ value: w._id || w.id, label: w.name })),
    ],
    [warehouses, t]
  );

  const isAllSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedItemIds.has(item.id));
  const isIndeterminate =
    !isAllSelected &&
    filteredItems.some((item) => selectedItemIds.has(item.id));

  const handleToggleSelect = (id: string | number) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const handleAdjust = (id: string | number, value: number) => {
    setAdjustments((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyBulkQuantity = ({
    mode,
    quantity,
    isInfinite,
    warehouseId: newWarehouseId,
  }: {
    mode: BulkQuantityMode;
    quantity: number | null;
    isInfinite: boolean;
    warehouseId: string;
  }) => {
    if (newWarehouseId !== warehouseId) {
      setWarehouseId(newWarehouseId);
    }

    const productIds = Array.from(selectedItemIds).map(String);
    if (productIds.length === 0) return;

    executeBulkStockAction({
      warehouseId: newWarehouseId,
      productIds,
      mode: isInfinite ? "infinite" : mode,
      quantity: isInfinite ? undefined : (quantity ?? 0),
      postOpeningBalance: !isInfinite,
    });

    setSelectedItemIds(new Set());
  };

  const handleSaveEdits = () => {
    if (!hasAdjustments) return;
    const updatesToUpdate = Object.entries(adjustments).map(([id, quantity]) => ({
      id,
      quantity,
    }));
    if (updatesToUpdate.length > 0) {
      bulkUpdateItemsStock({ updates: updatesToUpdate });
    }
    setAdjustments({});
    setSelectedItemIds(new Set());
  };

  const isLoading = !inventoryLoaded || !shortagesLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Box className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
              onClick: syncInventory,
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
            badgeColor: "bg-[#C90000]",
            iconColor: "text-white",
            icon: <Coffee className="size-5" />,
          }}
        />
        <OverviewCard
          data={{
            title: t("Inventory Value"),
            value: `EGP ${stats.inventoryValue.toLocaleString()}`,
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

      {/* Search + Category + Warehouse filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 sm:flex-[1.4] min-w-0">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search products...")}
          />
        </div>
        <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[220px] sm:max-w-[300px]">
          <DropdownSelect
            options={categoryOptions}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            placeholder={t("All Categories")}
            align="start"
            className="h-12 w-full"
          />
        </div>
        {activeTab === "stock" && (
          <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[220px] sm:max-w-[300px]">
            <DropdownSelect
              options={warehouseOptions}
              selected={warehouseId}
              onSelect={setWarehouseId}
              placeholder={t("All Warehouses")}
              align="start"
              className="h-12 w-full"
            />
          </div>
        )}
      </div>

      {/* Bulk Action Bar (Figma .frame-2147224183) */}
      {activeTab === "stock" && selectedItemIds.size > 0 && (
        <div className="mb-4">
          <InventoryBulkActionBar
            selectedCount={selectedItemIds.size}
            warehouses={warehouseOptions}
            selectedWarehouse={warehouseId}
            onSelectWarehouse={setWarehouseId}
            onApply={handleApplyBulkQuantity}
            isLoading={loading.update}
          />
        </div>
      )}

      {/* Table */}
      {activeTab === "stock" ? (
        <StockStatusTable
          items={filteredItems}
          adjustments={adjustments}
          onAdjust={handleAdjust}
          selectedItemIds={selectedItemIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
          infiniteItemIds={infiniteItemIds}
        />
      ) : (
        <ExpectedShortagesTable items={filteredItems} />
      )}
    </>
  );
};

export default InventoryPage;
