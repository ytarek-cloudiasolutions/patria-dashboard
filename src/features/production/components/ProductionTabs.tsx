import { Coffee, Wrench } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import type { ProductionTab } from "../types";

interface ProductionTabsProps {
  active: ProductionTab;
  onChange: (tab: ProductionTab) => void;
}

const ProductionTabs = ({ active, onChange }: ProductionTabsProps) => (
  <div className="mb-6 grid grid-cols-2 gap-1.5">
    <TabItem
      value="roast"
      label="Roast"
      icon={Coffee}
      isActive={active === "roast"}
      onClick={(v) => onChange(v as ProductionTab)}
    />
    <TabItem
      value="equipment"
      label="Equipment"
      icon={Wrench}
      isActive={active === "equipment"}
      onClick={(v) => onChange(v as ProductionTab)}
    />
  </div>
);

export default ProductionTabs;
