import DropdownSelect from "@/shared/components/DropdownSelect";
import { ORDER_CATEGORY_OPTIONS } from "../data";
import type { OrderCategory } from "../types";
import SearchInputField from "@/shared/components/SearchInputField";

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
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
      <SearchInputField
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search products..."
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
