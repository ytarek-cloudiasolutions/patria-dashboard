import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ORDER_STATUS_OPTIONS } from "../data";
import type { OrderStatusFilter } from "../types";

interface OrdersFiltersProps {
  searchValue: string;
  selectedCategory: OrderStatusFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: OrderStatusFilter) => void;
  onCategoryMenuOpenChange?: (open: boolean) => void;
}

const categories: OrderStatusFilter[] = [
  "All Categories",
  ...ORDER_STATUS_OPTIONS,
];

const OrdersFilters = ({
  searchValue,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onCategoryMenuOpenChange,
}: OrdersFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8B8B8B]" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products.."
          className="h-11 rounded-[8px] border-[#CACBD4] bg-white pl-10 text-[14px] text-000000-16-normal placeholder:text-8B8B8B-16-normal focus-visible:ring-0"
        />
      </div>

      <DropdownMenu onOpenChange={onCategoryMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 w-full justify-between rounded-[8px] border-[#E5E5E5] bg-white px-4.5 py-3 text-000000-16-medium cursor-pointer focus-visible:border-[#E5E5E5] focus-visible:ring-0 md:w-62.5"
          >
            {selectedCategory}
            <ChevronDown className="size-6 text-[#000000]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-70 w-62.5 p-2 ring-0 rounded-[16px]">
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              className={`px-3 py-2 text-000000-16-medium rounded-[17px] ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                  : "text-[#28293D]"
              }`}
              onSelect={() => onCategoryChange(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrdersFilters;
