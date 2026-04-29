import { useState, useMemo } from "react";
import {
  RefreshCw,
  Save,
  Package,
  AlertTriangle,
  Coffee,
  TrendingUp,
} from "lucide-react";

import OverviewCard from "@/shared/components/OverviewCard";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";

import { cn } from "@/lib/utils";

import StockStatusTab from "./components/StockStatusTab";
import {
  INVENTORY_PRODUCTS,
  INVENTORY_OVERVIEW,
  SHORTAGE_PRODUCTS,
} from "./data";
import type { InventoryTab } from "./types";
import ExpectedShortagesTab from "./components/ExpectedShortagesTab";

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>("stock");
  // productId -> adjusted quantity
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const hasChanges = Object.keys(adjustments).length > 0;

  const handleAdjust = (productId: string, value: number) => {
    const original =
      INVENTORY_PRODUCTS.find((p) => p.id === productId)?.currentQuantity ?? 0;
    if (value === original) {
      // no longer dirty — remove from adjustments
      setAdjustments((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else {
      setAdjustments((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const handleSaveEdits = () => {
    // TODO: call save API with adjustments
    console.log("Saving adjustments:", adjustments);
    setAdjustments({});
  };

  const handleSync = () => {
    // TODO: trigger synchronization API
    console.log("Synchronizing inventory...");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">Inventory</h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Manage stock levels across all kitchen stations and the main
              warehouse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Synchronization button — always active */}
            <button
              onClick={handleSync}
              className="flex items-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-5 py-3 text-[14px] font-semibold text-[#28293D] hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            >
              <RefreshCw size={15} />
              synchronization
            </button>

            {/* Save Edits — active only when adjustments exist */}
            <button
              onClick={hasChanges ? handleSaveEdits : undefined}
              className={cn(
                "flex items-center gap-2 rounded-[8px] px-5 py-3 text-[14px] font-semibold transition-colors",
                hasChanges
                  ? "bg-[#5C4A0E] text-white hover:bg-[#4A3A08] cursor-pointer"
                  : "border border-[#E5E5E5] bg-white text-[#AAAAAA] cursor-not-allowed"
              )}
            >
              <Save size={15} />
              Save Edits
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <OverviewCard
            data={{
              title: "Total Products",
              value: INVENTORY_OVERVIEW.totalProducts,
              icon: <Package size={18} />,
              iconColor: "text-[#7A6518]",
              badgeColor: "bg-[#FFF3DC]",
            }}
          />
          <OverviewCard
            data={{
              title: "Low Stock",
              value: INVENTORY_OVERVIEW.lowStock,
              icon: <AlertTriangle size={18} />,
              iconColor: "text-[#B56C00]",
              badgeColor: "bg-[#FFF5DC]",
            }}
          />
          <OverviewCard
            data={{
              title: "Out Of Stock",
              value: INVENTORY_OVERVIEW.outOfStock,
              icon: <Coffee size={18} />,
              iconColor: "text-[#C90000]",
              badgeColor: "bg-[#FFF0F0]",
            }}
          />
          <OverviewCard
            data={{
              title: "Inventory Value",
              value: INVENTORY_OVERVIEW.inventoryValue as unknown as number,
              icon: <TrendingUp size={18} />,
              iconColor: "text-[#1A7A45]",
              badgeColor: "bg-[#E0F5EC]",
            }}
          />
        </div>

        {/* Tabs */}
        <div className="mb-4 grid grid-cols-2 gap-x-1.5 gap-y-1">
          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={cn(
              "relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors flex items-center justify-center gap-2",
              activeTab === "stock"
                ? "text-[#333333] font-medium"
                : "text-[#8B8B8B] hover:text-[#8B8B8B]"
            )}
          >
            Stock status
            <span
              className={cn(
                "absolute right-0 bottom-0 left-0 h-0.5 transition-all",
                activeTab === "stock" ? "bg-primary" : "bg-[#8B8B8B]"
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shortages")}
            className={cn(
              "relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors flex items-center justify-center gap-2",
              activeTab === "shortages"
                ? "text-[#333333] font-medium"
                : "text-[#8B8B8B] hover:text-[#8B8B8B]"
            )}
          >
            Expected shortages
            <span
              className={cn(
                "absolute right-0 bottom-0 left-0 h-0.5 transition-all",
                activeTab === "shortages" ? "bg-primary" : "bg-[#8B8B8B]"
              )}
            />
          </button>
        </div>

        {activeTab === "stock" ? (
          <StockStatusTab
            products={INVENTORY_PRODUCTS}
            adjustments={adjustments}
            onAdjust={handleAdjust}
          />
        ) : (
          <ExpectedShortagesTab products={SHORTAGE_PRODUCTS} />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
