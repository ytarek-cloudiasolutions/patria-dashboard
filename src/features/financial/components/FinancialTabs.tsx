import TabItem from "@/shared/components/TabItem";
import type { FinancialTab } from "../types";

interface FinancialTabsProps {
  active: FinancialTab;
  onChange: (tab: FinancialTab) => void;
}

const FinancialTabs = ({ active, onChange }: FinancialTabsProps) => (
  <div className="mb-6 grid grid-cols-3 gap-1.5">
    <TabItem
      value="overview"
      label="Overview"
      isActive={active === "overview"}
      onClick={(v) => onChange(v as FinancialTab)}
    />
    <TabItem
      value="expenses"
      label="Expenses"
      isActive={active === "expenses"}
      onClick={(v) => onChange(v as FinancialTab)}
    />
    <TabItem
      value="salaries"
      label="Salaries"
      isActive={active === "salaries"}
      onClick={(v) => onChange(v as FinancialTab)}
    />
  </div>
);

export default FinancialTabs;
