import type { LucideIcon } from "lucide-react";

export interface TabItemProps {
  value: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
  isActive: boolean;
  onClick: (value: string) => void;
}
