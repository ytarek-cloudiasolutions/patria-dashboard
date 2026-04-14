import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { TierFilter } from "../../types";

interface CustomerTableFiltersProps {
  searchTerm: string;
  selectedTier: TierFilter;
  onSearchChange: (value: string) => void;
  onTierChange: (value: TierFilter) => void;
}

const CustomerTableFilters = ({
  searchTerm,
  selectedTier,
  onSearchChange,
  onTierChange,
}: CustomerTableFiltersProps) => {
  const tierOptions: TierFilter[] = ["All", "Gold", "Silver", "Bronze"];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_370px]">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, role, people or date..."
          className="h-13 w-full rounded-xl border border-[#CACBD4] bg-white pl-12 pr-4 text-[16px] outline-none transition-colors placeholder:text-[#8B8B8B] focus:border-[#B3B3C1]"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-13 flex w-full items-center justify-between rounded-xl border border-[#CACBD4] bg-white px-5 text-[16px] text-[#1E1E1E] outline-none transition-colors focus-visible:border-[#B3B3C1]"
            aria-label="Filter customers by tier"
          >
            {selectedTier === "All" ? "Tier" : selectedTier}
            <ChevronDown className="text-black" size={22} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-(--radix-dropdown-menu-trigger-width)"
        >
          {tierOptions.map((option) => {
            const isSelected = selectedTier === option;

            return (
              <DropdownMenuItem
                key={option}
                onSelect={() => onTierChange(option)}
                className={
                  isSelected
                    ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    : ""
                }
              >
                {option === "All" ? "Tier" : option}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerTableFilters;
