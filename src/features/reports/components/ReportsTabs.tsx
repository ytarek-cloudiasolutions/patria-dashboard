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
        icon={ShoppingBag}
        isActive={active === "orders"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="sales"
        label={t("Sales")}
        icon={BarChart3}
        isActive={active === "sales"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="inventory"
        label={t("Inventory")}
        icon={Box}
        isActive={active === "inventory"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
      <TabItem
        value="discounts"
        label={t("Administrative discounts")}
        icon={Tag}
        isActive={active === "discounts"}
        onClick={(v) => onChange(v as ReportsTab)}
      />
    </div>
  );
};

export default ReportsTabs;
