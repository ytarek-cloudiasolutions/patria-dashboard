import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { BarChart3, Box, ShoppingBag, Tag } from "lucide-react";
import type { ReportsTab } from "../types";

interface ReportsTabsProps {
  active: ReportsTab;
  onChange: (tab: ReportsTab) => void;
}

const ReportsTabs = ({ active, onChange }: ReportsTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-1.5 border-b border-[#E5E5E5] sm:grid-cols-4">
      <TabItem
        value="orders"
        label={t("Orders")}
        isActive={active === "orders"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="sales"
        label={t("Sales")}
        isActive={active === "sales"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="inventory"
        label={t("Inventory")}
        isActive={active === "inventory"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="discounts"
        label={t("Administrative discounts")}
        isActive={active === "discounts"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
    </div>
  );
};

export default ReportsTabs;
