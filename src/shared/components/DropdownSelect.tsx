import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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
}: DropdownSelectProps) => {
  const normalizedOptions = normalizeOptions(options);
  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === selected)?.label ??
    placeholder;

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
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
        {normalizedOptions.map((option) => (
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
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelect;
