import { Coffee, Wrench } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ProductionTab } from "../types";

interface ProductionTabsProps {
  active: ProductionTab;
  onChange: (tab: ProductionTab) => void;
}

const ProductionTabs = ({ active, onChange }: ProductionTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-1.5">
      <TabItem
        value="roast"
        label={t("Roast")}
        icon={Coffee}
        isActive={active === "roast"}
        onClick={(v) => onChange(v as ProductionTab)}
      />
      <TabItem
        value="equipment"
        label={t("Equipment")}
        icon={Wrench}
        isActive={active === "equipment"}
        onClick={(v) => onChange(v as ProductionTab)}
      />
    </div>
  );
};

export default ProductionTabs;
