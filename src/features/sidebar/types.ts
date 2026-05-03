import type { LucideIcon } from "lucide-react";

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
