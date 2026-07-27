import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type {
  DropdownSelectOption,
  DropdownSelectProps,
} from "../types/DropdownSelect.types";

const normalizeOptions = (
  options: DropdownSelectOption[] | string[]
): DropdownSelectOption[] =>
  options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

const DropdownSelect = ({
  options,
  selected,
  onSelect,
  onOpenChange,
  placeholder = "Select...",
  className,
  contentClassName,
  align = "end",
  searchable = false,
  onSearchChange,
  isLoading = false,
}: DropdownSelectProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedOptions = normalizeOptions(options);
  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === selected)?.label ??
    placeholder;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery("");
      onSearchChange?.("");
    }
    onOpenChange?.(open);
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "group/dropdown h-[50px] w-full justify-between rounded-[12px] border-[#E5E5E5]",
            "bg-white px-4.5 py-3 text-[16px] font-normal text-[#000000] cursor-pointer transition-colors",
            "hover:bg-white data-[state=open]:bg-white data-[state=open]:border-primary",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            "sm:w-full md:w-78",
            className
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="ml-2 size-6 shrink-0 text-[#000000] transition-transform duration-200 group-data-[state=open]/dropdown:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side="bottom"
        sideOffset={6}
        className={cn(
          "z-50 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] p-2 shadow-lg rounded-[16px] space-y-1 bg-white border border-[#E5E5E5]",
          contentClassName
        )}
      >
        {searchable && (
          <div
            className="px-2 py-1.5 border-b border-[#E5E5E5] mb-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={t("Search...")}
              className="h-9 w-full rounded-[8px] border border-[#E5E5E5] px-2.5 text-[13px] text-[#28293D] focus:outline-none focus:border-primary placeholder:text-[#8B8B8B]"
              autoFocus
            />
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="size-4 animate-spin text-primary" />
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-[13px] text-[#8B8B8B] text-center font-medium">
            {t("No results found.")}
          </div>
        ) : (
          filteredOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "px-3.5 py-2.5 text-[14px] font-medium rounded-[12px] cursor-pointer transition-colors outline-none",
                selected === option.value
                  ? "bg-primary text-white font-semibold focus:bg-primary focus:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white"
                  : "text-[#28293D] hover:bg-[#F5F0EA] focus:bg-[#F5F0EA] focus:text-[#28293D] data-[highlighted]:bg-[#F5F0EA] data-[highlighted]:text-[#28293D]"
              )}
              onSelect={() => onSelect(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;

