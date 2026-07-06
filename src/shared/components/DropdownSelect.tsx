import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    }
    onOpenChange?.(open);
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
            "h-12 w-full justify-between rounded-[12px] border-[#E5E5E5]",
            "bg-white px-4 py-3 text-[14px] font-medium text-[#000000] cursor-pointer",
            "hover:bg-white data-[state=open]:bg-white",
            "focus-visible:border-[#E5E5E5] focus-visible:ring-0",
            "sm:w-full md:w-78",
            className
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="ml-2 size-6 shrink-0 text-[#000000]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          "z-70 w-[var(--radix-dropdown-menu-trigger-width)] p-2 ring-0 rounded-[16px] space-y-1 md:w-78",
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={t("Search...")}
              className="h-9 w-full rounded-[8px] border border-[#E5E5E5] px-2.5 text-[13px] text-[#28293D] focus:outline-none focus:border-primary placeholder:text-[#8B8B8B]"
              autoFocus
            />
          </div>
        )}
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-[13px] text-[#8B8B8B] text-center font-medium">
            {t("No results found.")}
          </div>
        ) : (
          filteredOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "px-3 py-2 text-[14px] font-medium rounded-[16px] cursor-pointer",
                selected === option.value
                  ? "bg-primary text-primary-foreground pointer-events-none"
                  : "text-[#28293D] data-highlighted:bg-[#F5F0EA]"
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

