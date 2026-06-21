import { CalendarDays, Clock, TrendingUp } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ShiftReportsTab } from "../types";

interface ShiftReportsTabsProps {
  active: ShiftReportsTab;
  onChange: (tab: ShiftReportsTab) => void;
}

const ShiftReportsTabs = ({ active, onChange }: ShiftReportsTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-3 gap-1.5 border-b border-[#E5E5E5]">
      <TabItem
        value="daily"
        label={t("Daily Report")}
        icon={CalendarDays}
        isActive={active === "daily"}
        onClick={(v) => onChange(v as ShiftReportsTab)}
      />
      <TabItem
        value="most-selling"
        label={t("Most Selling")}
        icon={TrendingUp}
        isActive={active === "most-selling"}
        onClick={(v) => onChange(v as ShiftReportsTab)}
      />
      <TabItem
        value="shifts"
        label={t("Shift reports")}
        icon={Clock}
        isActive={active === "shifts"}
        onClick={(v) => onChange(v as ShiftReportsTab)}
      />
    </div>
  );
};

export default ShiftReportsTabs;
