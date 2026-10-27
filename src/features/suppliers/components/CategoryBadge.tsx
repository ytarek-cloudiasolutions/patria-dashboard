import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  label: string;
}

const CategoryBadge = ({ label }: CategoryBadgeProps) => (
  <Badge
    className={cn(
      "h-6 px-2.5 py-0 text-[11px] font-semibold uppercase tracking-wide border rounded-full",
      "bg-primary text-white border-[#624F1C] transition-transform duration-150 hover:scale-105",
    )}
  >
    {label}
  </Badge>
);

export default CategoryBadge;
