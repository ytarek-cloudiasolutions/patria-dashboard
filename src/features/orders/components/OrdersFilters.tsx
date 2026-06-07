import DropdownSelect from "@/shared/components/DropdownSelect";
import { ORDER_CATEGORY_OPTIONS } from "../data";
import type { OrderCategory } from "../types";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface OrdersFiltersProps {
  searchValue: string;
  selectedCategory: OrderCategory;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: OrderCategory) => void;
  onCategoryMenuOpenChange?: (open: boolean) => void;
}

const OrdersFilters = ({
  searchValue,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onCategoryMenuOpenChange,
}: OrdersFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
      <SearchInputField
        value={searchValue}
        onChange={onSearchChange}
        placeholder={t("Search products...")}
      />
      <DropdownSelect
        options={ORDER_CATEGORY_OPTIONS}
        selected={selectedCategory}
        onSelect={(value) => onCategoryChange(value as OrderCategory)}
        onOpenChange={onCategoryMenuOpenChange}
        align="end"
      />
    </div>
  );
};

export default OrdersFilters;
