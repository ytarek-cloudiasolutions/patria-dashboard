import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export type CouponTypeFilter = "All Categories" | "Fixed" | "Percentage";

const COUPON_TYPE_OPTIONS: CouponTypeFilter[] = [
  "All Categories",
  "Fixed",
  "Percentage",
];

const formatTypeLabel = (type: CouponTypeFilter) => {
  if (type === "Fixed") return "Fixed Price (EGP)";
  if (type === "Percentage") return "Percentage (%)";
  return type;
};

interface CouponsFiltersProps {
  searchValue: string;
  selectedType: CouponTypeFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: CouponTypeFilter) => void;
}

const CouponsFilters = ({
  searchValue,
  selectedType,
  onSearchChange,
  onTypeChange,
}: CouponsFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8B8B8B]" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search coupons..."
          className="h-11 rounded-[8px] border-[#CACBD4] bg-white pl-10 text-[14px] placeholder:text-[#8B8B8B] focus-visible:ring-0"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 w-full justify-between rounded-[8px] border-[#E5E5E5] bg-white px-4.5 py-3 font-medium cursor-pointer focus-visible:border-[#E5E5E5] focus-visible:ring-0 md:w-62.5"
          >
            {formatTypeLabel(selectedType)}
            <ChevronDown className="size-6 text-[#000000]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="z-70 w-62.5 p-2 ring-0 rounded-[16px]"
        >
          {COUPON_TYPE_OPTIONS.map((type) => (
            <DropdownMenuItem
              key={type}
              className={`px-3 py-2 font-medium rounded-[17px] ${
                selectedType === type
                  ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                  : "text-[#28293D]"
              }`}
              onSelect={() => onTypeChange(type)}
            >
              {formatTypeLabel(type)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CouponsFilters;
