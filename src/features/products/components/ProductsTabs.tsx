import { CookingPot, LayoutGrid, Store } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ProductsTab } from "../types";

interface ProductsTabsProps {
  active: ProductsTab;
  onChange: (tab: ProductsTab) => void;
}

const ProductsTabs = ({ active, onChange }: ProductsTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-3 gap-1.5 border-b border-[#E5E5E5]">
      <TabItem
        value="products"
        label={t("Products")}
        icon={Store}
        isActive={active === "products"}
        onClick={(v) => onChange(v as ProductsTab)}
      />
      <TabItem
        value="recipes"
        label={t("Recipes")}
        icon={CookingPot}
        isActive={active === "recipes"}
        onClick={(v) => onChange(v as ProductsTab)}
      />
      <TabItem
        value="categories"
        label={t("Categories")}
        icon={LayoutGrid}
        isActive={active === "categories"}
        onClick={(v) => onChange(v as ProductsTab)}
      />
    </div>
  );
};

export default ProductsTabs;
