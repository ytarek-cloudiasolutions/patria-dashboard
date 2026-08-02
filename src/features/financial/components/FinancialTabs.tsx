import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { FinancialTab } from "../types";

interface FinancialTabsProps {
  active: FinancialTab;
  onChange: (tab: FinancialTab) => void;
}

const TABS: { key: FinancialTab; label: string }[] = [
  { key: "accountant-dashboard", label: "Accountant Dashboard" },
  { key: "expenses", label: "Expenses" },
  { key: "inventory-count", label: "Inventory Count" },
  { key: "adjustments-wastage", label: "Adjustments & Wastage" },
  { key: "opening-balance", label: "Opening Balance" },
  { key: "item-balance", label: "Item Balance" },
  { key: "item-stock-record", label: "Item Stock Record" },
  { key: "reorder", label: "Reorder" },
  { key: "cost-analysis", label: "Cost Analysis" },
  { key: "consumption", label: "Consumption" },
  { key: "production-orders", label: "Production Orders" },
];

const FinancialTabs = ({ active, onChange }: FinancialTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 border-b border-[#E5E5E5] overflow-x-auto no-scrollbar">
      <nav className="flex gap-6 min-w-max">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "pb-3 text-[14px] font-medium transition-colors relative whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-[#333333] font-semibold border-b-2 border-[#8F6900]"
                  : "text-[#8B8B8B] hover:text-[#333333]"
              )}
            >
              {t(tab.label)}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default FinancialTabs;
