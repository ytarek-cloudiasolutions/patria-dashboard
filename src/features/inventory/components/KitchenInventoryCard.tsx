import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ArrowUp,
  Box,
  ChefHat,
  Info,
  Coffee,
  Croissant,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { InventoryStatus, KitchenInventorySummary } from "../types";

interface KitchenInventoryCardProps {
  kitchen: KitchenInventorySummary;
  onOpenKitchen: (kitchenId: string) => void;
}

const iconMap: Record<KitchenInventorySummary["icon"], LucideIcon> = {
  main: ChefHat,
  barista: Coffee,
  pastry: Croissant,
};

const statusStyles: Record<
  InventoryStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    trackColor: string;
    icon: LucideIcon;
  }
> = {
  critical: {
    label: "critical",
    bgColor: "#FFF0F0",
    textColor: "#C90000",
    trackColor: "#059B5A",
    icon: Info,
  },
  low: {
    label: "low",
    bgColor: "#FE9A001A",
    textColor: "#C7861E",
    trackColor: "#C90000",
    icon: TriangleAlert,
  },
  normal: {
    label: "Normal",
    bgColor: "#F5F0EA",
    textColor: "#8F6900",
    trackColor: "#F5F0EA",
    icon: Box,
  },
  excess: {
    label: "excess",
    bgColor: "#E2F4ED",
    textColor: "#059B5A",
    trackColor: "#C7861E",
    icon: ArrowUp,
  },
};

const KitchenInventoryCard = ({
  kitchen,
  onOpenKitchen,
}: KitchenInventoryCardProps) => {
  const Icon = iconMap[kitchen.icon];

  const statusItems: InventoryStatus[] = [
    "critical",
    "low",
    "normal",
    "excess",
  ];

  return (
    <Card
      className="cursor-pointer rounded-[16px] bg-white py-0 ring-0"
      style={{ borderTop: `9px solid ${kitchen.accentColor}` }}
      onClick={() => onOpenKitchen(kitchen.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenKitchen(kitchen.id);
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="flex size-11.5 items-center justify-center rounded-[11.15px]"
              style={{
                color: kitchen.accentColor,
                backgroundColor: `${kitchen.accentColor}1A`,
              }}
            >
              <Icon className="size-6" />
            </div>
            <div>
              <h3 className="text-[20px] leading-none font-bold text-[#333333]">
                {kitchen.name}
              </h3>
              <p className="mt-2 text-[16px] text-[#8B8B8B]">
                {kitchen.totalTrackedItems} items tracked
              </p>
            </div>
          </div>

          <Badge
            className="rounded-[30px] px-3 py-1 text-[13px] font-semibold"
            style={{ backgroundColor: "#EDF8F0", color: "#059B5A" }}
          >
            Active
          </Badge>
        </div>

        <div className="mt-6 flex h-2 w-full gap-0.5 rounded-[16px] bg-[#F2F2F2] p-px">
          {statusItems.map((status) => {
            const value = kitchen.distribution[status];

            if (value === 0) {
              return null;
            }

            return (
              <span
                key={status}
                className="h-full rounded-[16px] border border-[#E5E5E5]"
                style={{
                  flex: value,
                  backgroundColor: statusStyles[status].trackColor,
                }}
              />
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {statusItems.map((status) => {
            const count = kitchen.distribution[status];
            const StatusIcon = statusStyles[status].icon;

            if (count === 0) {
              return null;
            }

            return (
              <Badge
                key={status}
                className="rounded-[30px] px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  backgroundColor: statusStyles[status].bgColor,
                  color: statusStyles[status].textColor,
                }}
              >
                <StatusIcon className="mr-1 size-3" aria-hidden />
                {count} {statusStyles[status].label}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenInventoryCard;
