import {
  Award,
  DollarSign,
  Package,
  Smile,
  Truck,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { HighestRatedItem } from "../types";

interface HighestRatedCardProps {
  items: HighestRatedItem[];
}

interface IconStyle {
  Icon: LucideIcon;
  iconColor: string;
  bg: string;
}

const FALLBACK_ICON: IconStyle = {
  Icon: Award,
  iconColor: "text-[#7A6518]",
  bg: "bg-[#F5F0EA]",
};

const ICON_STYLES: Record<string, IconStyle> = {
  "Driver friendliness": {
    Icon: Truck,
    iconColor: "text-primary",
    bg: "bg-[#F5F0EA]",
  },
  "Service speed": {
    Icon: Zap,
    iconColor: "text-[#155DFC]",
    bg: "bg-[#DBEAFE]",
  },
  "Value for money": {
    Icon: DollarSign,
    iconColor: "text-[#9524E4]",
    bg: "bg-[#F3E9FA]",
  },
  "Food quality": {
    Icon: Utensils,
    iconColor: "text-[#7A1A7A]",
    bg: "bg-[#F5E0F5]",
  },
  Packaging: {
    Icon: Package,
    iconColor: "text-[#5C6EAE]",
    bg: "bg-[#E0E8F5]",
  },
};

const HighestRatedCard = ({ items }: HighestRatedCardProps) => (
  <Card className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
    {/* Tinted header */}
    <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-3 sm:px-6 sm:py-4">
      <h3 className="text-[15px] font-semibold text-[#28293D] sm:text-[16px]">
        Highest Rated
      </h3>
      <Award className="size-6 text-[#000000]" />
    </div>

    <div className="flex flex-col gap-2.5 px-5 py-5 sm:px-6 sm:py-6">
      {items.map((item) => {
        const { Icon, iconColor, bg } =
          ICON_STYLES[item.label] ?? FALLBACK_ICON;
        return (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex size-8 items-center justify-center rounded-[10px] ${bg}`}
                aria-hidden="true"
              >
                <Icon size={16} className={iconColor} />
              </span>
              <span className="text-[13px] font-medium text-[#28293D]">
                {item.label}
              </span>
            </div>
            <Badge className="h-5 w-5 rounded-full bg-[#F5F0EA] p-0 text-[11px] font-semibold text-[#8B8B8B]">
              {item.count}
            </Badge>
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="py-4 text-center text-[13px] text-[#8B8B8B]">
          No data yet.
        </p>
      )}
    </div>
  </Card>
);

export default HighestRatedCard;
