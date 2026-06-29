import DropdownSelect from "@/shared/components/DropdownSelect";
import { ORDER_STATUS_FILTER_OPTIONS } from "../data";
import type { OrderStatusFilter } from "../types";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface OrdersFiltersProps {
  searchValue: string;
  selectedStatus: OrderStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: OrderStatusFilter) => void;
  onStatusMenuOpenChange?: (open: boolean) => void;
}

const OrdersFilters = ({
  searchValue,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onStatusMenuOpenChange,
}: OrdersFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
      <SearchInputField
        value={searchValue}
        onChange={onSearchChange}
        placeholder={t("Search orders...")}
      />
      <DropdownSelect
        options={ORDER_STATUS_FILTER_OPTIONS}
        selected={selectedStatus}
        onSelect={(value) => onStatusChange(value as OrderStatusFilter)}
        onOpenChange={onStatusMenuOpenChange}
        align="end"
      />
    </div>
  );
};

export default OrdersFilters;
