export interface DropdownSelectOption {
  label: string;
  value: string;
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
}
