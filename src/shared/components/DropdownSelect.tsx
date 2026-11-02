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
  onSearchChange,
  isLoading = false,
  disabled = false,
}: DropdownSelectProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedOptions = normalizeOptions(options);
  const isSelected = Boolean(selected && selected !== "");
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

  const filteredOptions = onSearchChange
    ? normalizedOptions
    : normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <DropdownMenu
      open={disabled ? false : undefined}
      onOpenChange={disabled ? undefined : handleOpenChange}
    >
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "group h-12 w-full justify-between rounded-[12px] border-[#E5E5E5]",
            "bg-white px-4 py-3 text-[14px] font-medium cursor-pointer transition-all duration-200 ease-out",
            "hover:bg-[#FAFAF7] hover:border-[#8F6900]/40 data-[state=open]:bg-white data-[state=open]:border-primary",
            "focus-visible:border-[#E5E5E5] focus-visible:ring-0",
            disabled && "cursor-not-allowed opacity-75 hover:bg-white hover:border-[#E5E5E5]",
            className
          )}
        >
          <span className={cn("truncate", isSelected ? "text-[#333333]" : "text-[#8B8B8B]")}>
            {selectedLabel}
          </span>
          <ChevronDown className="ml-2 size-5 shrink-0 text-[#333333] transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          "z-80 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] p-2 ring-0 rounded-[16px] flex flex-col gap-2 bg-white shadow-xl border border-[#E5E5E5]",
          contentClassName
        )}
      >
        {searchable && (
          <div
            className="sticky top-0 z-10 bg-white px-1 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                onSearchChange?.(val);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={t("Search products...")}
              className="h-10 w-full rounded-[10px] border border-[#E5E5E5] bg-white px-3 text-[14px] text-[#28293D] focus:outline-none focus:border-[#8F6900] placeholder:text-[#8B8B8B]"
              autoFocus
            />
          </div>
        )}
        <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
          {isLoading ? (
            <div className="px-4 py-2.5 text-[13px] text-[#8B8B8B] text-center font-normal">
              {t("Loading...")}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-2.5 text-[14px] text-[#8B8B8B] text-center font-normal">
              {t("No results found.")}
            </div>
          ) : (
            filteredOptions.map((option) => {
              if (option.isHeader) {
                return (
                  <div
                    key={option.value || option.label}
                    className="flex h-[34px] w-full items-center rounded-[4px] bg-[#F5F0EA] px-3 py-2 text-[12px] font-semibold text-black tracking-[0.24px] pointer-events-none select-none"
                  >
                    {t(option.label)}
                  </div>
                );
              }

              const isOptSelected = selected === option.value;
              const isLightSelection = option.isLightSelected;

              return (
                <DropdownMenuItem
                  key={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "flex min-h-10 w-full items-center rounded-[12px] px-3.5 py-2 text-[14px] font-medium tracking-[0.24px] cursor-pointer transition-colors outline-none",
                    option.disabled
                      ? "cursor-not-allowed text-black/20 text-[12px] tracking-[0.24px] data-disabled:opacity-100 data-disabled:pointer-events-none"
                      : isOptSelected
                        ? isLightSelection
                          ? "bg-[#F5F0EA] text-black font-semibold cursor-default data-highlighted:bg-[#F5F0EA] data-highlighted:text-black"
                          : "bg-[#8F6900] text-white font-semibold cursor-default data-highlighted:bg-[#8F6900] data-highlighted:text-white"
                        : "text-[#28293D] hover:bg-[#FAFAF7] data-highlighted:bg-[#FAFAF7] data-highlighted:text-[#28293D]"
                  )}
                  onSelect={() => onSelect(option.value)}
                >
                  {t(option.label)}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;