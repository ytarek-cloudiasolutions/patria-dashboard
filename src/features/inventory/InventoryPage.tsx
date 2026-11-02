import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  Coffee,
  MoveUp,
  RefreshCw,
  Save,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import OverviewCard from "@/shared/components/OverviewCard";
import SearchInputField from "@/shared/components/SearchInputField";
import TabItem from "@/shared/components/TabItem";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { useInventory } from "./hooks/useInventory";
import StockStatusTable from "./components/StockStatusTable";
import ExpectedShortagesTable from "./components/ExpectedShortagesTable";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useWarehouses } from "@/features/warehouses/hooks/useWarehouses";
import type { Warehouse as UiWarehouse } from "@/features/warehouses/types";
import { useCategories } from "@/features/categories";
import InventoryBulkActionBar, {
  type BulkQuantityMode,
  type WarehouseOption,
} from "./components/InventoryBulkActionBar";

type InventoryTab = "stock" | "shortages";

interface InventoryPageProps {
  initialWarehouseId?: string;
  warehouse?: UiWarehouse;
  onBack?: () => void;
}

const InventoryPage = ({
  initialWarehouseId,
  warehouse: propWarehouse,
  onBack,
}: InventoryPageProps = {}) => {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { warehouseId: paramWarehouseId } = useParams<{ warehouseId?: string }>();

  const passedWarehouse =
    propWarehouse ??
    (location.state as { warehouse?: UiWarehouse } | undefined)?.warehouse;

  const isWarehouseRoute = Boolean(paramWarehouseId || initialWarehouseId || onBack);

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
  const [warehouseId, setWarehouseId] = useState(
    () => initialWarehouseId || paramWarehouseId || "",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adjustments, setAdjustments] = useState<Record<string | number, number>>({});
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string | number>>(new Set());
  const [infiniteItemIds, setInfiniteItemIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const targetId = initialWarehouseId || paramWarehouseId;
    if (targetId !== undefined) {
      setWarehouseId(targetId);
    }
  }, [initialWarehouseId, paramWarehouseId]);

  const activeWarehouse = useMemo<UiWarehouse | null>(() => {
    if (!warehouseId) return null;
    const matched = warehouses.find(
      (w: any) => (w._id || w.id) === warehouseId,
    );
    if (matched) {
      const id = (matched as any)._id ?? (matched as any).id ?? warehouseId;
      return {
        id,
        shortId: String(id).slice(-6).toUpperCase(),
        name: matched.name ?? "",
        address: matched.address ?? (matched as any).location ?? "",
        kind: matched.type === "sub" ? "Sub Warehouse" : "Main Warehouse",
      };
    }
    if (passedWarehouse && passedWarehouse.id === warehouseId) {
      return passedWarehouse;
    }
    return null;
  }, [warehouseId, warehouses, passedWarehouse]);

  const handleBackToWarehouses = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/warehouses");
    }
  };

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
    if (!isWarehouseRoute) {
      getShortagesList();
    }
    getWarehouses();
    getCategories();
  }, [isWarehouseRoute, getShortagesList, getWarehouses, getCategories]);

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
    const inventoryValue = backendStats.inventoryValue ?? 0;
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

  const warehouseOptions: WarehouseOption[] = useMemo(() => {
    if (isWarehouseRoute && warehouseId) {
      const currentLabel =
        activeWarehouse?.name ||
        warehouses.find((w: any) => (w._id || w.id) === warehouseId)?.name ||
        warehouseId;
      return [{ value: warehouseId, label: currentLabel }];
    }
    return [
      { value: "", label: t("All Warehouses") },
      ...warehouses.map((w: any) => ({ value: w._id || w.id, label: w.name })),
    ];
  }, [isWarehouseRoute, warehouseId, activeWarehouse, warehouses, t]);

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
    const targetWarehouseId = isWarehouseRoute
      ? initialWarehouseId || paramWarehouseId || warehouseId
      : newWarehouseId;

    if (!isWarehouseRoute && targetWarehouseId !== warehouseId) {
      setWarehouseId(targetWarehouseId);
    }

    const productIds = Array.from(selectedItemIds).map(String);
    if (productIds.length === 0 || !targetWarehouseId) return;

    executeBulkStockAction({
      warehouseId: targetWarehouseId,
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
      bulkUpdateItemsStock({
        updates: updatesToUpdate,
        ...(warehouseId ? { warehouseId } : {}),
      });
    }
    setAdjustments({});
    setSelectedItemIds(new Set());
  };

  const isLoading = !inventoryLoaded || (!isWarehouseRoute && !shortagesLoaded);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Box className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {isWarehouseRoute ? (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("Back to Warehouses")}
              className="group/back size-12 rounded-2xl bg-white cursor-pointer hover:bg-white hover:shadow-xs active:scale-95 transition-all duration-200"
              onClick={handleBackToWarehouses}
            >
              {dir === "rtl" ? (
                <ArrowRight className="size-5 transition-transform duration-200 group-hover/back:translate-x-0.5" />
              ) : (
                <ArrowLeft className="size-5 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
              )}
            </Button>

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-full",
                  activeWarehouse?.kind === "Sub Warehouse"
                    ? "bg-[#E5E8D3] text-[#444A18]"
                    : "bg-[#F5F0EA] text-primary",
                )}
              >
                <Box className="size-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[24px] font-bold text-[#28293D] sm:text-[28px]">
                    {activeWarehouse?.name || t("Inventory")}
                  </h1>
                  {activeWarehouse && (
                    <span
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border px-3 py-1 text-[13px] font-medium leading-none transition-colors",
                        activeWarehouse.kind === "Sub Warehouse"
                          ? "bg-[#E5E8D3] text-[#444A18] border-[#444A18]/30"
                          : "bg-[#F5F0EA] text-primary border-primary/30",
                      )}
                    >
                      {t(activeWarehouse.kind)}
                    </span>
                  )}
                </div>
                <p className="text-[14px] text-[#8B8B8B]">
                  {activeWarehouse?.address ||
                    t(
                      "Manage stock levels across all kitchen stations and the main warehouse.",
                    )}
                </p>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        <div className="flex items-center gap-4">
          <DefaultButton
            data={{
              onClick: syncInventory,
              icon: (
                <RefreshCw className="size-4 transition-transform duration-500 group-hover:rotate-180" />
              ),
              buttonText: t("synchronization"),
              className: cn(
                "cursor-pointer transition-all duration-200 hover:shadow-xs active:scale-[0.98] group",
                activeTab === "shortages"
                  ? ""
                  : "bg-[#f5f0ea] text-[#8f6900] hover:bg-[#ebdcc9]"
              ),
            }}
          />

          {activeTab === "stock" && (
            <DefaultButton
              data={{
                onClick: handleSaveEdits,
                icon: (
                  <Save className="size-4 transition-transform duration-200 group-hover:scale-110" />
                ),
                buttonText: t("Save Edits"),
                className: hasAdjustments
                  ? "cursor-pointer transition-all duration-200 hover:shadow-xs active:scale-[0.98] group"
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
      {!isWarehouseRoute && (
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
      )}

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
              onSelect={(val) => {
                if (!isWarehouseRoute) setWarehouseId(val);
              }}
              disabled={isWarehouseRoute}
              placeholder={t("All Warehouses")}
              align="start"
              className="h-12 w-full"
            />
          </div>
        )}
      </div>

      {/* Bulk Action Bar (Figma .frame-2147224183) */}
      {activeTab === "stock" && selectedItemIds.size > 0 && (
        <div className="mb-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <InventoryBulkActionBar
            selectedCount={selectedItemIds.size}
            warehouses={warehouseOptions}
            selectedWarehouse={warehouseId}
            onSelectWarehouse={(val) => {
              if (!isWarehouseRoute) setWarehouseId(val);
            }}
            warehouseDisabled={isWarehouseRoute}
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
    </section>
  );
};

export default InventoryPage;
