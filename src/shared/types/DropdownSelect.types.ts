export interface DropdownSelectOption {
  label: string;
  value: string;
  isHeader?: boolean;
  isLightSelected?: boolean;
}

export interface DropdownSelectProps {
  options: DropdownSelectOption[] | string[];
  selected: string;
  onSelect: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  searchable?: boolean;
  onSearchChange?: (query: string) => void;
  isLoading?: boolean;
}
