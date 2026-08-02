import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { FinancialTab } from "../types";

interface FinancialTabsProps {
  active: FinancialTab;
  onChange: (tab: FinancialTab) => void;
}

const FinancialTabs = ({ active, onChange }: FinancialTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-3 gap-1.5">
      <TabItem
        value="overview"
        label={t("Overview")}
        isActive={active === "overview"}
        onClick={(v) => onChange(v as FinancialTab)}
      />
      <TabItem
        value="expenses"
        label={t("Expenses")}
        isActive={active === "expenses"}
        onClick={(v) => onChange(v as FinancialTab)}
      />
      <TabItem
        value="salaries"
        label={t("Salaries")}
        isActive={active === "salaries"}
        onClick={(v) => onChange(v as FinancialTab)}
      />
    </div>
  );
};

export default FinancialTabs;
